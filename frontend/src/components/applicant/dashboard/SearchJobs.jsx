import React, {useEffect, useState} from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import JobListingRow from "./JobListingRow";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
	MenuItem,
	Select,
	InputLabel,
	Divider,
	Checkbox,
	IconButton,
	Slider,
	FormControl, RadioGroup, Radio
} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {FormLabel} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup"

function SearchJobs(props) {

	const {profile} = props;

	const [jobs, setJobs] = useState([]);

	const [displayedJobs, setDisplayedJobs] = useState([]);

	const [loading, setLoading] = useState(true);

	const [jobTypeFilter, setJobTypeFilter] = useState({
		wfh: true,
		pt: true,
		ft: true
	})

	const [durationFilter, setDurationFilter] = useState(1);

	const [salaryFilter, setSalaryFilter] = useState([1, 10000]);

	const [titleFilter, setTitleFilter] = useState("");

	const [fuzzy, setFuzzy] = useState(false);

	const [sortBy, setSortBy] = useState("title");

	const [sortOrder, setSortOrder] = useState("asc");

	function updateJobs() {
		setLoading(true);
		axios.get("http://localhost:4000/job/", {
			params: {
				profile: profile
			}
		}).then(res => {
			setJobs(res.data.jobs.sort(sortByTitle));
			setDisplayedJobs(res.data.jobs.sort(sortByTitle));
			setLoading(false);
		}).catch(err => {
			console.log(err.response.data);
			setLoading(false);
		});
	}

	function sortByTitle(firstEl, secondEl) {
		const firstTitle = firstEl.title.toLowerCase();
		const secondTitle = secondEl.title.toLowerCase();
		if(firstTitle > secondTitle)
			return 1;
		else if(firstTitle < secondTitle)
			return -1;
		return 0;
	}

	function sortBySalary(firstEl, secondEl) {
		const firstSalary = firstEl.monthlySalary;
		const secondSalary = secondEl.monthlySalary;
		if(firstSalary > secondSalary)
			return 1;
		else if(firstSalary < secondSalary)
			return -1;
		return 0;
	}

	function sortByDuration(firstEl, secondEl) {
		const firstDuration = firstEl.durationInMonths;
		const secondDuration = secondEl.durationInMonths;
		if(
			(firstDuration === 0 && secondDuration !== 0)
			|| (firstDuration !== 0 && secondDuration !== 0 && firstDuration > secondDuration)
		)
			return 1;
		else if(
			(firstDuration !== 0 && secondDuration === 0)
			|| (firstDuration !== 0 && secondDuration !== 0 && secondDuration > firstDuration)
		)
			return -1;
		return 0;
	}

	function sortByRating(firstEl, secondEl) {
		const firstRating = firstEl.rating;
		const secondRating = secondEl.rating;
		if(firstRating > secondRating)
			return 1;
		else if(firstRating < secondRating)
			return -1;
		return 0;
	}

	useEffect(updateJobs, [profile]);

	useEffect(() => {
		var newJobs = [];
		setDisplayedJobs(oldJobs => {
			if(fuzzy) {
				var titleFuzString = "";
				var i;
				for(i=0; i<titleFilter.length; i++){
					titleFuzString += ".*";
					titleFuzString += titleFilter[i].toLowerCase();
				}
				titleFuzString += ".*";
				const titleRegExp = new RegExp(titleFuzString, "i");
				newJobs = jobs.filter((job) => {
					return titleRegExp.test(job.title.toLowerCase());
				});
			}
			if(!fuzzy){
				newJobs = jobs.filter((job) => {
					return job.title.toLowerCase().includes(titleFilter.toLowerCase());
				});
			}
			newJobs = newJobs.filter((job) => {
				return job.monthlySalary >= salaryFilter[0] && job.monthlySalary <= salaryFilter[1];
			});
			newJobs = newJobs.filter((job) => {
				return (jobTypeFilter.wfh && job.typeOfJob === 0)
					|| (jobTypeFilter.pt && job.typeOfJob === 1)
					|| (jobTypeFilter.ft && job.typeOfJob === 2)
			});
			newJobs = newJobs.filter((job) => {
				return durationFilter === 1
					|| (1 <= job.durationInMonths && job.durationInMonths < durationFilter);
			});
			if(sortBy === "title") {
				newJobs.sort(sortByTitle);
			}
			else if(sortBy === "salary") {
				newJobs.sort(sortBySalary);
			}
			else if(sortBy === "duration") {
				newJobs.sort(sortByDuration);
			}
			else if(sortBy === "rating") {
				newJobs.sort(sortByRating);
			}
			if(sortOrder === "des") {
				newJobs.reverse();
			}

			return newJobs;
		})
	}, [jobTypeFilter, salaryFilter, titleFilter, fuzzy, durationFilter, sortOrder, sortBy, jobs]);

	function handleJobTypeFilter(e){
		const {name, checked} = e.target;
		setJobTypeFilter(oldFilter => {
			return {
				...oldFilter,
				[name]: checked
			};
		})
	}

	return (
		<div style={{paddingBottom: "4rem", paddingTop: "4rem", paddingLeft: "2rem", paddingRight: "2rem"}}>
			<div style={{margin: " 2rem auto 4rem auto"}}>
				{
					loading ? <CircularProgress /> :
					<IconButton onClick={updateJobs}>
						<RefreshIcon fontSize={"large"}/>
					</IconButton>
				}
			</div>
			{
				jobs.length === 0
					? null
					: <div style={{paddingBottom: "4rem", width: "40%"}}>
						<h6 align={"left"}>Filter</h6>
						<Grid container spacing={2}>
							<Grid item xs={10} >
								<TextField
									variant="outlined"
									margin="normal"
									label="Enter a title"
									name="titleFilter"
									value={titleFilter}
									onChange={(e) => {setTitleFilter(e.target.value)}}
								/>
							</Grid>
							<Grid item xs={2}>
								<FormControlLabel
									control={
										<Checkbox
											name="checkedB"
											color="primary"
											value={fuzzy}
											onChange={(e) => {setFuzzy(e.target.checked)}}
										/>
									}
									label="Fuzzy"
								/>
							</Grid>
							<Grid item xs={12}>
								<FormLabel component="legend">Select Job Type</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={jobTypeFilter.wfh}
												onChange={handleJobTypeFilter}
												name="wfh"
											/>
										}
										label="Work From Home"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={jobTypeFilter.pt}
												onChange={handleJobTypeFilter}
												name="pt"
											/>
										}
										label="Part Time"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={jobTypeFilter.ft}
												onChange={handleJobTypeFilter}
												name="ft"
											/>
										}
										label="Full Time"
									/>
								</FormGroup>
							</Grid>
							<Grid item xs={4}>
								<text >{`${salaryFilter[0]} <=`}</text>
							</Grid>
							<Grid item xs={4}>
								<InputLabel id="salaryLabel">Salary</InputLabel>
								<Slider
									value={salaryFilter}
									onChange={(e, val) => {setSalaryFilter(val)}}
									max={10000}
									min={1}
									aria-labelledby="range-slider"
									getAriaValueText={(val) => (`₹ ${val}`)}
								/>
							</Grid>
							<Grid item xs={4}>
								<text >{`<= ${salaryFilter[1]} `}</text>
							</Grid>
							<Grid item xs={6}>
								<InputLabel id="durationLabel">Duration</InputLabel>
								<Select
									labelId="durationLabel"
									onChange={(e) => {setDurationFilter(e.target.value)}}
									defaultValue={1}
									value={durationFilter}
								>
									<MenuItem value={1}>Indeterminate</MenuItem>
									<MenuItem value={2}>Atmost 1 Month</MenuItem>
									<MenuItem value={3}>Atmost 2 Months</MenuItem>
									<MenuItem value={4}>Atmost 3 Months</MenuItem>
									<MenuItem value={5}>Atmost 4 Months</MenuItem>
									<MenuItem value={6}>Atmost 5 Months</MenuItem>
									<MenuItem value={7}>Atmost 6 Months</MenuItem>
							</Select>
							</Grid>
							<Grid item xs={12} style={{marginTop: "2rem"}}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Sort By</FormLabel>
									<RadioGroup
										row aria-label="sortBy"
										name="sortBy"
										value={sortBy}
										onChange={(e) => {setSortBy(e.target.value)}}
									>
										<FormControlLabel value="title" control={<Radio />} label="Title" />
										<FormControlLabel value="salary" control={<Radio />} label="Salary" />
										<FormControlLabel value="duration" control={<Radio />} label="Duration" />
										<FormControlLabel value="rating" control={<Radio />} label="Rating" />
									</RadioGroup>
									<FormLabel component="legend">Order</FormLabel>
									<RadioGroup
										row aria-label="sortOrder"
										name="sortOrder"
										value={sortOrder}
										onChange={(e) => {setSortOrder(e.target.value)}}
									>
										<FormControlLabel value="asc" control={<Radio />} label="Ascending" />
										<FormControlLabel value="des" control={<Radio />} label="Descending" />
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
					</div>
			}
			<Divider />
				{
					displayedJobs.length === 0
					? loading ? <CircularProgress /> : <h3>No jobs you can apply to</h3>
					: <Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">Title</TableCell>
								<TableCell align="center">Recruiter</TableCell>
								<TableCell align="center">Salary</TableCell>
								<TableCell align="center">Duration</TableCell>
								<TableCell align="center">Type</TableCell>
								<TableCell align="center">Deadline</TableCell>
								<TableCell align="center">Seats Left</TableCell>
								<TableCell align="center">Rating</TableCell>
								<TableCell align="center">Apply</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedJobs.map((job, indx) => (
								<JobListingRow
									key={job.jobId}
									title={job.title}
									recruiter={job.recruiterName}
									salary={job.monthlySalary}
									duration={job.durationInMonths}
									typeOfJob={job.typeOfJob}
									deadline={new Date(job.deadline)}
									seatsLeft={job.seatsLeft}
									applied={job.alreadyApplied}
									applicationsLeft={job.applicationsLeft}
									rating={job.rating}
									index={indx}
									updateJobs={updateJobs}
									profile={profile}
									jobId={job.jobId}
								/>
							))}
						</TableBody>
					</Table>
			}
		</div>
	);
}

export default SearchJobs;