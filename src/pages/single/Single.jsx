import "./single.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Single = () => {
  const { id } = useParams(); // Extract the ID from the URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  //  const [inputs, setinputs] = useState();
  const [file, setFile] = useState("");
  const [perce, setPerce] = useState(null);

  const handleInput = (e)=>{ e.preventDefault();}
  const handleAddNew = (e)=>{e.preventDefault()}

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
            <Chart aspect={3 / 1} title="Member speding ( Last 6 Contributions)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Add Beneficiary</h1>
          <p className="listTitle">Note that you can only have close Family members in your cover. No extended family</p>
           <form onSubmit={handleAddNew}>
                     

              {((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              
              <button disabled={perce !== null && perce < 100} type="submit">Submit</button>
            </form><form action=""></form>
          <h1 className="title">Member Covered Beneficiary</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;