import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Container,
	CssBaseline,
	Typography,
	TextField,
	Button,
	FormControlLabel,
	Checkbox,
	Grid,
	IconButton
} from "@material-ui/core/";
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from "./CompleteApplicantProfileStyle.js";

function AddSkillDetails(props) {
	const classes = useStyles();

	const { setSkills, isSubmitted } = props;

	const [skillsList, setSkillsList] = useState([]);

	const [newSkillName, setNewSkillName] = useState("");

	useEffect(() => {
		async function fetchSkills() {
			axios
				.get("http://localhost:4000/lang")
				.then((res) => {
					setSkillsList(res.data.languages);
				})
				.catch((err) => {
					console.log(err);
				});
		}

		fetchSkills();
	}, []);

	function handleNewSkillInputChange(event) {
		const value = event.target.value;
		setNewSkillName(value);
	};

	function handleNewSkillAddition(event) {
		event.preventDefault();
		const testRegexp = /^\s*$/;
		if(
			testRegexp.test(newSkillName) === false
			&& skillsList.findIndex(element => (newSkillName === element)) === -1
		) {
			setSkillsList((oldList) => {
				const newList = [newSkillName, ...oldList];
				return newList;
			});
			setNewSkillName("");
		}
	};

	function handleSkillToggle(event) {
		const {name, checked} = event.target;
		if(checked) {
			setSkills(oldSkills => {
				oldSkills.set(name, true);
				return oldSkills;
			});
		}
		else {
			setSkills(oldSkills => {
				oldSkills.set(name, false);
				return oldSkills;
			});
		}
	};

	function handleSkillRemoval(index){
		const skillName = skillsList[index];
		setSkills(oldSkills => {
			oldSkills.set(skillName, false);
			return oldSkills;
		});
		setSkillsList(oldList => {
			const newList = oldList.filter((name, indx) => (indx !== index));
			return newList;
		});
	};

	return (
		<div
			style={{ textAlign: "center", alignContent: "center", marginTop: "2rem" }}
		>
			<h3>Choose Your Skills</h3>
			<p>You can press the delete button to remove languages from list for cleanliness</p>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Add Additional Skills
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2} >
							<Grid item xs={10} >
								<TextField
									variant="outlined"
									margin="normal"
									required
									id="skillName"
									label="Enter the skill name"
									name="name"
									onChange={handleNewSkillInputChange}
									value={newSkillName}
								/>
							</Grid>
							<Grid item xs={2} >
								<Button
									onClick={handleNewSkillAddition}
									type="submit"
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={isSubmitted}
								>
									Add
								</Button>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
			{skillsList.length === 0
				? null
				: <table style={{backgroundColor: "white", width: "20%", margin: "2rem auto"}}>
					<tbody>
					{
						skillsList.map((skill, indx) => (
							<tr style={{borderBottom: "1px solid grey"}} key={skill}>
								<td style={{padding: "0.8rem 2rem", alignItems: "left"}}>
									<FormControlLabel control={ <Checkbox onClick={handleSkillToggle} name={skill} /> } label={skill} />
								</td>
								<td style={{padding: "0.8rem 2rem"}}>
									<IconButton onClick={(e) => {handleSkillRemoval(indx)}} ><DeleteIcon /></IconButton>
								</td>
							</tr>
						))
					}
					</tbody>
				</table>
			}

		</div>
	);
}

export default AddSkillDetails;