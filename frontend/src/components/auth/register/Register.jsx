import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { FormControl, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import useStyles from "./RegisterStyle";
import axios from "axios";
import DisplayMessage from "../../DisplayMessage";
import AppNavbar from "../../common/AppNavbar";

export default function SignUp(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState({
		fName: "",
		lName: "",
		email: "",
		password: "",
		userType: "",
	});
	const [displayMessage, setDisplayMessage] = useState({
		display: false,
		type: "error",
		message: "",
	});

	function handleInputChanges(event) {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	}

	function hideDisplayMessage() {
		setDisplayMessage({
			...displayMessage,
			display: false,
		});
	};

	function handleFormSubmit(event) {
		axios
			.post("http://localhost:4000/user/register", formData)
			.then((res) => {
				setDisplayMessage({
					display: true,
					type: "success",
					message: "Account was successfully created.... redirecting",
				});
				props.setProfile({
					...res.data.profile,
					loggedIn: true,

				});
				setTimeout(hideDisplayMessage, 2000);
				setTimeout(() => {props.history.push("/profile")}, 2000);
			})
			.catch((err) => {
				var messageToSet = "";
				if(err.response){
					if (err.response.data.errors) {
						if (err.response.data.errors.email) {
							messageToSet += "* " + err.response.data.errors.email.message;
							setDisplayMessage({
								display: true,
								type: "error",
								message: messageToSet,
							});
						}
						if (err.response.data.errors.fName) {
							messageToSet += "* " + err.response.data.errors.fName.message;
							setDisplayMessage({
								display: true,
								type: "error",
								message: messageToSet,
							});
						}
						if (err.response.data.errors.lName) {
							messageToSet += "* " + err.response.data.errors.lName.message;
							setDisplayMessage({
								display: true,
								type: "error",
								message: messageToSet,
							});
						}
						if (err.response.data.errors.password) {
							messageToSet += "* " + err.response.data.errors.password.message;
							setDisplayMessage({
								display: true,
								type: "error",
								message: messageToSet,
							});
						}
						if (err.response.data.errors.userType) {
							messageToSet += "* " + err.response.data.errors.isRecruiter.message;
							setDisplayMessage({
								display: true,
								type: "error",
								message: messageToSet,
							});
						}
					} else if (
						err.response.data.code && err.response.data.code === 11000 &&
						err.response.data.name && err.response.data.name === "MongoError"
					) {
						setDisplayMessage({
							display: true,
							type: "error",
							message: "* Email Address already in use",
						});
					}
					else {
						alert(err.response.data);
					}
					setTimeout(hideDisplayMessage, 3000);
				}
				else {
					alert("Server Side Error!");
				}
			});
		event.preventDefault();
	}

	return (
		<div>
			<AppNavbar profile={props.profile} />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					{displayMessage.display ? (
						<DisplayMessage
							message={displayMessage.message}
							type={displayMessage.type}
						/>
					) : null}
					<form className={classes.form} onSubmit={handleFormSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField autoComplete="fname" name="fName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus value={formData.fName} onChange={handleInputChanges} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField variant="outlined" required fullWidth id="lName" label="Last Name" name="lName" autoComplete="lname" value={formData.lName} onChange={handleInputChanges} />
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={formData.email} onChange={handleInputChanges} />
							</Grid>
							<Grid item xs={12}>
								<TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={formData.password} onChange={handleInputChanges} />
							</Grid>
							<Grid item xs={12}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Purpose</FormLabel>
									<RadioGroup row aria-label="userType" name="userType" value={formData.userType} onChange={handleInputChanges} >
										<FormControlLabel value="applicant" control={<Radio />} label="Applicant" />
										<FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Sign Up </Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		</div>
	);
}
