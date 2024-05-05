import "./single.scss";
//import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const Single = ({ inputs, title }) => {
  const { id } = useParams(); // Extract the ID from the URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState({})


  const handleInput = (e) => {
    e.preventDefault();

    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
   
  };

const handleAddFam = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
    
  try {

 

    // Create a new document in the "familyData" collection
    const newDocRef = await addDoc(collection(db, 'familyData'), {
      ...data,
      Timestamp: serverTimestamp() // Add a timestamp field
            
    });
    // navigate(-1)
    // Link the new data to the existing user by updating the user document
    const userDocRef = doc(db, 'users', id);
    await updateDoc(userDocRef, {
      familyDataId: newDocRef.id // Store the ID of the new document in the user document
      
    });
     setData({});
    console.log("New data added and linked to user successfully!");
  } catch (error) {
    console.error("Error adding data and linking to user: ", error);
    setError('Failed to submit the form. Please try again later.');
  }

   
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError('Invalid user ID');
          return;
        }

        const docRef = doc(db, 'users', id); // Assuming 'users' is your collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Personal Details</h1>
            {error ? (
              <p>Error: {error}</p>
            ) : userData ? (
              <div className="item">
                <img
                  src={userData.img}
                  alt=""
                  className="itemImg"
                />
                <div className="details">
                  <h1 className="itemTitle">{userData.displayName}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{userData.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{userData.phoneNumber}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{userData.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Location:</span>
                    <span className="itemValue">{userData.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="Member contributions ( Last 6 Contributions)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">{title}</h1>
          <p className="listTitle">Note that you can only have close Family members in your cover. No extended family</p>
          
          <form onSubmit={handleAddFam} className="benefitForm">
            {inputs.map((input, index) => (
              <div className="benefitInput" key={index}>
                <label htmlFor={input.id}>{input.label}</label>
                <input
                  id={input.id}
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder} 
                  onChange={handleInput}/>
              </div>
            ))}
            <div className="benefitButton">
              <p>Admins Only</p>
              <button className="btn" type="submit">Submit</button>
            </div>
          </form>
            
          <h1 className="title">Member Covered Beneficiary</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
