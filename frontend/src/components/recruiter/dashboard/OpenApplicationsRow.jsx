import React from "react";
import axios from "axios";
import {Button, TableCell, TableRow} from "@material-ui/core";
import {Rating} from "@material-ui/lab";

function OpenApplicationsRow(props) {

	const {
		application,
		applicant,
		education,
		skills,
		dateOfApplication,
		sop,
		rating,
		status,
	} = props;

	const dateOfApplicationString = `${new Date(dateOfApplication).toLocaleDateString()} @ ${new Date(dateOfApplication).toLocaleTimeString()}`

	var skillsDisplay = ""
	skills.forEach((skill, indx, arr) => {
		skillsDisplay += skill;
		if(indx !== arr.length - 1)
			skillsDisplay += ", ";
	});

	function shortListOrAcceptApplication(){
		axios.patch("http://localhost:4000/job/moveApplicationForward", {
			applicationId: application,
			profile: props.profile
		}).then(res => {
			props.updateApplications();
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
			else alert("Failed");
			props.updateApplications();
		});
	}
	function rejectApplication() {
		axios.patch("http://localhost:4000/job/reject", {
			applicationId: application,
			profile: props.profile
		}).then(res => {
			props.updateApplications();
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
			else alert("Failed");
			props.updateApplications();
		});
	}

	return (
			<TableRow>
				<TableCell  align={"center"}>{applicant}</TableCell>
				<TableCell  align={"center"} style={{width: "15%"}}>{
					<ul>
						{education.map(edu => (
							<li><b>{`${edu.name}`}</b> {`(${edu.startYear} - ${edu.endYear})`}</li>
						))}
					</ul>
				}</TableCell>
				<TableCell  align={"center"}>{skillsDisplay}</TableCell>
				<TableCell  align={"center"}>{dateOfApplicationString}</TableCell>
				<TableCell  align={"center"} style={{width: "20%"}}>{sop}</TableCell>
				<TableCell  align={"center"}>{<Rating value={rating} readOnly precision={0.5} />}</TableCell>
				<TableCell  align={"center"} style={{width: "3%"}}>{
					status === 0
						? <Button type="submit" fullWidth variant="contained"
						          style={{backgroundColor: "yellow", color: "black"}}
						          disabled
						>Applied</Button>
						: status === 1
						? <Button type="submit" fullWidth variant="contained"
						          style={{backgroundColor: "blue", color: "white"}}
						          disabled
						>ShortListed</Button>
						: <Button type="submit" fullWidth variant="contained"
						          style={{backgroundColor: "green", color: "white"}}
						          disabled
						>Accepted</Button>

				}</TableCell>
				<TableCell  align={"center"}>
					{
						status === 2
							? "-"
							: <>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									style={{backgroundColor: "green", color: "white", margin: "3px"}}
									onClick={shortListOrAcceptApplication}
								>{status === 0 ? "ShortList" : "Accept"}</Button>
								<br />
								<Button
									type="submit"
									fullWidth
									variant="contained"
									style={{backgroundColor: "red", color: "white", margin: "3px"}}
	r							onClick={rejectApplication}
								>Reject</Button>
							</>
					}
				</TableCell>
			</TableRow>
	);
}
export default OpenApplicationsRow;