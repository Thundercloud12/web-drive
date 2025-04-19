import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orgNumber: {
        type: String,
        required: true
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
     rentals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
    },
  ],

}, {timestamps: true})

export default mongoose.model('Admin', adminSchema)