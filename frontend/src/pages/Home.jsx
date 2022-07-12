import React from 'react'
import { Link } from 'react-router-dom'
import { FaQuestionCircle, FaTicketAlt } from 'react-icons/fa'

function Home() {
  return (
    <>
        <section className="heading">
            <h1>
                What do you need help with?
            </h1>
            <p>
                Please choose an option below
            </p>
        </section>
    <Link to='/newticket' className="btn btn-block btn-reverse">
        <FaQuestionCircle /> New Ticket
    </Link>
    <Link to='/tickets' className="btn btn-block btn-reverse">
        <FaTicketAlt /> View Tickets
    </Link>
    </>
  )
}

export default Home