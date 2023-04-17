const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {  
    const token = req.headers.authorization?.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message });  
  }
};

module.exports = auth;
