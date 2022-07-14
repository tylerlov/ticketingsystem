const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

// @desc   Get user tickets
// @route  GET /api/tickets
// @access Private

const getTickets = asyncHandler(async (req, res) => {
    //Get user using id and JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const tickets = await Ticket.find({ user: req.user._id })

    res.status(200).json({tickets})
})

// @desc   Create a ticket
// @route  POST /api/tickets
// @access Private

const createTicket = asyncHandler(async (req, res) => {
    const { product, description } = req.body;

    if(!product || !description){
        res.status(400)
        throw new Error('Please provide a product and description')
    }

    //Get user using id and JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.create({
        product,
        description,
        user: req.user._id,
        status: 'new'
    })

    res.status(201).json(ticket)
})

module.exports = {
    getTickets,
    createTicket
}