import React, { useEffect, useState } from 'react';
import './addbranchesitems.css';
import Nav from '../../components/Nav';
import { Link } from 'react-router-dom';
import baseUrl from '../../api/api';

const AddBranchesItems = () => {


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [branch, setBranch] = useState({
    place: ""
  })
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };




  const [category, setcategory] = useState({
    name: "",
    code: ""
  })

  const [category1, setcategory1] = useState({
    name: "",
    code: ""
  })
  const [category2, setcategory2] = useState({
    name: "",
    code: ""
  })



  const [isModalOpen1, setIsModalOpen1] = useState(false);


  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const [isModalOpen2, setIsModalOpen2] = useState(false);


  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };
  const openModal3 = () => {
    setIsModalOpen3(true);
  };

  const closeModal3 = () => {
    setIsModalOpen3(false);
  };

  const [isModalOpen3, setIsModalOpen3] = useState(false);



  const [fetchData, setFetchData] = useState([]); // State to store the fetched data
  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch(baseUrl.baseUrl + "api/fetchAllData");
      const data = await response.json();
      setFetchData(data.data); // Assuming the data is in 'data' field based on your server response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Fetch function inside useEffect


    fetchDataFromAPI();
    console.log(fetchData);
    // Call the fetch function when the component mounts
  }, []);
  const branches = fetchData?.length > 0 ? fetchData[0].subCategories : [];
  console.log(branches);



  const HandleBranch = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch(`${baseUrl.baseUrl}api/add_branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensures the server knows the payload is JSON
        },
        body: JSON.stringify(branch), // Converts the branch object to a JSON string
      });

      const res = await response.json();

      if (response.ok) {
        // If the response status is in the range of 200-299
        alert(res.message);
        setBranch({
          place: "", // Resets the branch state after successful submission
        });
        fetchDataFromAPI();
      } else {
        // Handles errors returned from the server
        alert(res.message || "Failed to add branch.");
      }
    } catch (error) {
      console.error("Error submitting branch:", error);
      alert("An error occurred. Please try again."); // Friendly error message for the user
    }
  };
  const HandleBranch1 = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch(`${baseUrl.baseUrl}api/add_subcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensures the server knows the payload is JSON
        },
        body: JSON.stringify(category), // Converts the branch object to a JSON string
      });

      const res = await response.json();

      if (response.ok) {
        // If the response status is in the range of 200-299
        alert(res.message);
        setcategory({
          name: "",
          code: '' // Resets the branch state after successful submission
        });
        fetchDataFromAPI();
      } else {
        // Handles errors returned from the server
        alert(res.message || "Failed to add branch.");
      }
    } catch (error) {
      console.error("Error submitting branch:", error);
      alert("An error occurred. Please try again."); // Friendly error message for the user
    }
  };

  const HandleBranch2 = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch(`${baseUrl.baseUrl}api/add_category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensures the server knows the payload is JSON
        },
        body: JSON.stringify(category1), // Converts the branch object to a JSON string
      });

      const res = await response.json();

      if (response.ok) {
        // If the response status is in the range of 200-299
        alert(res.message);
        setcategory1({
          name: "",
          code: '' // Resets the branch state after successful submission
        });
        fetchDataFromAPI();
      } else {
        // Handles errors returned from the server
        alert(res.message || "Failed to add branch.");
      }
    } catch (error) {
      console.error("Error submitting branch:", error);
      alert("An error occurred. Please try again."); // Friendly error message for the user
    }
  };

  const HandleBranch3 = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch(`${baseUrl.baseUrl}api/add_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensures the server knows the payload is JSON
        },
        body: JSON.stringify(category2), // Converts the branch object to a JSON string
      });

      const res = await response.json();

      if (response.ok) {
        alert(res.message);
        setcategory2({
          name: "",
          code: ''
        });
        fetchDataFromAPI();
      } else {
        // Handles errors returned from the server
        alert(res.message || "Failed to add branch.");
      }
    } catch (error) {
      console.error("Error submitting branch:", error);
      alert("An error occurred. Please try again."); // Friendly error message for the user
    }
  };
  return (
    <div className="container">

      <Nav url={'/profile'} />
      <br />

      <Link to={'/'}>
        <button className="back-button">&lt; Back</button>

      </Link>
      <h5 style={{ fontWeight: '800px' }}>Branches & Items</h5>

      <div className="main-content" style={{}}>

        <table border="1" style={{ borderCollapse: 'collapse', width: '20%', alignContent: 'center', marginRight: '10px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'center' }}>Branch's</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.branches?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.place}</td></tr>

              );
            })}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button
                        className="btn success"
                        style={{ border: "1px solid black" }}
                        onClick={openModal}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Modal */}
              {isModalOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    borderRadius: "8px",
                  }}
                >
                  <h2>Add Item</h2>

                  <p>Here you can add your new item details.</p>
                  <input type="text" style={{ marginBottom: '10px' }} value={branch.place} onChange={(e) => setBranch({ ...branch, place: e.target.value })} />
                  <>
                    <div style={{ display: "flex", justifyContent: 'space-between' }}>
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={HandleBranch}
                      >
                        ADD
                      </button>
                    </div>
                  </>
                </div>
              )}

              {/* Overlay */}
              {isModalOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                  onClick={closeModal}
                ></div>
              )}
            </div>
          </tbody>
        </table> <br /><br />

        <table border="1" style={{ borderCollapse: 'collapse', width: '20%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Sub-Category</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.subCategories?.map((item) => {
              return (
                <>
                  <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.name}</td></tr>

                </>
              );
            })}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button
                        className="btn success"
                        style={{ border: "1px solid black" }}
                        onClick={openModal1}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Modal */}
              {isModalOpen1 && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    borderRadius: "8px",
                  }}
                >
                  <h2>Add Item</h2>
                  <p>Here you can add subCategorie.</p>
                  <div style={{ display: 'flex', gap: 2, flexDirection: 'column', marginBottom: '20px' }}>
                    <input type="text" placeholder='subCategorie' value={category.name} onChange={(e) => setcategory({ ...category, name: e.target.value })} />
                    <input type="text" placeholder='code' value={category.code} onChange={(e) => setcategory({ ...category, code: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={closeModal1}
                    >
                      Close
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={HandleBranch1}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay */}
              {isModalOpen1 && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                  onClick={closeModal1}
                ></div>
              )}
            </div>

          </tbody>
        </table>
        <table border="1" style={{ borderCollapse: 'collapse', width: '10%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>code</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.subCategories?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.code}</td></tr>

              );
            })}


          </tbody>
        </table>

        <table border="1" style={{ borderCollapse: 'collapse', width: '20%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Categorie</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.categories?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.name}</td></tr>

              );
            })}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button
                        className="btn success"
                        style={{ border: "1px solid black" }}
                        onClick={openModal2}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Modal */}
              {isModalOpen2 && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    borderRadius: "8px",
                  }}
                >
                  <h2>Add Item</h2>
                  <p>Here you can add Categorie.</p>
                  <div style={{ display: 'flex', gap: 2, flexDirection: 'column', marginBottom: '20px' }}>
                    <input type="text" placeholder='subCategorie' value={category1.name} onChange={(e) => setcategory1({ ...category1, name: e.target.value })} />
                    <input type="text" placeholder='code' value={category1.code} onChange={(e) => setcategory1({ ...category1, code: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={closeModal2}
                    >
                      Close
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={HandleBranch2}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay */}
              {isModalOpen2 && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                  onClick={closeModal2}
                ></div>
              )}
            </div>



          </tbody>
        </table>
        <table border="1" style={{ borderCollapse: 'collapse', width: '10%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>code</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.categories?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.code}</td></tr>

              );
            })}


          </tbody>
        </table>

        <table border="1" style={{ borderCollapse: 'collapse', width: '20%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Item</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.items?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.name}</td></tr>

              );
            })}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button
                        className="btn success"
                        style={{ border: "1px solid black" }}
                        onClick={openModal3}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Modal */}
              {isModalOpen3 && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    borderRadius: "8px",
                  }}
                >
                  <h2>Add Item</h2>
                  <p>Here you can add Items.</p>
                  <div style={{ display: 'flex', gap: 2, flexDirection: 'column', marginBottom: '20px' }}>
                    <input type="text" placeholder='subCategorie' value={category2.name} onChange={(e) => setcategory2({ ...category2, name: e.target.value })} />
                    <input type="text" placeholder='code' value={category2.code} onChange={(e) => setcategory2({ ...category2, code: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={closeModal3}
                    >
                      Close
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={HandleBranch3}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay */}
              {isModalOpen3 && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                  onClick={closeModal3}
                ></div>
              )}
            </div>


          </tbody>
        </table>
        <table border="1" style={{ borderCollapse: 'collapse', width: '10%', alignContent: 'center', height: '80px', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>code</th>
            </tr>
          </thead>
          <tbody >

            {fetchData[0]?.items?.map((item) => {
              return (
                <tr><td key={item._id} style={{ padding: '10px', textAlign: 'center', }}>{item.name}</td></tr>

              );
            })}



          </tbody>
        </table>

        {/* <div className="table-section">

          <table style={{ alignContent: 'center' }}>
            <thead style={{ border: 'none' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'center' }}>Sub-Category</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Code</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Code</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Item</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Indo Western</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>IW</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Premium</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>P</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Waist</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>WC</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Bangala</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>B</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Non Premium</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>NP</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Pant</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>T</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Jodhpuri</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>JP</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Luxury</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>LX</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Blazer</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>BZ</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>3 Pcs Suit</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>3P</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Kurta</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>K</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Nehru Jacket</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>NJ</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>2 Pcs Suit</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>2P</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Kids Suit</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>KD</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
              </tr>
              <tr>
                <td style={{ padding: '10px', textAlign: 'center' }}>Kurtha</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>KU</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
};

export default AddBranchesItems;
