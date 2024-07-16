import mongoose from 'mongoose';

const useSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    // by default everyone who signups is a client. bacause there is only one owner
    userRole: {
      type: String,
      required: true,
      enum: ['client', 'owner'],
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);
// we arte using the schema above to make a user model in db
const User = mongoose.model('User', useSchema);
export default User;
