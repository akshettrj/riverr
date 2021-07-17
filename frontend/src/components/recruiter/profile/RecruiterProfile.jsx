import React, {useEffect, useState} from "react";
import AppNavbar from "../../common/AppNavbar";
import ProfileName from "../../common/ProfileName";
import ProfileBio from "./ProfileBio";
import axios from "axios";
import ProfileContactNumber from "./ProfileContactNumber";
import ProfileEmail from "../../common/ProfileEmail";
import ProfileType from "../../common/ProfileType";

function RecruiterProfile(props) {

	const {profile, setProfile} = props;
	const [bio, setBio] = useState("");
	const [contactNumber, setContactNumber] = useState("");
	const [bioBackup, setBioBackup] = useState("");
	const [contactNumberBackup, setContactNumberBackup] = useState("");

	useEffect(() => {
		async function fetchData(){
			axios.get("http://localhost:4000/user/recruiter/profile", {
				params: {
					email: profile.email
				}
			}).then(res => {
				const {bio: gotBio, contactNumber: gotContactNumber} = res.data;
				setBio(gotBio);
				setContactNumber(gotContactNumber);
				setBioBackup(gotBio);
				setContactNumberBackup(gotContactNumber);
			}).catch(err => {
				alert("Error");
			});
		};

		fetchData();

	}, [profile.email]);


	return (
		<div style={{paddingBottom: "4rem"}}>
			<AppNavbar profile={profile} setProfile={setProfile} />
			<ProfileName profile={profile} setProfile={setProfile} />
			<ProfileEmail profile={profile} setProfile={setProfile} />
			<ProfileType profile={profile} setProfile={setProfile} />
			<ProfileBio bio={bio} setBio={setBio} bioBackup={bioBackup} setBioBackup={setBioBackup} profile={profile} setProfile={setProfile} />
			<ProfileContactNumber contactNumber={contactNumber} setContactNumber={setContactNumber} contactNumberBackup={contactNumberBackup} setContactNumberBackup={setContactNumberBackup} profile={profile} setProfile={setProfile} />
		</div>
	);
};

export default RecruiterProfile;
