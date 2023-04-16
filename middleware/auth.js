const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../jwt/config');

const auth = async (req, res, next) => {
    try {  
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        // if user is custom esle user is auth via google, facebook etc...
        if (token && isCustomAuth) { 
            jwt.verify(token, JWT_SECRET);
        } else { 
            jwt.decode(token);
        }    

        next();
    } catch (error) {
      res.status(500).send({ error: error.message });  
    }
  };

module.exports = auth;
