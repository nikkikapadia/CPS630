const admin = require("../config/firebase-config");

class Middleware {
    async decodeToken(req, res, next) {
        const paths = [/^\/api\/users\/new$/g, /^\/api\/ads\/get\/.*/g, /^\/api\/ads\/search/g, /^\/api\/places\/.*/g];

        // Check if the current route matches the specific regex
        if (paths.some(path => path.test(req.path) == true)) {
            // Skip the middleware if it doesn't match
            next();
        }
        else 
        {
            if (!req.headers.authorization) {
                console.log("Bad request. Require authorization token.");
                return res.status(400).json({ error: "Bad request. Require authorization token." });
            }

            const token = req.headers.authorization.split(" ")[1];
            try {
                const decodedValue = await admin.auth().verifyIdToken(token);
                if (decodedValue) {
                    req.requestingUser = decodedValue;
                    next();
                } 
                else {
                    console.log("Un-authorized request. Bad authentication token.");
                    return res.status(400).json({ error: "Un-authorized request. Bad authentication token." });
                }
            } 
            catch (error) {
                console.log(error);
                return res.status(400).json({error: "Internal error processing authentication token. Bad authentication token.",});
            }
        }
    }
}

module.exports = new Middleware();
