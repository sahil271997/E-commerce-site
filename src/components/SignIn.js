import React, { useRef, useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from "../images/Icon.png";
import { useAuthContext } from '../context/authContext';

const SignIn = () => {
    const emailRef = useRef();
    const pswrdRef = useRef();

    const [showpass,setShowPass]=useState(false);

    // custom context
    const { logIn } = useAuthContext();
    const navigate = useNavigate();
    //  fuction to get input values and sign in and goig back to home page
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("try block!!!");
            const data = {
                email: emailRef.current.value,
                pswrd: pswrdRef.current.value,
            }
            await logIn(data);
            navigate("/");
        } catch (err) {
            console.log(err.message);
        }
    }
    
    return (
        <div className='container'>
            <div className='row mt-5 text-center'>
                <div className='col-lg-4 bg-white m-auto border-top border-3 rounded-top border-primary'>
                    <img src={Icon} className='mt-4' alt='logo' width="72" height="57" />
                    <h1 className='mb-3'>Log In</h1>
                    <form className='d-flex flex-column justify-content-center' onSubmit={handleSubmit}>
                        <div className='form-floating mb-3'>
                            <input type='email' className='form-control' id='floatingInput' ref={emailRef} required />
                            <label htmlFor='floatingInput'>Email</label>
                        </div>
                        <div className='form-floating mb-2'>
                            <input type={showpass ? "text" : "password"} className='form-control' id='floatingPassword' ref={pswrdRef} required />
                            <label htmlFor='floatingPassword'>Password</label>
                        </div>
                        <div className='mb-3 display-flex align-self-start'>
                        <input type='checkbox' className='form-check-input mx-2' id='dropdownCheck2'  onClick={() => setShowPass(!showpass)}/>
                          <label className="form-check-label text-secondary fw-light" style={{ fontSize: "15px" }} htmlFor="dropdownCheck2">
                            Show Password
                          </label>
                        </div>
                        <div className='d-grid'>
                            <button className='btn btn-primary w-100 py-2 fs-5 mb-3' type="submit">Login</button>
                            <p className='text-center'>Or <Link className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' to="/signup">Sign Up</Link> </p>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default SignIn;
