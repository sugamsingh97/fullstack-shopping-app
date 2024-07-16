import bycrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

// signup endpoint
export const signup = async (req, res) => {
  try {
    // destructuring the req.body
    const { fullName, username, password, confirmPassword, gender, userRole } =
      req.body;

    //checking if all the fields are provided
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      //if any of the fields are not provided, send a response
      return res.status(400).json({
        message: 'Please provide all the required fields.',
      });
    }

    //checking if the password and confirmPassword are the same
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirmed passwords do not match.',
      });
    }

    //checking if the username already exists
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({
        message: 'Username already exists.',
      });
    }

    //this genSalt function set the level of difficulty for the password
    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(password, salt);

    //just providing random profile picture
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    //creating a new user
    const newUser = new User({
      fullName,
      username,
      password: hashPassword,
      gender,
      userRole,
      profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    //saving the new user to the database
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        fullName: newUser.fullName,
        username: newUser.username,
        gender: newUser.gender,
        userRole: newUser.userRole,
        profilePicture: newUser.profilePicture,
      });
    } else {
      //if there is an error, log it and send a response
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    /// if there is an error, log it and send a response
    console.log('Error in signup controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// login endpoint
export const login = async (req, res) => {
  try {
    // destructuring the req.body
    const { username, password } = req.body;

    //checking if all the fields are provided
    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide all the required fields.',
      });
    }

    //checking if the username already exists
    const user = await User.findOne({ username });

    //checking if the password is correct
    const decPassword = await bycrypt.compare(password, user?.password || '');

    //checking if the user exists and if the password is correct
    if (!user || !decPassword) {
      res.status(400).json({ error: 'Invalid username or password' });
    }

    //if the user exists and the password is correct, generate a token and send it as a cookie
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      fullName: user.fullName,
      username: user.username,
      gender: user.gender,
      userRole: user.userRole,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    // if there is an error, log it and send a response
    console.log('Error in login controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

// logout endpoint
export const logout = (req, res) => {
  try {
    //deleting the cookie
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'internal server error' });
  }
};
