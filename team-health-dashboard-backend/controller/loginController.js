const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../modules/userModules');

const ACCESS_TOKEN_SECRET = 'f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd1'
const REFRESH_TOKEN_SECRET = "4f7a0c3d6f9e2b5c8d1f4a7b0c3e6d9f2a5b8c1e4f";

let refreshTokens = [];

const loginController = {
    async login(req, res) {
        const { username, password } = req.body;

        const user = await userModel.getUserByUsername(username, password);
        console.log("User: " + JSON.stringify(user))

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const userPayload = {
            userId: user.user_id, 
            role: user.role, 
            darkMode: user.dark_mode,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        };

        const accessToken = jwt.sign(
            userPayload,
            ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        );

        const refreshToken = jwt.sign(
             { userId: user.user_id },
             REFRESH_TOKEN_SECRET,
             {expiresIn: '1d'}
        );

        refreshTokens.push(refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            path: '/'
        });

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/'
        });

        res.cookie('userInfo', JSON.stringify({
            userId: user.user_id,
            role: user.role,
            darkMode: user.dark_mode,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name
        }), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({
            accessToken,
            user: userPayload
        });
    },

    async refresh(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({error: 'Refresh token required'});
        }

        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({error: 'Invalid refresh token'});
        }

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            const user = await userModel.getUser(decoded.userId);
            if (!user) {
                return res.status(403).json({error: 'User not found'});
            }

            const userPayload = {
                userId: user.user_id, 
                role: user.role, 
                darkMode: user.dark_mode,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            };

            const newAccessToken = jwt.sign(
                userPayload,
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m'}
            );

            const newRefreshToken = jwt.sign(
                { userId: user.user_id },
                REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            refreshTokens.push(newRefreshToken);
            
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000,
                path: '/'
            });

            res.cookie('token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, 
                path: '/'
            });

            res.cookie('userInfo', JSON.stringify({
                userId: user.user_id,
                role: user.role,
                darkMode: user.dark_mode,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name
            }), {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000,
                path: '/'
            });

            res.json({
                accessToken: newAccessToken,
                user: userPayload
            });
        } catch (error) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
    },

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            if (refreshToken) {
                refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            
            res.clearCookie('userInfo', {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });

            console.log('Cookies cleared on logout');
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Logout failed' });
        }
    },

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = loginController;