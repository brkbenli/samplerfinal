import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Validation from "../components/LoginValidation.js";
import axios from 'axios';


export default function Login() {

    axios.defaults.withCredentials = true
    
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    const [loggedIn, setLoggedIn] = useState(false);

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = Validation(values);
        setErrors(errors);
        if(errors.email === "" && errors.password === "") {
            axios.post('http://localhost:8081/login', values) 
            .then(res => {
                console.log(res.data); // Log response data to see what the server returns
                if(res.data === "Success") {
                    setLoggedIn(true);
                    navigate("/home");
                } else {
                    alert("Wrong username/password");
                }
            })
            .catch(err => {
                console.log(err); // Log any errors that occur during the request
                alert("An error occurred while processing your request");
            });
        }
    }

    useEffect(() => {
        axios.get("http://localhost:8081/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoggedIn(response.data.loggedIn);
            }
        });
    }, [])

    return (
        <div className="d-flex flex-column bg-white vh-100">
            <Navbar />
            <div className="d-flex justify-content-center align-items-center bg-black vh-100">
                <div className="bg-white p-3 rounded w-25">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control rounded-0" 
                            onChange={handleInput} placeholder="Enter Email" name='email' />
                            {errors.email && <span className="text-danger"> {errors.email}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control rounded-0" 
                            onChange={handleInput} placeholder="Enter Password" name='password' />
                            {errors.password && <span className="text-danger"> {errors.password}</span>}
                        </div>
                        <button type='submit'className="btn btn-success w-100 rounded-0"><strong>Log In</strong></button>
                        <p>Agreed to terms and policies</p>
                        <Link to='/signup' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Create Account</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}