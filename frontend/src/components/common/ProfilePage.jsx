import React from "react";
import ApplicantProfile from "../applicant/profile/ApplicantProfile";
import RecruiterProfile from "../recruiter/profile/RecruiterProfile";

function ProfilePage(props) {

	document.title = "Riverr|Profile"

	const {profile, setProfile} = props;

	if(profile.loggedIn === false){
		props.history.push("/login");
		return 0;
	}

	else if(profile.profileCompleted === false){
		props.history.push("/completeProfile");
		return 0;
	}

	return (
		<div style={{textAlign: "center"}}>
			{
				props.profile.isRecruiter
					? <RecruiterProfile profile={profile} setProfile={setProfile} />
					: <ApplicantProfile profile={profile} setProfile={setProfile} />
			}
		</div>
	);
};

export default ProfilePage;
