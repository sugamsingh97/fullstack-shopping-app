import User from '../models/user.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const LoggedInUserId = req.user.id;
    const checkRole = req.user.userRole === 'owner';
    if (checkRole) {
      const userList = await User.find({ _id: { $ne: LoggedInUserId } }).select(
        '-password'
      );
      if (userList.length > 0) {
        return res.status(200).json(userList);
      } else {
        return res.status(404).json({
          error: 'No users found',
        });
      }
    }
    if (!checkRole) {
      return res.status(401).json({
        error: 'Only Owner can view user lists.',
      });
    }
  } catch (error) {
    // if there is an error, log it and send a response
    console.log('Error in get all users', error.message);
    res.status(500).json({ error: error.message });
  }
};
