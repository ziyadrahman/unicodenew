import React, { useState } from 'react'
import { MdOutlineMail } from "react-icons/md";
import './Login.css'
import { FaRegUser } from "react-icons/fa";
import baseUrl from '../../api/api';

const Login = () => {


    const [formData, setfromData] = useState({
        email: "",
        password: ""
    })
    const Handlesubit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if (!formData.email) {
            return alert("Fill Email");
        }
        if (!formData.password) {
            return alert("Fill The Password");
        }
        try {
            const LoginUser = await fetch(baseUrl.baseUrl + "api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies
                body: JSON.stringify(formData),
            });

            const response = await LoginUser.json();

            if (response.message === "Login successful") {
                alert("Login success");
                // Optionally store user or token in localStorage
                localStorage.setItem("usercode", JSON.stringify(response.user));
                window.location.reload();
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className='cendiv'>
            <div className='header' style={{ position: 'absolute', display: 'flex', top: '30px', alignItems: 'center', gap: '30px' }}>

                <img src="/assets/rootments logo 2.jpg" alt="Rootments Logo" />
                <h4 >Product Unique Code Generation</h4>

            </div>

            <form className='form' onSubmit={Handlesubit}>
                <h2 style={{ color: 'white', display: "flex", justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
                    Login
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '10px',
                                    transform: 'translateY(-50%)',
                                    fontSize: '20px',
                                    color: '#fff'
                                }}
                            >
                                <FaRegUser />
                            </div>
                            <input
                                value={formData.email}
                                onChange={(e) => {
                                    setfromData({ ...formData, email: e.target.value })
                                }}
                                type="email"
                                className="input"
                                placeholder="Email"
                                style={{
                                    paddingLeft: '40px', /* Adds space for the icon */
                                    width: '100%',
                                    color: 'white' /* Ensure input takes full width */
                                }}
                            />
                        </div>
                    </div>
                    <div className="">
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '10px',
                                    transform: 'translateY(-50%)',
                                    fontSize: '20px',
                                    color: '#fff'
                                }}
                            >
                                <MdOutlineMail />
                            </div>
                            <input
                                value={formData.password}
                                onChange={(e) => {
                                    setfromData({ ...formData, password: e.target.value })
                                }}
                                type="password"
                                className="input"
                                id="exampleInputPassword1"
                                placeholder="Password"
                                style={{
                                    paddingLeft: '40px', /* Adds space for the icon */
                                    width: '100%',
                                    color: 'white' /* Ensure input takes full width */
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            color: '#016E6B',
                            display: 'flex',
                            justifyContent: 'center',  // Centers the text horizontally
                            alignItems: 'center',  // Centers the text vertically
                            marginTop: '20px',
                            background: 'white',
                            width: '250px',
                            textAlign: 'center',  // This is optional as flex will center it anyway
                            padding: '10px 20px',
                            fontWeight: 700 // Add some padding for better button appearance
                        }}
                    >
                        Login
                    </button>
                </div>
            </form>

        </div>

    )
}

export default Login