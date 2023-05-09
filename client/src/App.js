import React, { useState, useEffect } from "react";
import "./App.css";
import MaterialTable from "material-table";
import axios from "axios";
import storage from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function App() {
  const [user, setUser] = useState([
    {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      gender: "",
      profile: "",
    },
  ]);


  let name, value;

  const handleinput = (e) => {
    // console.log(e.target.name);
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });

    // console.log(user);
  };
  const [data, setData] = useState([]);
  const onsubmithan = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, phone, gender, profile } = user;

    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, phone, gender, profile }),
    });
    const formdata = await res.json();
    //console.log(formdata);
    //console.log(formdata._id);
    
    if (!formdata.firstname || !formdata.lastname|| !formdata.email || !formdata.phone|| !formdata.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      window.alert("Fill form properly");
      console.log("Fill form properly");
    }
    else {
      setData([...data, formdata]);
      window.alert("registration succesful");
      console.log("registration succesful");
    }
 
  };

  const columns = [
    { title: "Profile", field: "profile",filtering: false, render:(params)=>(
      <img src={params.profile} alt="" border="3" height="50" width="50" />
    )},
    {
      title: "Firstname",
      field: "firstname",
      sorting: false,
      filtering: true,
    },
    { title: "LastName", field: "lastname", filtering: false },
    { title: "Email", field: "email", sorting: false, filtering: false },
    {
      title: "Phone",
      field: "phone",
      emptyValue: () => <em> Null</em>,
      sorting: false,
      filtering: false,
    },
    {
      title: "Gender",
      field: "gender",
      lookup: { M: "Male", F: "female" },
      emptyValue: () => <em> Null</em>,
      sorting: false,
      filterPlaceholder: "Fillter by Gender",
    },
  ];

  const getdata = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getdata");
      // console.log("response", response);
      setData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getdata();
  }, []); 


  function handleChange(event) {
    // setFile(event.target.files[0]);
    const file = event.target.files[0];
    if (!file) {
      alert("Please upload an image first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("Downloading url")
          console.log(url);
          setUser({...user, profile:url})
          console.log(user)
          
        });
      }
    );
  }

  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <center>
        <div
          style={{
            background: "#ADD8E6",
            marginLeft: "100px",
            marginRight: "100px",height:"100px"
          }}
        >
          <h1> Enter User Data</h1>
          <form onSubmit={onsubmithan}>
            <input
              type="text"
              name="firstname"
              // value={user.firstname}
              placeholder=" Enter FirstName"
              onChange={handleinput}
              style={{ marginRight: "5px" }}
            />
            <input
              type="text"
              name="lastname"
              // value={user.lastname}
              placeholder=" Enter LastName"
              onChange={handleinput}
              style={{ marginRight: "5px" }}
            />
            <input
              type="text"
              name="email"
              // value={user.email}
              placeholder="Enter Email"
              onChange={handleinput}
              style={{ marginRight: "5px" }}
            />
            <input
              type="text"
              name="phone"
              // value={user.phone}
              placeholder="Enter Phone Number"
              onChange={handleinput}
              style={{ marginRight: "5px" }}
            />
            <input
              type="text"
              name="gender"
              // value={user.gender}
              placeholder="Enter Gender"
              onChange={handleinput}
              style={{ marginRight: "5px" }}
            />
            <input
              type="file"
              // value={user.profile && user.profile}
              placeholder="select profile"
              name="profile"
              onChange={handleChange}
              accept="/image/*"
            />
            {/* <button onClick={handleUpload}>Upload to Firebase</button> */}
            <button style={{ color: "ADD8E6" }} type="submit">
              Submit
            </button>
          </form>
        </div>
      </center>
      <div
        style={{ marginRight: "100px", marginLeft: "100px", marginTop: "30px" }}
      >
    
        <MaterialTable
          title="User Data Table"
          editable={{
            onRowUpdate: (newRow, oldRow) =>
              new Promise(async (resolve, reject) => {
                const { _id, firstname, lastname, email, phone, gender } =
                  newRow;
                const updateddata = [...data];
                updateddata[oldRow.tableData.id] = newRow;
                setData(updateddata);
                //setData([...data,newRow])
                //console.log(_id)
                //console.log(data)
                const res = await fetch("/update", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user
                  }),
                });
                const formdata = await res.json();
                // console.log('update data',formdata);

                if (!formdata) {
                  window.alert(" data is not updated");
                  console.log("data is not updated");
                } else {
                  // console.log("newdata",newRow)
                  // setData([...data,formdata,newRow]);
                  window.alert("data updated succesful");

                  console.log("data updated succesful");
                }
                setTimeout(() => resolve(), 1000);
              }),
            onRowDelete: (selectedRow) =>
              new Promise(async (resolve, reject) => {
                console.log("tabledata",);
                console.log("selectedrow", selectedRow);
                const updatedData = [...data];
                console.log("id:", selectedRow._id);
                updatedData.splice(selectedRow.tableData.id, 1);
                setData(updatedData);
                const { _id } = selectedRow;
                console.log(_id);
                const res = await fetch("/delete", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    _id,
                  }),
                });
                const formdata = await res.json();
                // console.log('update data',formdata);

                if (!formdata) {
                  window.alert(" data is not deleted");
                  console.log("data is not deleted");
                } else {
                  // console.log("newdata",newRow)
                  // setData([...data,formdata,newRow]);
                  window.alert("data deleted succesful");

                  console.log("data deleted succesful");
                }
                setTimeout(() => resolve(), 500);
              }),
          }}
          // data={data}
          // 
          data={data}
          columns={columns}
          options={{
            sorting: true,
            filtering: true,
            paging: true,
            pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
            pageSize: 2,
            paginationType: "stepped",
            showFirstLastPageButtons: false,
            exportButton: true,
            exportFileName: "User Table Data",
            actionsColumnIndex: -1,
            grouping: true,
            rowStyle: (data, index) =>
              index % 2 === 0 ? { background: "#ADD8E6" } : null,
            headerStyle: { background: "#808080", fontStyle: "italic" },
          }}

        />
      </div>
    </div>
  );
}

export default App;
