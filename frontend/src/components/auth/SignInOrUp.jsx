import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./SignInOrUp.css";

function SignInOrUp(props) {
	return (
		<div className="SignInOrUp">
			<h2>To Get Started</h2>
			<h3>Choose the appropriate option below</h3>
			<Link to={props.profile.loggedIn ? "/profile" : "/login"}>
				<Button color="primary" variant="contained" style={{margin: "2rem"}}>Sign In</Button>
			</Link>
			<Link to="/register">
				<Button color="primary" variant="contained" style={{margin: "2rem"}}>Sign Up</Button>
			</Link>
		</div>
	);
};

export default SignInOrUp;
