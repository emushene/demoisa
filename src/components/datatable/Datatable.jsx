import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect } from "react";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // Add a new state to store the selected row

  useEffect(() => {
    //LISTEN REALTIME DATA
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const handleUpdate = async (id) => {
    try {
      await setDoc(doc(db, "users", id), data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // console.log(params.row); // Add this line to log the data
        return (
          <div className="cellAction">
            <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton" onClick={() => setSelectedRow(params.row)}>View</div>
            </Link>
            <div
              className="updateButton"
              onClick={() => handleUpdate(params.row.id)}
            >
              <Link to={`/users/${params.row.id}/edit`} className="link">
                Update
              </Link>
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Member
        <Link to="/users/new" className="link">
          Add Member
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[6]}
        checkboxSelection
      />
      <div className="datatable">
        <div className="datatableTitle">
          Covered Members
          <Link to="/users/new" className="link">
            Add New Cover
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Datatable;