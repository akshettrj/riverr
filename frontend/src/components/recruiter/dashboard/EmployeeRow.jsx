import React, {useState} from "react"
import {Button, TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import {Rating} from "@material-ui/lab";
import axios from "axios";

function EmployeeRow(props){
	const {
		name,
		dateOfJoining: jDate,
		jobType,
		jobTitle,
		profile,
		rating,
		application,
		rated,
		updateEmployees
	} = props;

	const jobTypeString =
		jobType === 0
			? "W.F.H"
			: jobType === 1
				? "Part Time"
				: "Full Time"

	const [ratingMode, setRatingMode] = useState(false);

	const [newRating, setNewRating] = useState(0);

	function rateEmployee(){
		axios.patch("http://localhost:4000/user/rate", {
			profile: profile,
			applicationId: application,
			rating: newRating
		}).then(res => {
			setRatingMode(false);
			setNewRating(0);
			updateEmployees();
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
			else alert("Failure");
			setRatingMode(false);
			setNewRating(0);
			updateEmployees();
		})
	}

	return (
		<TableRow>
			{
				ratingMode
					? <>
						<TableCell align={"center"} colSpan={4}>
							<Rating
								precision={0.5}
								value={newRating}
								onChange={(e) => {setNewRating(e.target.value)}}
							/>
						</TableCell>
						<TableCell align={"center"}>
							<Button type="submit" fullWidth variant="contained"
							        style={{
								        backgroundColor: "yellow",
								        color: "black"
							        }}
							        onClick={(e) => {
								        setRatingMode(false);
								        setNewRating(0);
							        }}
							>Cancel</Button>
						</TableCell>
						<TableCell align={"center"}>
							<Button type="submit" fullWidth variant="contained"
							        style={{
								        backgroundColor: "#E89D0C",
								        color: "white"
							        }}
							        onClick={rateEmployee}
							>Rate</Button>
						</TableCell>
					</>
					: <>
						<TableCell align="center">{name}</TableCell>
						<TableCell align="center">{
							new Date(jDate).toLocaleDateString()
						}</TableCell>
						<TableCell align="center">{jobTypeString}</TableCell>
						<TableCell align="center">{jobTitle}</TableCell>
						<TableCell align="center">{<Rating name={"employeeRating"} readOnly value={rating} precision={0.5}/>}</TableCell>
						<TableCell align="center">
							<Button type="submit" fullWidth variant="contained"
							        style={{
								        backgroundColor: rated ? "yellow" : "#E89D0C",
								        color: rated ? "black" : "white"
							        }}
							        onClick={(e) => {
								        setRatingMode(true)
							        }}
							        disabled={rated}
							>{rated ? "Done" : "Rate"}</Button>
						</TableCell>
					</>
			}
		</TableRow>
	)

}

export default EmployeeRow