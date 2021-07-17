import React from 'react';
import CompleteApplicantProfile from "../applicant/profile/completion/CompleteApplicantProfile";
import CompleteRecruiterProfile from "../recruiter/profile/completion/CompleteRecruiterProfile";

function CompleteProfile(props) {

	document.title = "Riverr|Complete Profile"

	const {profile, setProfile} = props;

	if(profile.loggedIn === false) {
		props.history.push("/login");
		return <div></div>;
	}

	else if(profile.profileCompleted === true){
		props.history.push("/profile");
		return <div></div>;
	}

	return (
		<div>
			{
				profile.isRecruiter
					? <CompleteRecruiterProfile profile={profile} setProfile={setProfile} {...props} />
					: <CompleteApplicantProfile profile={profile} setProfile={setProfile} {...props} />
			}
		</div>
	);
};

export default CompleteProfile;
