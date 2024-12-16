import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav({
  url
}) {
  return (


    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src='/assets/rootments logo 2.jpg'
          alt="Logo"
          style={{ width: "50px", height: "50px", marginRight: "10px" }}
        />
        <h3 style={{ color: "black", margin: 0 }}>
          Product Unique Code Generation
        </h3>
      </div>

      <Link to={url} >
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="darkgreen" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
      </Link>
    </div>

  )
}
