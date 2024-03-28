const admin = require('../config/firebase-config');

class Middleware {
    async decodeToken(req, res, next) {
        if (!req.headers.authorization)
            return res.status(400).json({error: 'Bad request. Require authorization token.'});

        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedValue = await admin.auth().verifyIdToken(token);
            if (decodedValue) {
                req.requestingUser = decodedValue;
                next();
            }
            else
                return res.status(400).json({error: 'Un-authorized request. Bad authentication token.'});
        }
        catch(error) {
            console.log(error);
            return res.status(400).json({error: 'Internal error processing authentication token. Bad authentication token.'});
        }
    }
}

module.exports = new Middleware();