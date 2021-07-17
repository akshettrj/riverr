import React, {useState} from "react";
import {Button, TableCell, TableRow} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import axios from "axios";

function MyApplicationRow(props) {

	const {
		profile,
		applicationId,
		updateApplications,
		title,
		salary,
		recruiter,
		duration,
		type,
		status,
		acceptedOn,
		rating,
		jobId,
		rated
	} = props;

	const durationString = duration === 0
		? "Indeterminate"
		: `${duration} Month` + (duration === 1 ? "s" : "")

	const jobType = type === 0
		? "W.F.H."
		: type === 1 ? "Part Time" : "Full Time"

	const applicationStatus = status === 0
		? "Applied"
		: status === 1
			? "Short Listed"
			: status === 2
				? "Accepted"
				: "Rejected"

	const applicationStatusColor = status === 0
		? "yellow"
		: status === 1
			? "Cyan"
			: status === 2
				? "green"
				: "red"

	const [jobRating, setJobRating] = useState(0);
	const [ratingMode, setRatingMode] = useState(false);

	function rateJob(){
		axios.post("http://localhost:4000/job/rate", {
			jobId: jobId,
			profile: profile,
			applicationId: applicationId,
			jobRating: jobRating
		}).then(res => {
			setRatingMode(false);
			setJobRating(0);
			updateApplications();
		}).catch(err => {
			if(err.response){
				alert(err.response.data)
			}
			setRatingMode(false);
			setJobRating(0);
			updateApplications();
		});
	};

	return (
		<>
			{
				ratingMode
					? <TableRow>
						<TableCell align={"center"} colSpan={7} >{
							<Rating
								value={jobRating}
								onChange={(e) => {setJobRating(e.target.value)}}
								precision={0.5}
							/>
						}</TableCell>
						<TableCell align={"center"}>
							<Button type="submit" fullWidth variant="contained"
							        style={{backgroundColor: "#E89D0C", color: "white"}}
							        onClick={(e) => {setRatingMode(false); setJobRating(0)}}
							>Cancel</Button>
						</TableCell>
						<TableCell align={"center"}>
							<Button type="submit" fullWidth variant="contained"
							        style={{backgroundColor: "#E89D0C", color: "white"}}
							        onClick={rateJob}
							>Rate</Button>
						</TableCell>
					</TableRow>
					: <TableRow>
						<TableCell align={"center"} >{title}</TableCell>
						<TableCell align={"center"} >{salary}</TableCell>
						<TableCell align={"center"} >{recruiter}</TableCell>
						<TableCell align={"center"} >{durationString}</TableCell>
						<TableCell align={"center"} >{jobType}</TableCell>
						<TableCell align={"center"} ><Button disabled style={{backgroundColor: applicationStatusColor, color: status < 2 ? "black" : "white"}}>{applicationStatus}</Button></TableCell>
						<TableCell align={"center"} >{
							status === 2
								? `${new Date(acceptedOn).toLocaleDateString()} @ ${new Date(acceptedOn).toLocaleTimeString()}`
								: "-"
						}</TableCell>
						<TableCell align={"center"} ><Rating readOnly value={rating} precision={0.5} /></TableCell>
						<TableCell align={"center"} >{
							status === 2
								? <Button type="submit" fullWidth variant="contained"
								          style={{backgroundColor: rated?"yellow":"#E89D0C", color: rated?"black":"white"}}
								          onClick={(e) => {setRatingMode(true)}}
								          disabled={rated}
								>{rated ? "Done" : "Rate"}</Button>
								: "-"
						}</TableCell>

					</TableRow>
			}
		</>
	);
}

export default MyApplicationRow;