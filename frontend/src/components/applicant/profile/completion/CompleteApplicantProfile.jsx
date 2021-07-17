import { Button } from '@material-ui/core';
import React, {useState} from 'react';
import AddEducationDetails from "./AddEducationDetails";
import AddSkillDetails from "./AddSkillDetails";
import useStyles from "./CompleteApplicantProfileStyle";
import axios from "axios";

function CompleteApplicantProfile(props) {

	const classes = useStyles();
	const [isSubmitted, setIsSubmitted] = useState(false);

	document.title = "Complete Profile to Continue";

	const [educations, setEducations] = useState([]);

	const [skills, setSkills] = useState(new Map());

	const {profile} = props;
	console.log(props);

	function handleProfileCompletion(event) {
		event.preventDefault();
		const skillsToSubmit = [];
		const educationsToSubmit = [];
		const emptyRegexp = /^\s*$/;

		setIsSubmitted(true);

		skills.forEach((value, key) => {
			if(value === true){
				skillsToSubmit.push(key);
			}
		});

		educations.forEach((education, indx) =>{
			const {name, startYear, endYear} = education;
			if(
				emptyRegexp.test(name) === false
				&& (endYear === 0 || startYear <= endYear)
			) {
				educationsToSubmit.push(education);
			}
		});

		axios.patch("http://localhost:4000/user/profile", {skills: skillsToSubmit, educations: educationsToSubmit, profile: profile})
		.then(res => {
			setIsSubmitted(false);
			props.setProfile({
				...props.profile,
				profileCompleted: true
			})
		})
		.catch(err => {
			console.log(err.response.data);
			console.log(profile);
			setIsSubmitted(false);
		});

	};

	return (
		<div style={{textAlign: "center"}}>
			<AddEducationDetails educations={educations} setEducations={setEducations} isSubmitted={isSubmitted} />
			<hr style={{width: "5%", borderTop: "0.4rem dotted", margin: "4rem auto"}} />
			<AddSkillDetails skills={skills} setSkills={setSkills} isSubmitted={isSubmitted} />
			<hr style={{width: "5%", borderTop: "0.4rem dotted", margin: "4rem auto"}} />
			<div style={{margin: "4rem auto"}}>
			<Button color="primary" type="sumbit" className={classes.submit} style={{padding: "1rem 2rem"}} variant="contained" onClick={handleProfileCompletion} >Save Changes</Button>
			</div>
		</div>
	);
};

export default CompleteApplicantProfile;
