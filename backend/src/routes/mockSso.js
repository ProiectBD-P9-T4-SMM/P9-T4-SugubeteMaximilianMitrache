const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/mock-sso/login
// Simulează pagina de login a universității (ucv.ro).
router.post('/login', (req, res) => {
    const { role_simulation } = req.body; // Ex: 'ADMIN', 'PROFESSOR', 'STUDENT'

    let ssoPayload = {};
    
    // Generăm date fictive trimise de universitate pe baza selecției
    if (role_simulation === 'ADMIN') {
        ssoPayload = { sso_subject: 'admin_ucv_001', email: 'admin@ucv.ro', full_name: 'Admin Sistem', role: 'ADMIN' };
    } else if (role_simulation === 'PROFESSOR') {
        ssoPayload = { sso_subject: 'prof_ucv_001', email: 'profesor@ucv.ro', full_name: 'Profesor Inginerie', role: 'PROFESSOR' };
    } else if (role_simulation === 'SECRETARIAT') {
        ssoPayload = { sso_subject: 'secr_ucv_001', email: 'secretariat@ucv.ro', full_name: 'Secretariat Fictiv', role: 'SECRETARIAT' };
    } else {
        ssoPayload = { sso_subject: 'stud_ucv_001', email: 'student@ucv.ro', full_name: 'Student Fictiv', role: 'STUDENT' };
    }

    // Semnăm token-ul cu o cheie "a universității" (în producție, AFSMS ar verifica semnătura publică a SSO-ului)
    const ssoToken = jwt.sign(
        ssoPayload, 
        process.env.SSO_MOCK_SECRET || 'cheie_secreta_universitate', 
        { expiresIn: '15m' } // Token-ul SSO e valabil puțin, doar pentru "exchange"
    );

    res.json({ success: true, ssoToken });
});

module.exports = router;
