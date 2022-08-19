import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

function NewTicket() {
  const {user} = useSelector((state) => state.auth)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [product, setProduct] = useState('')
  const [description, setDescription] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>
      <section className='form'>
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input type="text" className='form-control' name="name" value={name} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="email">Customer Email</label>
          <input type="text" className='form-control' name="email" value={email} disabled />
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
              <select name='product' id='product' value={product} onChange={(e) => setProduct(e.target.value)}>
                <option value='iPhone'>iPhone</option>
                <option value='Macbook Pro'>Macbook Pro</option>
                <option value='iMac'>iMac</option>
                <option value='iPad'>iPad</option>
              </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" className='fomr-control' id="description" value={description} onChange={(e) => setDescription(e.target.value)}>
            </textarea>
          </div>
          <div className="form-group">
            <input type="submit" className='btn btn-block' value='Create Ticket' />
          </div>
        </form>
      </section>
    </>
  )
}

export default NewTicket