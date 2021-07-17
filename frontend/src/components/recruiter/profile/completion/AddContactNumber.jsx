import React from "react";
import { TextField } from "@material-ui/core";

function AddContactNumber(props) {

    const {contactNumber, setContactNumber} = props;

    const numberRegexp = /^\d*$/;

    function handleContactNumberChange(event) {
        const {value} = event.target;
        if(numberRegexp.test(value) === true && value.length <= 10){
            setContactNumber(value);
        }
    };

  return (
    <div>
      <h3 style={{ marginBottom: "2rem" }}>Add your Contact Number</h3>
      <TextField
        style={{ width: "20%" }}
        name="contactNumber"
        label="Provide your Contact Number"
        variant="outlined"
        value={contactNumber}
        onChange={handleContactNumberChange}
      />
    </div>
  );
}

export default AddContactNumber;
