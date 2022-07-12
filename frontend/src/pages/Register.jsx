import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import {register, reset} from '../features/auth/authSlice'
import { useEffect } from 'react'
import Spinner from '../components/Spinner'

function Register() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (isSuccess) {
            toast.success(message)
            navigate('/')
        }
        if (isError) {
            toast.error(message)
        }

        dispatch(reset())
    }, [user, isLoading, isSuccess, isError, message, navigate, dispatch])

    const onChange = e => {setFormData((prevState) => ({...prevState, [e.target.name]: e.target.value, }))}

    const onSubmit = e => { 
        e.preventDefault() 
        if (password !== password2) {
            toast.error('Passwords do not match')
        }
        else {
            const userData = {
                name,
                email,
                password
            }

            dispatch(register(userData))
        }
        

    }

    if(isLoading) {
        return <Spinner />
    }

  return (
    <>
        <section className="heading">
            <h1>
                <FaUser />    Register
            </h1>
            <p>
                Please fill in this form to create an account
            </p>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}> 
                <div className="form-group">
                    <input type="text" required className="form-control" id='name' value={name} name='name' onChange={onChange} placeholder='Enter your name'/>
                </div>
                <div className="form-group">
                    <input type="text"  required className="form-control" id='email' value={email} name='email' onChange={onChange} placeholder='Enter your Email'/>
                </div>
                <div className="form-group">
                    <input type="text"  required className="form-control" id='password' value={password} name='password' onChange={onChange} placeholder='Enter your Password'/>
                </div>
                <div className="form-group">
                    <input type="text" required className="form-control" id='password2' value={password2} name='password2' onChange={onChange} placeholder='Confirm your Password'/>
                </div>
                <div className='form-control'>
                   <button className="btn btn-block">Submit</button> 
                </div>
            </form>
        </section>
    </>
  )
}

export default Register