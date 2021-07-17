import React, { useState } from 'react';
import AddBio from './AddBio';
import {Button} from "@material-ui/core";
import axios from "axios";
import AddContactNumber from './AddContactNumber';

function CompleteRecruiterProfile(props) {

	const {profile} = props;
	
	const [bio, setBio] = useState("");

	const [contactNumber, setContactNumber] = useState("");

	function handleProfileCompletion(event) {
		event.preventDefault();
		axios.patch("http://localhost:4000/user/profile", {
			bio: bio,
			contactNumber: contactNumber,
			profile: profile
		}).then(res => {
			props.setProfile({
				...props.profile,
				profileCompleted: true
			})
		}).catch(err => {
			console.log(err.response);
		});
	};

	return (
		<div style={{textAlign: "center", paddingTop: "3rem"}}>
			<AddBio bio={bio} setBio={setBio} />
			<hr style={{width: "5%", borderTop: "0.4rem dotted", margin: "4rem auto"}} />
			<AddContactNumber contactNumber={contactNumber} setContactNumber={setContactNumber} />
			<hr style={{width: "5%", borderTop: "0.4rem dotted", margin: "4rem auto"}} />
			<div style={{margin: "4rem auto"}}>
			<Button color="primary" type="sumbit" style={{padding: "1rem 2rem"}} variant="contained" onClick={handleProfileCompletion} >Save Changes</Button>
			</div>
		</div>
	);
};

export default CompleteRecruiterProfile;
