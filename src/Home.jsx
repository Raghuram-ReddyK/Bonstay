import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';

const Home = () => {
    return (
        <>
            <div className='home'>
                <Typography variant="body1" >
                    Bonstay always provides you an amazing and pleasant stay<br />
                    with your friends and family at reasonable prices.<br />
                    We provide well-designed space with modern amenities.<br />
                    You can reserve a room faster with our efficient Bonstay app
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/login">
                    Click here to login
                </Button>

                {/* <li> <Link to="/getallusers" className="login-paragraph"> Click here to users</Link></li> */}
                {/* <button onClick={() => { navigate("/register") }}>Sign Up</button> */}
            </div>
        </>
    );
};

export default Home;