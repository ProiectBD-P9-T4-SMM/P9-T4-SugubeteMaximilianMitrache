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
            } else if (decodedIdP.role) {
                // Sincronizare forțată a rolului la fiecare login pentru a facilita testarea SSO-ului
                const roleRes = await client.query("SELECT id FROM ROLE WHERE code = $1", [decodedIdP.role]);
                if (roleRes.rows.length > 0) {
                    await client.query('DELETE FROM USER_ROLE WHERE user_id = $1', [user.id]);
                    await client.query('INSERT INTO USER_ROLE (user_id, role_id) VALUES ($1, $2)', [user.id, roleRes.rows[0].id]);
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
                { userId: user.id, role: roleCode },
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

module.exports = router;
