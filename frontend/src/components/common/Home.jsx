import React from "react";
import "./Home.css";
import SignInOrUp from "../auth/SignInOrUp";
import AppNavbar from "./AppNavbar";

function Home(props) {
	return (
		<div>
			<AppNavbar profile={props.profile}/>
			<div className="homeBody">
				<h1>Welcome to Riverr</h1>
				<h3>A place to advertise and get jobs.</h3>
				<SignInOrUp profile={props.profile} />
			</div>
		</div>
	);
}

export default Home;
