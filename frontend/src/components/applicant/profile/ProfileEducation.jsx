import React, {useState} from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Container, CssBaseline, TextField, Button, IconButton, InputLabel, Select, MenuItem, FormControl} from "@material-ui/core/";
import useStyles from "./completion/CompleteApplicantProfileStyle.js";
import DeleteIcon from '@material-ui/icons/Delete';
import {Grid} from "@material-ui/core";
import axios from "axios";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileEducation(props) {

	const classes = useStyles();
	const yearOptions = Array.from(new Array(100), (x,i) => (i+1922));

	const {educations, setEducations, profile} = props;

	const [educationFormData, setEducationFormData] = useState({
		name: '',
		startYear: '',
		endYear: ''
	});

	const [editMode, setEditMode] = useState(false);

	function handleEducationInputChange(event) {
		const {name, value} = event.target;
		setEducationFormData(oldData => ({
			...oldData,
			[name]: value
		}));
	};

	function handleEducationAddition(event) {
		event.preventDefault();
		const emptyRegexp = /^\s*$/;
		if(
			emptyRegexp.test(educationFormData.name) === false
			&& educationFormData.startYear !== ''
			&& educationFormData.endYear !== ''
			&& (educationFormData.endYear === 0 || educationFormData.endYear >= educationFormData.startYear)
		) {
			setEducations(oldEducations => ([
				...oldEducations,
				{
					name: educationFormData.name,
					startYear: educationFormData.startYear,
					endYear: educationFormData.endYear
				}
			]));
			setEducationFormData({
				name: '',
				startYear: '',
				endYear: ''
			});
		}
	};

	function handleEducationRemoval(indexToBeDeleted) {
		setEducations(oldEducations => {
			const newEducations = oldEducations.filter((education, indx) => (indx !== indexToBeDeleted));
			return newEducations;
		});
	};

	function handleEditEducation(event){
		setEditMode(true);
	};

	function handleSaveEducation(event){
		if(educations.length === 0){
			return null;
		}
		console.log("not empty");
		axios.patch("http://localhost:4000/user/applicant/education/", {
			profile: profile,
			educations: educations
		}).then(res => {
			setEditMode(false);
		}).catch(err => {
			alert("Some error was encountered.");
		});

	};

	return (
		<div style={{textAlign: "center", alignContent: "center", marginTop: "2rem"}}>
			<div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
				<Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
					<ProfileHeader size={8} header={"Education"} />
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							onClick={handleEditEducation}
						>Edit</Button>
					</Grid>
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							disabled={!editMode}
							onClick={handleSaveEducation}
						>Save</Button>
					</Grid>
				</Grid>
			</div>

			<Container component="main" maxWidth="xs" style={{display: (editMode ? null : "none")}}>
				<CssBaseline />
				<div className={classes.paper}>
					<form className={classes.form} noValidate>
						<TextField variant="outlined" margin="normal" required fullWidth id="instituteName" label="Institute Name" name="name" onChange={handleEducationInputChange} autoFocus value={educationFormData.name} />

						<FormControl className={classes.formControl}>
							<InputLabel id="startYearLabel">Start Year</InputLabel>
							<Select required labelId="startYearLabel" name="startYear" value={educationFormData.startYear} onChange={handleEducationInputChange} >
								<MenuItem value={null}>Select a Year</MenuItem>
								{yearOptions.map((year, indx) => (
									<MenuItem key={indx} value={year}>{year}</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl className={classes.formControl}>
							<InputLabel id="endYearLabel">End Year</InputLabel>
							<Select required labelId="endYearLabel" name="endYear" value={educationFormData.endYear} onChange={handleEducationInputChange} >
								<MenuItem value={null}>Select a Year</MenuItem>
								<MenuItem value={0}>Hasn't Ended</MenuItem>
								{yearOptions.map((year, indx) => ( year >= educationFormData.startYear ?
									<MenuItem key={indx} value={year}>{year}</MenuItem>
									: null))}
							</Select>
						</FormControl>

						<Button onClick={handleEducationAddition} type="submit" variant="contained" color="primary" className={classes.submit}  > Add </Button>

					</form>
				</div>
			</Container>

			{ educations.length === 0 ? null : <TableContainer component={Paper} className={classes.tableContainer}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Institute Name</TableCell>
							<TableCell align="center">Start Year</TableCell>
							<TableCell align="center">End Year</TableCell>
							{editMode ? <TableCell align="left">Remove</TableCell> : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{educations.map((education, indx) => (
							<TableRow key={indx}>
								<TableCell component="th" scope="row" align="center">
									{education.name}
								</TableCell>
								<TableCell align="center">{education.startYear}</TableCell>
								<TableCell align="center">{education.endYear === 0 ? "-" : education.endYear}</TableCell>
								{ editMode ? <TableCell align="left">
									<IconButton onClick={(e) => {handleEducationRemoval(indx)}} ><DeleteIcon /></IconButton>
								</TableCell> : null }
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer> }

		</div>
	);
};

export default ProfileEducation;
