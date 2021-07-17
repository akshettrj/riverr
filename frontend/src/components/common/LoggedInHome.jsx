import React from "react";
import { Button } from "@material-ui/core";
import AppNavbar from "./AppNavbar";
import "./LoggedInHome.css";

function LoggedInHome(props) {

	function handleLogOut() {
		props.setProfile({
			fName: "",
			lName: "",
			email: "",
			loggedIn: false,
			isRecruiter: false,
			dateJoined: "",
			hash: ""
		});
		props.history.push("/");
	};

	return (
		<div>
			<AppNavbar profile={props.profile} />
			<div className="loggedInHomeBody">
				<h1>Hey {props.profile.fName}, Welcome to Riverr</h1>
				<h3>A place to advertise and get jobs.</h3>
				<Button color="primary" variant="contained" style={{margin: "2rem"}} onClick={handleLogOut}>Log Out</Button>
			</div>
		</div>
	);
}

export default LoggedInHome;
