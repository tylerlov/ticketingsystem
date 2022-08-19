const express = require("express");
const router = express.Router();
const { getTicket, getTickets, createTicket, deleteTicket, updateTicket } = require("../controllers/ticketController");

const {protect} = require("../middleware/authMiddleware");

router.route('/').get(protect, getTickets)
                .post(protect, createTicket)

//need id in url for an individual ticket
router.route('/:id')
    .get(protect, getTicket)
    .delete(protect, deleteTicket)
    .put(protect, updateTicket)

module.exports = router;

