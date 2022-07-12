const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    product: {
      type: String,
      required: [true,'Please select a product'],
      enum: ['iPhone','Macbook Pro','iMac','iPad']
    },
    description: {
      type: String,
      required: [true, "Please enter a description of the issue"],
    },
    status: {
      type: String,
      enum: ['open','new','closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  } // {timestamps: true} is a mongoose option that adds createdAt and updatedAt fields to the schema
);

module.exports = mongoose.model('Ticket', ticketSchema);