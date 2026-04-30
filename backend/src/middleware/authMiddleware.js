const jwt = require('jsonwebtoken');

// 1. Verifică autentificarea (Bariera Portalului - REQ-AFSMS-13)
const requireAuth = (req, res, next) => {
    // Extragem token-ul din header-ul 'Authorization: Bearer <token>'
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: true, 
            message: 'Acces interzis. Te rugăm să te autentifici prin SSO.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Validăm token-ul intern AFSMS
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cheie_secreta_afsms_2026');
        req.user = decoded; // Atașăm datele utilizatorului la request { userId, role }
        
        // FOARTE IMPORTANT PENTRU AUDIT:
        // Setăm ID-ul utilizatorului curent pentru funcția Trigger din PostgreSQL
        // (Pentru a funcționa, acest query trebuie executat pe aceeași conexiune, 
        // lucru care va fi tratat în serviciul de DB, dar informația este acum disponibilă în req.user)
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: true, 
            message: 'Sesiune invalidă sau expirată.' 
        });
    }
};

// 2. Verifică permisiunile bazate pe rol (Politica Least Privilege - REQ-AFSMS-14, 15)
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Dacă utilizatorul nu este setat (ex: s-a uitat requireAuth) sau rolul lui nu e în lista permisă
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            // Conform REQ-AFSMS-15, afișăm access-denied
            return res.status(403).json({ 
                error: true, 
                message: 'Access Denied: Nu aveți drepturi suficiente pentru a executa această operațiune.' 
            });
        }
        next();
    };
};

module.exports = { requireAuth, requireRole };
