import "./table.scss";
import {  useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';


const List = () => {
  const { id } = useParams(); 
  // const { id } = useParams(); // Extract the ID from the URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
 


useEffect(() => {
  const fetchData = async () => {
    try {
      if (!id) {
        setError('Invalid user ID');
        return;
      }

      const userDocRef = doc(db, 'users', id); // Assuming 'users' is your collection
      const userDocSnapshot = await getDoc(userDocRef);
     
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserData(userData);
       

        // Fetch linked documents from the 'familyData' subcollection
        const familyDataQuerySnapshot = await getDocs(collection(userDocRef, 'familyData'));
        
        const linkedDocuments = [];
        familyDataQuerySnapshot.forEach((doc) => {
          linkedDocuments.push({ id: doc.id, ...doc.data() });
        });

        console.log('Linked Documents:', linkedDocuments);
        // Update state or perform other actions with the linked documents
      } else {
        setError('User document not found');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('Error fetching data');
    }
  };

  fetchData();
}, [id]);


  const rows = [
    {
      id: 1143155,
      product: "Acer Nitro 5",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 785,
      method: "Cash on Delivery",
      status: "Approved",
    },
    
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            
            
            <TableCell className="tableCell">Beneficiary Name</TableCell>
            <TableCell className="tableCell">Age</TableCell>
            <TableCell className="tableCell">Amount Covered</TableCell>
            <TableCell className="tableCell">Location</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.product}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
