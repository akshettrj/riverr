import React from "react";
import AppNavbar from "./AppNavbar";
import ApplicantDashboard from "../applicant/dashboard/ApplicantDashboard";
import RecruiterDashboard from "../recruiter/dashboard/RecruiterDashboard";

function Dashboard(props) {

	const {profile, setProfile} = props;

	if(profile.loggedIn === false) {
		props.history.push("/login");
		return <div></div>;
	}

	return (
		<div>
			<AppNavbar profile={profile} setProfile={setProfile} />
			{profile.isRecruiter
				? <RecruiterDashboard profile={profile} setProfile={setProfile} {...props} />
				: <ApplicantDashboard profile={profile} setProfile={setProfile} {...props} />}
		</div>
	);
};

export default Dashboard;