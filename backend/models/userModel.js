const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  } // {timestamps: true} is a mongoose option that adds createdAt and updatedAt fields to the schema
);

module.exports = mongoose.model('User', userSchema);