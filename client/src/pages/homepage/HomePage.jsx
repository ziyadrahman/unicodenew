import React, { useEffect, useState } from "react";
import "./home.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Nav from "../../components/Nav";
import baseUrl from "../../api/api";

const HomePage = () => {
  const [currentItem, setCurrentItem] = useState({
    branchName: '',
    category: '',
    subCategory: '',
    half: '',
    year: '',
    itemCode: '',
    size: '',
    quantity: '',
  });

  const [savedItems, setSavedItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'year') {
      const year = value.replace(/\D/g, '');
      newValue = year.length === 4 ? year.slice(-2) : year;
    } else if (['size', 'quantity'].includes(name)) {
      newValue = value.replace(/\D/g, '');
    } else {
      newValue = value.trim();
    }

    setCurrentItem((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleOpenModal = () => {
    setCurrentItem({
      branchName: '',
      category: '',
      subCategory: '',
      half: '',
      year: '',
      itemCode: '',
      size: '',
      quantity: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveItem = (e) => {
    e.preventDefault();
    setError(null);

    if (!Object.values(currentItem).every((val) => val !== '')) {
      setError('All fields are required.');
      return;
    }

    setSavedItems((prev) => [...prev, currentItem]);

    setCurrentItem({
      branchName: '',
      category: '',
      subCategory: '',
      half: '',
      year: '',
      itemCode: '',
      size: '',
      quantity: '',
    });
    handleCloseModal();
  };

  const handleRemoveItem = (index) => {
    setSavedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmitAll = async () => {
    setError(null);
    if (savedItems.length === 0) {
      setError('No items to submit. Please add items first.');
      return;
    }

    const payload = savedItems.map((row) => {
      const { branchName, category, subCategory, half, year, itemCode, size, quantity } = row;
      const finalCode = `${subCategory}${category}${half}${year}${itemCode}${size}`;
      return {
        branchName,
        category,
        subCategory,
        half,
        year: parseInt(year, 10),
        itemCode,
        size: parseInt(size, 10),
        quantity: parseInt(quantity, 10),
        finalCode,
      };
    });

    try {
      const response = await axios.post(`${baseUrl.baseUrl}api/upload`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Data submitted successfully!');
      console.log('Server Response:', response.data);

      setSavedItems([]);

      // Navigate to the products table view after successful submission
      // navigate('/view-table');
    } catch (error) {
      console.error('Error submitting data:', error.response || error.message);
      setError(error.response?.data?.error || 'An error occurred while submitting data');
    }
  };

  const [fetchData, setFetchData] = useState([]); // State to store the fetched data

  useEffect(() => {
    // Fetch function inside useEffect
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch(baseUrl.baseUrl + "api/fetchAllData");
        const data = await response.json();
        setFetchData(data.data); // Assuming the data is in 'data' field based on your server response
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromAPI();
    console.log(fetchData);
    // Call the fetch function when the component mounts
  }, []);
  const branches = fetchData?.length > 0 ? fetchData[0].subCategories : [];
  console.log(branches);

  return (
    <div
      style={{
        backgroundColor: "#E8F6F3",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      <Nav url={'/profile'} />
      {/* <div
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

        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="green" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
      </div> */}
      <Link to={'/branches'}>

        <button
          style={{
            backgroundColor: "#fff",
            color: "#046A4E",
            border: "1px solid white",
            borderRadius: "5px",
            padding: "8px 15px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          + Add Branches & Items
        </button>

      </Link>


      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          backgroundColor: "#fff",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#046A4E", color: "#fff" }}>
            <th style={tableHeaderStyle}>Branch Name</th>
            <th style={tableHeaderStyle}>Category</th>
            <th style={tableHeaderStyle}>Sub-Category</th>
            <th style={tableHeaderStyle}>Half</th>
            <th style={tableHeaderStyle}>Year</th>
            <th style={tableHeaderStyle}>Item Code</th>
            <th style={tableHeaderStyle}>Size</th>
            <th style={tableHeaderStyle}>Quantity</th>
            <th style={tableHeaderStyle}>Action</th>
          </tr>
        </thead>
        <tbody style={{ borderBottom: '1px solid black' }}>
          {savedItems.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px", gap: 4 }}>
                No items added yet.
              </td>
            </tr>
          ) : (
            savedItems.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.branchName}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.category}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.subCategory}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.half}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.year}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.itemCode}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.size}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>{item.quantity}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveItem(idx)}
                    style={{
                      backgroundColor: "#E63946",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={handleOpenModal}
          style={{
            backgroundColor: "#046A4E",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          + Add Item
        </button>
        <button
          style={{
            backgroundColor: "white",
            color: "#046A4E",
            border: "1px solid #046A4E",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
          onClick={() => navigate('/view-table')}
        >
          View Saved Data
        </button>
        <button
          style={{
            backgroundColor: "#046A4E",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
          onClick={handleSubmitAll}
        >
          Submit
        </button>
      </div>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "600px",
              backgroundColor: "white",
              padding: "50px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            <form onSubmit={handleSaveItem} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="col-sm-3" style={{ display: "flex", flexDirection: "column" }}>
                <h6>Branch Name</h6>
                <select
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1.5px solid gray",
                    backgroundColor: "whitesmoke",
                    borderRadius: "5px",
                  }}
                  name="branchName"
                  value={currentItem.branchName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch Name</option>

                  {fetchData[0]?.branches?.map((item) => {
                    return (
                      <option key={item._id} value={item.place}>
                        {item.place}
                      </option>
                    );
                  })}
                </select>

              </div>

              <div
                className="row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Category</h6>
                  <select
                    name="category"
                    value={currentItem.category}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1.5px solid gray",
                      backgroundColor: 'whitesmoke',
                      borderRadius: "5px",
                    }}
                  >
                    <option value="">Select Category</option>
                    {fetchData[0]?.categories?.map((item) => {
                      return (
                        <option key={item._id} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Sub-Category</h6>
                  <select
                    name="subCategory"
                    value={currentItem.subCategory}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1.5px solid gray",
                      backgroundColor: 'whitesmoke',
                      borderRadius: "5px",
                    }}
                  >
                    <option value="">Select Sub-Category</option>
                    {fetchData[0]?.subCategories?.map((item) => {
                      return (
                        <option key={item._id} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Item Code</h6>
                  <select
                    name="itemCode"
                    value={currentItem.itemCode}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1.5px solid gray",
                      backgroundColor: 'whitesmoke',
                      borderRadius: "5px",
                    }}
                  >
                    <option value="">Select Item Code</option>
                    {fetchData[0]?.items?.map((item) => {
                      return (
                        <option key={item._id} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div
                className="row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Half</h6>
                  <select
                    name="half"
                    value={currentItem.half}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1.5px solid gray",
                      backgroundColor: 'whitesmoke',
                      borderRadius: "5px",
                    }}
                  >
                    <option value="">Select Half</option>
                    <option value="03">First Half (FH)</option>
                    <option value="09">Second Half (SH)</option>
                  </select>
                </div>

                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Year</h6>
                  <input
                    type="text"
                    placeholder="Year"
                    name="year"
                    value={currentItem.year}
                    onChange={handleChange}
                    required
                    style={{
                      border: '1.5px solid gray',
                      backgroundColor: 'whitesmoke',
                      padding: '8px',
                      borderRadius: '5px'
                    }}
                  />
                </div>

                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Size</h6>
                  <input
                    type="text"
                    placeholder="Size"
                    name="size"
                    value={currentItem.size}
                    onChange={handleChange}
                    required
                    style={{
                      border: '1.5px solid gray',
                      backgroundColor: 'whitesmoke',
                      padding: '8px',
                      borderRadius: '5px'
                    }}
                  />
                </div>

                <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                  <h6>Quantity</h6>
                  <input
                    type="text"
                    placeholder="Quantity"
                    name="quantity"
                    value={currentItem.quantity}
                    onChange={handleChange}
                    required
                    style={{
                      border: '1.5px solid gray',
                      backgroundColor: 'whitesmoke',
                      padding: '8px',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>

              <div
                className="buttons"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentItem({
                      branchName: '',
                      category: '',
                      subCategory: '',
                      half: '',
                      year: '',
                      itemCode: '',
                      size: '',
                      quantity: '',
                    });
                  }}
                  className="btn btn-danger"
                  style={{
                    padding: "10px 40px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#E63946",
                    color: "white",
                  }}
                >
                  Clear
                </button>
                <button
                  className="btn btn-success"
                  type="submit"
                  style={{
                    padding: "10px 40px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#046A4E",
                    color: "white",
                  }}
                >
                  Save
                </button>
              </div>

              {error && (
                <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
              )}
            </form>

            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  padding: "10px",
  textAlign: "center",
};

export default HomePage;
