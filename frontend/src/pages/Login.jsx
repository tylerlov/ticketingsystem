import React from 'react'
import { useState,useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isSuccess, isError, message, } = useSelector(state => state.auth)

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
        
        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

if (isLoading) {
    return <Spinner />
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