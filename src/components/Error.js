import React from 'react'
import { Link } from 'react-router-dom'
import errorImg from "../images/Error.png";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Error = () => {
    useEffect(()=>{
        toast.error("This Page doesn't exist !",{
            toastId:"Error 404"
        });
    },[])
  return (
    <div className='container d-flex justify-content-center align-items-center'>
    <div className='p-5 text-center rounded-3'>
        <div>
            <img width={300} src={errorImg} alt='Error'/>
        </div>
        <h3 className='display-3'>404 - Page Not Found</h3>
        <p className='fs-5 text-muted'>The Page you are looking for might have been removed, had its name changed or it is unavailable.</p>
        <Link to="/" className='btn btn-primary btn-lg rounded-pill' roll="button"> Go to Homepage</Link>
    </div>
      
    </div>
  )
}

export default Error;
