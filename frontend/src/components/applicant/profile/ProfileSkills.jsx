import React, { useState} from "react";
import axios from "axios";
import { Container, CssBaseline, TextField, Button, IconButton } from "@material-ui/core/";
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from "./completion/CompleteApplicantProfileStyle.js";
import {Grid} from "@material-ui/core";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileSkills(props) {
	const classes = useStyles();

	const { skills, setSkills } = props;

	const [newSkillName, setNewSkillName] = useState("");

	const [editMode, setEditMode] = useState(false)

	function handleNewSkillInputChange(event) {
		const value = event.target.value;
		setNewSkillName(value);
	};

	function handleNewSkillAddition(event) {
		event.preventDefault();
		const testRegexp = /^\s*$/;
		if(
			testRegexp.test(newSkillName) === false
			&& skills.findIndex(element => (newSkillName === element)) === -1
		) {
			setSkills((oldSkills) => {
				return [newSkillName, ...oldSkills];
			});
			setNewSkillName("");
		}
	};

	function handleSkillRemoval(index){
		setSkills(oldSkills => {
			return oldSkills.filter((name, indx) => (indx !== index));
		});
	};

	function handleEditSkill(){
		setEditMode(true);
	};

	function handleSaveSkill(){
		axios.patch("http://localhost:4000/user/applicant/skills", {
			profile: props.profile,
			skills: skills
		}).then(res => {
			setEditMode(false);
		}).catch(err => {
			console.log(err);
		});
	};

	return (
		<div style={{ textAlign: "center", alignContent: "center", marginTop: "2rem" }} >

			<div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
				<Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
					<ProfileHeader size={8} header={"Skills"} />
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							onClick={handleEditSkill}
						>Edit</Button>
					</Grid>
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							disabled={!editMode}
							onClick={handleSaveSkill}
						>Save</Button>
					</Grid>
				</Grid>
			</div>

			<Container component="main" maxWidth="xs" style={{display: (editMode?null:"none")}}>
				<CssBaseline />
				<div className={classes.paper}>
					<form className={classes.form} noValidate>
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
						<Button
							onClick={handleNewSkillAddition}
							type="submit"
							variant="contained"
							color="primary"
							style={{marginLeft: "2rem"}}
							className={classes.submit}
						>
							Add
						</Button>
					</form>
				</div>
			</Container>

			{
				 <table style={{backgroundColor: "white", width: "20%", margin: "2rem auto"}}>
					<tbody>
					{
						skills.map((skill, indx) => (
							<tr style={{borderBottom: "1px solid grey"}} key={skill}>
								<td style={{padding: "0.8rem 2rem", alignItems: "left"}}>
									<p>{skill}</p>
								</td>
								{editMode ? <td style={{padding: "0.8rem 2rem"}}>
									<IconButton onClick={(e) => {handleSkillRemoval(indx)}} ><DeleteIcon /></IconButton>
								</td>: null}
							</tr>
						))
					}
					</tbody>
				</table>
			}
		</div>
	);
}

export default ProfileSkills;
