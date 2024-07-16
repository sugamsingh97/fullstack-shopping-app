import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
  try {
    // getting the token from the cookies
    const token = req.cookies.jwt;

    // if there is no token, return an error
    if (!token) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action',
      });
    }

    // if there is a token, verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    // if the token is not valid, return an error
    if (!decoded) {
      return res.status(401).json({
        message: 'This token is no longer valid',
      });
    }

    // if the token is valid, find the user associated with the token
    const user = await User.findById(decoded.userId);

    // if the user is not found, return an error
    if (!user) {
      return res.status(401).json({
        message: 'No user found with this id',
      });
    }

    // assign the user to the request
    // be careful it is request not response
    req.user = user;

    // next function passes the req.user = user to the funtion next to it.
    next();
  } catch (error) {
    console.log('error in ProtectRoute sendMessage ', error.message);
    res.status(500).json({ error: 'internal server error' });
  }
};

export default protectRoute;
