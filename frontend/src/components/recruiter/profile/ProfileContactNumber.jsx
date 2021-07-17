import React, {useState} from "react";
import {Button, Grid, TextField} from "@material-ui/core";
import axios from "axios";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileContactNumber(props) {

	const {contactNumber, setContactNumber} = props;
	const {contactNumberBackup, setContactNumberBackup} = props;

	const [editMode, setEditMode] = useState(false);

	const numberRegexp = /^\d*$/;

	function handleContactNumberChange(event) {
		const {value} = event.target;
		if(numberRegexp.test(value) === true && value.length <= 10){
			setContactNumber(value);
		}
	};

	function handleContactNumberSave(){
		axios.patch("http://localhost:4000/user/recruiter/contactNumber", {
			profile: props.profile,
			contactNumber: contactNumber
		}).then(res => {
			setContactNumberBackup(contactNumber);
			setEditMode(false);
		}).catch(err => {
			console.log(err);
		});
	};

	function handleCancelEdit(){
		setContactNumber(contactNumberBackup);
		setEditMode(false);
	};

	return (
		<div>
			<div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
				<Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
					<ProfileHeader size={12} header={"Contact Number"} />
					<Grid item xs={8} >
						<TextField
							name="contactNumber"
							fullWidth={true}
							label={editMode?"Update Contact Number":""}
							variant={editMode?"outlined":"standard"}
							value={contactNumber}
							onChange={editMode?handleContactNumberChange:null}
						/>
					</Grid>
					<Grid item xs={2} >
						{
							editMode
								? <Button
									variant="contained"
									color="primary"
									style={{width: "80%"}}
									onClick={handleCancelEdit}
								>Cancel</Button>
								: <Button
									variant="contained"
									color="primary"
									style={{width: "80%"}}
									onClick={(e) => {
										setEditMode(true)
									}}
								>Edit</Button>
						}
					</Grid>
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							disabled={!editMode}
							onClick={handleContactNumberSave}
						>Save</Button>
					</Grid>
				</Grid>
			</div>
		</div>
	);
}

export default ProfileContactNumber;
