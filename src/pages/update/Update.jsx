import "./update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Update = ({ inputs, title, itemId }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [perce, setPerce] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItemData = async () => {
      const itemRef = doc(db, "items", itemId);
      const itemData = await itemRef.get();
      setData(itemData.data());
    };
    fetchItemData();
  }, [itemId]);

  const handleInput = (e) => {
    e.preventDefault();

    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "items", itemId), {
        ...data,
        Timestamp: serverTimestamp(),
      });
      //redirect to empty after updating
      navigate(-1)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="update">
      <Sidebar />
      <div className="updateContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAddNew}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={data[input.id]}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <button disabled={perce !== null && perce < 100} type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;