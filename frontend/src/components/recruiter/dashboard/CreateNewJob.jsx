import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {IconButton, FormControl, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select} from "@material-ui/core";
import useStyles from "./CreateNewJobStyle";
import axios from "axios";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import DeleteIcon from "@material-ui/icons/Delete";

export default function CreateNewJob(props) {
	const classes = useStyles();

	const {profile, setValue} = props;

	const [formData, setFormData] = useState({
		title: "",
		monthlySalary: "",
		typeOfJob: "",
		requiredSkills: [],
		durationInMonths: 0,
		maxApplications: "",
		deadline: new Date().setDate(
			new Date().getDate() + 1
		),
		positionsAvailable: "",
	});

	useEffect(() => {
		props.setJobIdForOpenApplications("");
	}, [profile, props]);

	const [newSkillName, setNewSkillName] = useState("");

	function handleInputChanges(event) {
		const {name, value} = event.target;
		if(name === "monthlySalary" && value !== "" && (value < 1) ){
			return 0;
		}
		if(name === "positionsAvailable" && value !== "" && (value < 1) ){
			return 0;
		}
		if(name === "maxApplications" && value !== "" && (value < 1) ){
			return 0;
		}
		setFormData({
			...formData,
			[name]: value,
		});
	};

	function handleDeadlineChange(date) {
		setFormData(oldData => {
			return {
				...oldData,
				deadline: new Date(date)
			}
		});
	};

	function handleFormSubmit(event) {
		event.preventDefault();
		axios.post("http://localhost:4000/job/", {
			profile: profile,
			details: formData
		}).then(res => {
			setValue(0);
		}).catch(err => {
			console.log(err.response.data);
		});
	};

	function handleNewSkillInputChange(event) {
		const value = event.target.value;
		setNewSkillName(value);
	};

	function handleNewSkillAddition(event) {
		event.preventDefault();
		const testRegexp = /^\s*$/;
		if(
			testRegexp.test(newSkillName) === false
			&& formData.requiredSkills.findIndex(element => (newSkillName === element)) === -1
		) {
			setFormData(oldData => {
				oldData.requiredSkills.push(newSkillName);
				return oldData;
			});
			setNewSkillName("");
		}
	};

	function handleSkillRemoval(index){
		setFormData(oldData => {
			oldData.requiredSkills = oldData.requiredSkills.filter((name, indx) => (indx !== index));
			return oldData;
		});
	};

	return (
		<div>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<h4>Create A New Job</h4>
					<form className={classes.form} onSubmit={handleFormSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<TextField
									name="title"
									variant="outlined"
									required
									fullWidth
									label="Job Title"
									autoFocus
									value={formData.title}
									onChange={handleInputChanges}
								/>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<TextField
									variant={"outlined"}
									required
									fullWidth
									type={"Number"}
									name={"monthlySalary"}
									label={"Monthly Salary"}
									value={formData.monthlySalary}
									onChange={handleInputChanges}
									helperText={"Min: 1"}
								/>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<TextField
									variant={"outlined"}
									required
									fullWidth
									type={"Number"}
									name={"positionsAvailable"}
									label={"Available Positions"}
									value={formData.positionsAvailable}
									onChange={handleInputChanges}
									helperText={"Min: 1"}
								/>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<TextField
									variant={"outlined"}
									required
									fullWidth
									type={"Number"}
									name={"maxApplications"}
									label={"Applications Allowed"}
									value={formData.maxApplications}
									onChange={handleInputChanges}
									helperText={`Min: 1`}
								/>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<InputLabel id={"jobDuration"} >Duration of Job</InputLabel>
								<Select
									required
									labelId={"jobDuration"}
									name={"durationInMonths"}
									onChange={handleInputChanges}
									value={formData.durationInMonths}
									fullWidth
								>
									<MenuItem value={0}>Indefinite</MenuItem>
									<MenuItem value={1}>1 Month</MenuItem>
									<MenuItem value={2}>2 Months</MenuItem>
									<MenuItem value={3}>3 Months</MenuItem>
									<MenuItem value={4}>4 Months</MenuItem>
									<MenuItem value={5}>5 Months</MenuItem>
									<MenuItem value={6}>6 Months</MenuItem>
								</Select>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Job Type</FormLabel>
									<RadioGroup row aria-label="typeOfJob" name="typeOfJob" value={formData.typeOfJob} onChange={handleInputChanges} >
										<FormControlLabel value="workFromHome" control={<Radio />} label="Work From Home" />
										<FormControlLabel value="partTime" control={<Radio />} label="Part Time" />
										<FormControlLabel value="fullTime" control={<Radio />} label="Full Time" />
									</RadioGroup>
								</FormControl>
							</Grid>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<Grid item xs={12} style={{margin: "2rem auto"}}>
									<KeyboardDateTimePicker
										margin="normal"
										name="deadline"
										label="Applications Deadline"
										value={formData.deadline}
										disablePast
										onChange={handleDeadlineChange}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</Grid>
							</MuiPickersUtilsProvider>
							<Grid item xs={10} >
								<TextField
									variant="outlined"
									margin="normal"
									id="skillName"
									label="Enter required skills"
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
								>
									Add
								</Button>
							</Grid>
							{formData.requiredSkills.length === 0
								? null
								: <table style={{backgroundColor: "white", width: "20%", margin: "2rem auto"}}>
									<tbody>
									{
										formData.requiredSkills.map((skill, indx) => (
											<tr style={{borderBottom: "1px solid grey"}} key={skill}>
												<td style={{padding: "0.8rem 2rem", alignItems: "left"}}>
													{skill}
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
						</Grid>
						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Create </Button>
					</form>
				</div>
			</Container>
		</div>
	);
}
