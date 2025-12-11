import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    if (decoded.exp < Math.floor(Date.now() / 1000)) return res.status(401).send('Page expired');
    if (decoded.apikey !== process.env.APIKEY) return res.status(401).send('Invalid apikey');
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex)
    return res.status(400).send('Invalid token');
  }
};

export {
  verifyToken
}