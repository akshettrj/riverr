import React, {useEffect, useState} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
	Divider,
	FormControl,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import axios from "axios";
import EmployeeRow from "./EmployeeRow";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function MyEmployees(props) {
	const {
		profile,
	} = props;

	const [loading,setLoading] = useState(true);

	const [employees, setEmployees] = useState([]);

	const [displayEmployees, setDisplayEmployees] = useState([]);

	const [sortOrder, setSortOrder] = useState("asc");

	const [sortBy, setSortBy] = useState("name")

	function sortByName(emp1, emp2) {
		const emp1Name = emp1.name.toLowerCase();
		const emp2Name = emp2.name.toLowerCase();

		if(emp1Name > emp2Name)
			return 1;

		else if(emp1Name < emp2Name)
			return -1;

		return 0;
	}

	function sortByTitle(emp1, emp2) {
		const emp1Title = emp1.jobTitle.toLowerCase();
		const emp2Title = emp2.jobTitle.toLowerCase();

		if(emp1Title > emp2Title)
			return 1;

		else if(emp1Title < emp2Title)
			return -1;

		return 0;
	}

	function sortByJoiningDate(emp1, emp2) {
		const emp1JDate = new Date(emp1.dateOfAcceptance).getTime();
		const emp2JDate = new Date(emp2.dateOfAcceptance).getTime();

		if(emp1JDate > emp2JDate)
			return 1;

		else if(emp1JDate < emp2JDate)
			return -1;

		return 0;
	}

	function sortByRating(emp1, emp2) {
		const emp1Rating = emp1.rating;
		const emp2Rating = emp2.rating;

		if(emp1Rating > emp2Rating)
			return 1;

		else if(emp1Rating < emp2Rating)
			return -1;

		return 0;
	}

	function updateEmployees(){
		props.setJobIdForOpenApplications("");
		setLoading(true);
		axios.get("http://localhost:4000/job/employees", {
			params: {
				profile: profile
			}
		}).then(res => {
			setEmployees(res.data.applications.sort(sortByName));
			setDisplayEmployees(res.data.applications);
			setLoading(false);
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
			else alert("Failed");
			setLoading(false);
		})
	}

	useEffect(updateEmployees, [profile, props]);

	useEffect(() => {
		var newEmployees = [];
		setDisplayEmployees(oldEmployees => {
			newEmployees = employees.filter(emp => true);
			if(sortBy === "name")
				newEmployees.sort(sortByName)
			else if(sortBy === "title")
				newEmployees.sort(sortByTitle)
			else if(sortBy === "joiningDate")
				newEmployees.sort(sortByJoiningDate)
			else if(sortBy === "rating")
				newEmployees.sort(sortByRating)
			if(sortOrder === "des")
				newEmployees.reverse();
			return newEmployees;
		});
	}, [sortOrder, sortBy, employees ])

	return (
		<div style={{paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center", paddingLeft: "2rem", paddingRight: "2rem"}}>
			<div style={{margin: " 2rem auto 4rem auto"}}>
				{
					loading ? <CircularProgress /> :
						<IconButton onClick={updateEmployees}>
							<RefreshIcon fontSize={"large"} />
						</IconButton>
				}
				{
					displayEmployees.length === 0
						? null
						: <div style={{paddingBottom: "4rem", width: "40%"}}>
							<h6 align={"left"}>Sort</h6>
							<Grid container spacing={2}>
								<Grid item xs={12} style={{marginTop: "2rem"}}>
									<FormControl component="fieldset">
										<FormLabel component="legend">Sort By</FormLabel>
										<RadioGroup
											row aria-label="sortBy"
											name="sortBy"
											value={sortBy}
											onChange={(e) => {setSortBy(e.target.value)}}
										>
											<FormControlLabel value="name" control={<Radio />} label="Name" />
											<FormControlLabel value="title" control={<Radio />} label="Title" />
											<FormControlLabel value="joiningDate" control={<Radio />} label="Joining Date" />
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
					displayEmployees.length === 0
						? (loading ? <CircularProgress/> : <h4>No open applications for this Job</h4>)
						: <Table>
							<TableHead>
								<TableRow>
									<TableCell align="center">Employee</TableCell>
									<TableCell align="center">Joining Date</TableCell>
									<TableCell align="center">Job Type</TableCell>
									<TableCell align="center">Job Title</TableCell>
									<TableCell align="center">Rating</TableCell>
									<TableCell align="center">Rate</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									displayEmployees.map(employee => (
										<EmployeeRow
											key={employee.applicationId}
											name={employee.name}
											dateOfJoining={employee.dateOfJoining}
											jobType={employee.jobType}
											jobTitle={employee.jobTitle}
											user={employee.userId}
											profile={profile}
											rating={employee.rating}
											application={employee.applicationId}
											rated={employee.rated}
											updateEmployees={updateEmployees}
										/>
									))
								}
							</TableBody>
						</Table>
				}
			</div>

		</div>
	)

}

export default MyEmployees