const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Modified from ../config/db to match project structure
const router = express.Router();

// POST /api/auth/exchange-token
// AFSMS primește token-ul de la universitate și generează sesiunea internă.
router.post('/exchange-token', async (req, res, next) => {
    try {
        const { ssoToken } = req.body;

        if (!ssoToken) {
            return res.status(400).json({ error: true, message: 'Lipsește token-ul SSO.' });
        }

        // 1. Validăm token-ul venit de la Universitate
        const decodedIdP = jwt.verify(ssoToken, process.env.SSO_MOCK_SECRET || 'cheie_secreta_universitate');

        const client = await db.getPool().connect(); // Fetch connection from pool
        try {
            await client.query('BEGIN'); // Începem o tranzacție sigură

            // 2. Căutăm utilizatorul în baza noastră pe baza 'sso_subject' (id-ul unic)
            const userRes = await client.query('SELECT * FROM USER_ACCOUNT WHERE sso_subject = $1', [decodedIdP.sso_subject]);
            let user = userRes.rows[0];

            // 3. Fluxul de Auto-Înregistrare (Prima logare a utilizatorului)
            if (!user) {
                // Inserăm utilizatorul
                const insertUser = await client.query(`
                    INSERT INTO USER_ACCOUNT (sso_subject, username, email, full_name)
                    VALUES ($1, $2, $3, $4) RETURNING *
                `, [decodedIdP.sso_subject, decodedIdP.email.split('@')[0], decodedIdP.email, decodedIdP.full_name]);

                user = insertUser.rows[0];

                // Îi acordăm dreptul pe baza SSO-ului (sau default STUDENT)
                const targetRole = decodedIdP.role || 'STUDENT';
                const roleRes = await client.query("SELECT id FROM ROLE WHERE code = $1", [targetRole]);
                if (roleRes.rows.length > 0) {
                    await client.query('INSERT INTO USER_ROLE (user_id, role_id) VALUES ($1, $2)', [user.id, roleRes.rows[0].id]);
                }

                // --- NEW: Auto-create STUDENT profile if role is STUDENT ---
                if (targetRole === 'STUDENT') {
                    await client.query('SAVEPOINT student_creation');
                    try {
                        const studentCheck = await client.query('SELECT id FROM STUDENT WHERE email = $1', [user.email]);
                        if (studentCheck.rows.length === 0) {
                            const regNum = 'MAT' + Date.now().toString().slice(-4) + Math.floor(10 + Math.random() * 89);
                            const names = user.full_name.split(' ');
                            const lastName = names[0] || 'Student';
                            const firstName = names.slice(1).join(' ') || 'Fictiv';
                            
                            await client.query(`
                                INSERT INTO STUDENT (registration_number, first_name, last_name, email, enrollment_date, status)
                                VALUES ($1, $2, $3, $4, CURRENT_DATE, 'ENROLLED')
                                ON CONFLICT (email) DO NOTHING
                            `, [regNum, firstName, lastName, user.email]);
                        }
                        await client.query('RELEASE SAVEPOINT student_creation');
                    } catch (studentErr) {
                        await client.query('ROLLBACK TO SAVEPOINT student_creation');
                        console.error('Non-critical error creating student profile:', studentErr);
                    }
                }
            } else if (decodedIdP.role) {
                // Sincronizare forțată a rolului la fiecare login pentru a facilita testarea SSO-ului
                const roleRes = await client.query("SELECT id FROM ROLE WHERE code = $1", [decodedIdP.role]);
                if (roleRes.rows.length > 0) {
                    await client.query('DELETE FROM USER_ROLE WHERE user_id = $1', [user.id]);
                    await client.query('INSERT INTO USER_ROLE (user_id, role_id) VALUES ($1, $2)', [user.id, roleRes.rows[0].id]);
                }

                // --- NEW: Also ensure STUDENT profile exists if role is synced to STUDENT ---
                if (decodedIdP.role === 'STUDENT') {
                    await client.query('SAVEPOINT student_creation_sync');
                    try {
                        const studentCheck = await client.query('SELECT id FROM STUDENT WHERE email = $1', [user.email]);
                        if (studentCheck.rows.length === 0) {
                            const regNum = 'MAT' + Date.now().toString().slice(-4) + Math.floor(10 + Math.random() * 89);
                            const names = user.full_name.split(' ');
                            const lastName = names[0] || 'Student';
                            const firstName = names.slice(1).join(' ') || 'Fictiv';
                            
                            await client.query(`
                                INSERT INTO STUDENT (registration_number, first_name, last_name, email, enrollment_date, status)
                                VALUES ($1, $2, $3, $4, CURRENT_DATE, 'ENROLLED')
                                ON CONFLICT (email) DO NOTHING
                            `, [regNum, firstName, lastName, user.email]);
                        }
                        await client.query('RELEASE SAVEPOINT student_creation_sync');
                    } catch (studentErr) {
                        await client.query('ROLLBACK TO SAVEPOINT student_creation_sync');
                        console.error('Non-critical error creating student profile:', studentErr);
                    }
                }
            }

            // 4. Aflăm rolul efectiv al utilizatorului (poate a fost promovat la Secretariat de către un Admin)
            const userRoleRes = await client.query(`
                SELECT r.code FROM ROLE r
                JOIN USER_ROLE ur ON r.id = ur.role_id
                WHERE ur.user_id = $1 LIMIT 1
            `, [user.id]);
            
            const roleCode = userRoleRes.rows.length > 0 ? userRoleRes.rows[0].code : 'STUDENT';

            await client.query('COMMIT');

            // 5. Generăm token-ul intern pentru AFSMS (Sesiunea portalului privat)
            const sessionToken = jwt.sign(
                { userId: user.id, role: roleCode, fullName: user.full_name },
                process.env.JWT_SECRET || 'cheie_secreta_afsms_2026',
                { expiresIn: '8h' }
            );

            // Returnăm datele curățate către frontend
            res.json({
                success: true,
                token: sessionToken,
                user: { 
                    id: user.id, 
                    fullName: user.full_name, 
                    role: roleCode 
                }
            });
        } catch (dbError) {
            await client.query('ROLLBACK');
            throw dbError; // Rethrow to be caught by outer catch block
        } finally {
            client.release(); // Return client to pool
        }

    } catch (error) {
        console.error('SSO Exchange Error:', error);
        res.status(401).json({ error: true, message: 'Autentificare SSO eșuată sau token invalid.' });
    }
});

// POST /api/auth/register
// Registers a new user and assigns the default STUDENT role (REQ-AFSMS-07, REQ-AFSMS-08)
router.post('/register', async (req, res, next) => {
  const client = await db.getPool().connect();
  try {
    const { username, email, fullName, ssoSubject } = req.body;

    if (!username || !email || !fullName) {
      const err = new Error('Missing required fields');
      err.status = 400;
      return next(err);
    }

    await client.query('BEGIN');

    // Insert user
    const insertUserQuery = `
      INSERT INTO USER_ACCOUNT (username, email, full_name, sso_subject, account_status)
      VALUES ($1, $2, $3, $4, 'ACTIVE')
      RETURNING id, username, email, full_name
    `;
    const userRes = await client.query(insertUserQuery, [username, email, fullName, ssoSubject || username]);
    const newUser = userRes.rows[0];

    // Find STUDENT role
    const roleRes = await client.query(`SELECT id FROM ROLE WHERE code = 'STUDENT' LIMIT 1`);
    if (roleRes.rows.length === 0) {
      throw new Error("Default STUDENT role not found in database.");
    }
    const roleId = roleRes.rows[0].id;

    // Assign role
    await client.query(`INSERT INTO USER_ROLE (user_id, role_id) VALUES ($1, $2)`, [newUser.id, roleId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'User registered successfully. You can now login.',
      user: newUser
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;
