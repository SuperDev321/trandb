const { createError } = require('../utils');

const isAdmin = async (req, res, next) => {
    try {
        let user = req.userData;
        if(user && (user.role === 'admin' || user.role === 'super_admin')) {
            return next();
        } else {
            const errResponse = createError(
                403,
                'Forbidden',
                'you need to be admin to access this resource'
            );
            return res.status(403).json(errResponse);
        }
    } catch (err) {
        const errResponse = createError(
            403,
            'Forbidden',
            'you need to be admin to access this resource'
        );
        return res.status(403).json(errResponse);
    }
};

module.exports = isAdmin;
