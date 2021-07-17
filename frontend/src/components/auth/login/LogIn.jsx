import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import axios from "axios";
import useStyles from "./LogInStyle";
import DisplayMessage from "../../DisplayMessage";
import AppNavbar from "../../common/AppNavbar";

export default function SignIn(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
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
	};

	function hideDisplayMessage() {
		setDisplayMessage({
			...displayMessage,
			display: false,
		});
	};

	function handleFormSubmit(event) {
		axios
			.post("http://localhost:4000/user/login", formData)
			.then((res) => {
				const {fName, lName, dateJoined, email, isRecruiter, hash, profileCompleted } = res.data;
				setDisplayMessage({
					display: true,
					type: "success",
					message: res.data.message + "... redirecting"
				});
				props.setProfile({
					fName: fName,
					lName: lName,
					dateJoined: dateJoined,
					email: email,
					isRecruiter: isRecruiter,
					hash: hash,
					loggedIn: true,
					profileCompleted: profileCompleted
				});

				setTimeout(hideDisplayMessage, 1000);
				setTimeout(() => {
					props.history.push("/completeProfile");
				}, 1000);
			})
			.catch((err) => {
				if(err.response){
					const res = err.response.data;
					setDisplayMessage({
						display: true,
						type: "error",
						message: res.message
					});
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
			<AppNavbar profile={props.profile}/>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					{displayMessage.display ? (
						<DisplayMessage
							message={displayMessage.message}
							type={displayMessage.type}
						/>
					) : null}
					<form className={classes.form} onSubmit={handleFormSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							onChange={handleInputChanges}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={handleInputChanges}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item>
								<Link href="/register" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		</div>
	);
}
