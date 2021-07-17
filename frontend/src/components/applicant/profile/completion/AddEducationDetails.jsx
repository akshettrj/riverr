import React, {useState} from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Container, CssBaseline, Typography, TextField, Button, IconButton, InputLabel, Select, MenuItem, FormControl} from "@material-ui/core/";
import useStyles from "./CompleteApplicantProfileStyle.js";
import DeleteIcon from '@material-ui/icons/Delete';

function AddEducationDetails(props) {

	const classes = useStyles();
	const yearOptions = Array.from(new Array(100), (x,i) => (i+1922));

	const {educations, setEducations, isSubmitted} = props;

	const [educationFormData, setEducationFormData] = useState({
		name: '',
		startYear: '',
		endYear: ''
	});

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

	return (
		<div style={{textAlign: "center", alignContent: "center", marginTop: "2rem"}}>
			<h3>Add Education Details</h3>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Enter Detail
					</Typography>
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
						
						<Button onClick={handleEducationAddition} type="submit" variant="contained" color="primary" className={classes.submit} disabled={isSubmitted ? true : false} > Add </Button>

					</form>
				</div>
			</Container>
			{ educations.length === 0
				? null
				: <TableContainer component={Paper} className={classes.tableContainer}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Institute Name</TableCell>
							<TableCell align="center">Start Year</TableCell>
							<TableCell align="center">End Year</TableCell>
							<TableCell align="left">Remove</TableCell>
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
								<TableCell align="left">
									<IconButton onClick={(e) => {handleEducationRemoval(indx)}} ><DeleteIcon /></IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer> }
		</div>
	);
};

export default AddEducationDetails
