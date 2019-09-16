const jwt = require('jsonwebtoken');
const secret = process.env.REACT_APP_SECRET;

const WithAuth = (req, res, next) => {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        res.user = decoded;
        next();
      }
    });
  }
};

const IsAdmin = (req, res, next) => {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        if (!decoded.isadmin) {
          res.status(401).send('Unauthorized: Not an admin');
        }

        res.user = decoded;
        next();
      }
    });
  }
}

module.exports = {
  WithAuth,
  IsAdmin
};