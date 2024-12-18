import './App.css';
import { Routes, Route, Navigate, } from 'react-router-dom';
import CSVUpload from './pages/CSVUpload';
import ViewData from './pages/viewdata/ViewData';
import HomePage from './pages/homepage/HomePage';
import Nav from './components/Nav';
import Login from './pages/Login/Login';
import { useEffect, useState } from 'react';
import baseUrl from './api/api';
import Profile from './pages/profile/Profile';
import AddBranchesItems from './pages/Branchs/AddBranhesItems';

function App() {





  const [user, setUser] = useState({

  })

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("usercode"));

      if (storedUser) {
        setUser(storedUser);
      } else {
        try {
          const token = localStorage.getItem("token"); // Retrieve the token from localStorage or cookies
          if (!token) {
            console.error("No token found");
            return;
          }

          const response = await fetch(`${baseUrl.baseUrl}api/user/verifyjwt`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
            },
          });

          const data = await response.json();

          if (response.ok) {
            console.log("User authenticated:", data.user);
            setUser(data.user);
            localStorage.setItem("usercode", JSON.stringify(data.user));
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error validating token:", error.message);
        }
      }
    };

    checkUser();
  }, []); // Run once on component mount


  return (

    <Routes>
      <Route path='/csv-upload' element={user?.userName ? <CSVUpload /> : <Navigate to='/login' />} />
      <Route path='/' element={user?.userName ? <HomePage /> : <Navigate to='/login' />} />
      <Route path='/view-table' element={user?.userName ? <ViewData /> : <Navigate to='/login' />} />
      <Route path='/nav' element={user?.userName ? <Nav /> : <Navigate to='/login' />} />
      <Route path='/profile' element={user?.userName ? <Profile /> : <Navigate to='/login' />} />
      <Route path='/login' element={!user?.userName ? <Login /> : <Navigate to={'/'} />} />
      <Route path='/branches' element={user?.userName ? <AddBranchesItems /> : <Navigate to={'/login'} />} />
    </Routes>

  );
}

export default App;
