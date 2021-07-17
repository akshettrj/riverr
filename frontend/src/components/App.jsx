import React, {useState} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./common/Home";
import LogIn from "./auth/login/LogIn";
import Register from "./auth/register/Register";
import LoggedInHome from "./common/LoggedInHome";
import ProfilePage from "./common/ProfilePage";
import CompleteProfile from "./common/CompleteProfile";
import Dashboard from "./common/Dashboard";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

function App() {

	document.title = "Riverr|Welcome";

	const [loginProfile, setLoginProfile] = useState({
		fName: "",
		lName: "",
		email: "",
		loggedIn: false,
		isRecruiter: false,
		dateJoined: "",
		hash: "",
		profileComplete: false
	});

	const theme = createMuiTheme({
		typography: {
			fontFamily: [
				'JetBrains Mono',
				'monospace',
			].join(','),
		},});

	return (
		<Router>
			<ThemeProvider theme={theme}>
				<div className="App">
					<Switch>
						<Route path="/" exact render={(props) => (loginProfile.loggedIn ? <LoggedInHome profile={loginProfile} setProfile={setLoginProfile} {...props} /> : <Home profile={loginProfile} {...props} />)} />
						<Route path="/login" exact render={(props) => (<LogIn profile={loginProfile} setProfile={setLoginProfile} {...props} />)} />
						<Route path="/register" exact render={(props) => (<Register profile={loginProfile} setProfile={setLoginProfile} {...props} />)} />
						<Route path="/profile" exact render={(props) => (<ProfilePage profile={loginProfile} setProfile={setLoginProfile} {...props} />)} />
						<Route path="/completeProfile" exact render={(props) => (<CompleteProfile profile={loginProfile} setProfile={setLoginProfile} {...props} />)} />
						<Route path="/dashboard" exact render={(props) => (<Dashboard profile={loginProfile} setProfile={setLoginProfile} {...props} />)} />
					</Switch>
				</div>
			</ThemeProvider>
		</Router>
	);
}

export default App;
