const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// GET /api/mock-sso/users
// Returns all users for simulation purposes
router.get('/users', async (req, res, next) => {
    try {
        const result = await db.query('SELECT id, full_name, email, username FROM USER_ACCOUNT ORDER BY full_name ASC');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/mock-sso/login
// Simulează pagina de login a universității (ucv.ro).
router.post('/login', async (req, res, next) => {
    try {
        const { role_simulation, user_id } = req.body;

        let ssoPayload = {};
        
        if (user_id) {
            // Find real user
            const result = await db.query(`
                SELECT u.*, r.code as role_code 
                FROM USER_ACCOUNT u
                LEFT JOIN USER_ROLE ur ON u.id = ur.user_id
                LEFT JOIN ROLE r ON ur.role_id = r.id
                WHERE u.id = $1
            `, [user_id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: true, message: 'User not found in simulation database.' });
            }
            
            const user = result.rows[0];
            ssoPayload = { 
                sso_subject: user.sso_subject || `sub_${user.id}`, 
                email: user.email, 
                full_name: user.full_name, 
                role: user.role_code || 'STUDENT' 
            };
        } else {
            // Legacy Role Simulation
            if (role_simulation === 'ADMIN') {
                ssoPayload = { sso_subject: 'admin_ucv_001', email: 'admin@ucv.ro', full_name: 'Admin Sistem', role: 'ADMIN' };
            } else if (role_simulation === 'PROFESSOR') {
                ssoPayload = { sso_subject: 'prof_ucv_001', email: 'profesor@ucv.ro', full_name: 'Profesor Inginerie', role: 'PROFESSOR' };
            } else if (role_simulation === 'SECRETARIAT') {
                ssoPayload = { sso_subject: 'secr_ucv_001', email: 'secretariat@ucv.ro', full_name: 'Secretariat Fictiv', role: 'SECRETARIAT' };
            } else {
                ssoPayload = { sso_subject: 'stud_ucv_001', email: 'student@ucv.ro', full_name: 'Student Fictiv', role: 'STUDENT' };
            }
        }

        // Semnăm token-ul cu o cheie "a universității"
        const ssoToken = jwt.sign(
            ssoPayload, 
            process.env.SSO_MOCK_SECRET || 'cheie_secreta_universitate', 
            { expiresIn: '15m' }
        );

        res.json({ success: true, ssoToken });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
