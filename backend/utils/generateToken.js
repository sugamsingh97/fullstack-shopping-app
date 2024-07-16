// import jwt from 'jsonwebtoken';

// const generateTokenAndSetCookie = (userId, res) => {
//   // creating a token using the userId which will be passed
//   // and it is acompanied with the secret key
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '15d',
//   });

//   // a cookie is being sent to the browser and saved as 'jwt
//   res.cookie('jwt', token, {
//     maxAge: 15 * 24 * 60 * 60 * 1000, // MS
//     httpOnly: true, // prevent XSS attacks cross-site scripting attacks
//     sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
//     secure: process.env.NODE_ENV !== 'development',
//   });
// };
// export default generateTokenAndSetCookie;
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRETKEY, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development',
  });
};

export default generateTokenAndSetCookie;
