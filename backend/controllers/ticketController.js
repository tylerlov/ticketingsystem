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

// @desc   Get user ticket
// @route  GET /api/ticket/:id
// @access Private

const getTicket = asyncHandler(async (req, res) => {
    //Get user using id and JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // getting ticket from url
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }   

    res.status(200).json(ticket)
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

// @desc   Delete user ticket
// @route  DELETE /api/ticket/:id
// @access Private

const deleteTicket = asyncHandler(async (req, res) => {
    //Get user using id and JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // getting ticket from url
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }   

    await ticket.remove()
    res.status(200).json({msg: 'Ticket removed'})
})

// @desc   Update user ticket
// @route  PUT /api/ticket/:id
// @access Private

const updateTicket = asyncHandler(async (req, res) => {
    //Get user using id and JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // getting ticket from url
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }   

    const updatedTicket = await ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true })
    // last parameter is an options object that creates the ticket if it isnt already there
    res.status(200).json(updatedTicket)
})
module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket,
}