const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({error : "Missing or invalid credentials."});
    }
    
    const token = header.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.user_id;
        next();
    }
    catch(err){
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token'});
    }
};