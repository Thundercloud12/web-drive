// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: { 
      type: String, 
      required: true 
    },
    surname: { 
      type: String, 
      required: true 
    },
    feesReceiptNo: { 
      type: String, 
      required: true 
    },
    idCardImage: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    username: { 
      type: String 
    },
    password: { 
      type: String, 
    },
    role: { 
      type: String, 
      default: 'user' // admin or user
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

export default User;
