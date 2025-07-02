const loginController = require('../controller/loginController');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Access token required'});
    }

    const decoded = loginController.verifyAccessToken(token);

    if(!decoded) {
        return res.status(403).json({
            error: 'Invalid or expired access token',
            code: 'TOKEN_EXPIRED'
        });
    }

    req.user = decoded;
    next();
}

const authenticateWithRefresh  = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = loginController.verifyAccessToken(token);
    if (decoded) {
        req.user = decoded;
        return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try{
        return res.status(401).json({
            error: 'Token expired', 
            code: 'TOKEN_EXPIRED',
            message: 'Please refresh your token'
        })
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    module.exports = { 
    authenticateToken, 
    authenticateWithRefresh 
};
}