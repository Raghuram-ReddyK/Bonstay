import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PageNotFound = () => {
    const navigate = useNavigate()
    return (
        // <div container display-1>
        //     PageNotFound 404, Please go back to
        //     <Link to="/" className="login-paragraph"> Home</Link>
        // </div>
        <div className='container text-center p-5'>
            <h1 className='display-1 text-danger'>PageNotFound 404, Please go back to</h1>
            {/* <p>Please visit Home Page</p> */}
            <button className='btn btn-primary' onClick={() => { navigate("/") }}>Click to Home</button>
        </div>
    )
}

export default PageNotFound