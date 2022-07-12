import React from 'react'
import { useState } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { name, email, password, password2 } = formData

    const onChange = e => {setFormData((prevState) => ({...prevState, [e.target.name]: e.target.value, }))}

    const onSubmit = e => { 
        e.preventDefault() 

    }

  return (
    <>
        <section className="heading">
            <h1>
                <FaSignInAlt />    Login
            </h1>
            <p>
                Please login to your account
            </p>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}> 
                <div className="form-group">
                    <input type="text"  required className="form-control" id='email' value={email} name='email' onChange={onChange} placeholder='Enter your Email'/>
                </div>
                <div className="form-group">
                    <input type="text"  required className="form-control" id='password' value={password} name='password' onChange={onChange} placeholder='Enter your Password'/>
                </div>
                <div className='form-control'>
                   <button className="btn btn-block">Submit</button> 
                </div>
            </form>
        </section>
    </>
  )
}

export default Login