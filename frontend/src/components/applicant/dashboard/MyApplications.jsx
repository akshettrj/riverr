import React, {useEffect, useState} from "react";
import axios from "axios";
import {CircularProgress, IconButton} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import MyApplicationRow from "./MyApplicationRow";

function MyApplications(props) {

	const {profile} = props;

	const [applications, setApplications] = useState([]);

	const [loading, setLoading] = useState(true);

	function updateApplications(){
		setLoading(true);
		axios.get("http://localhost:4000/job/applications", {
			params: {profile: profile}
		}).then(res => {
			setLoading(false);
			setApplications(res.data.applications.sort((a1, a2) => {
				if(a1.jobId.title > a2.jobId.title)
					return 1;
				else if(a1.jobId.title < a2.jobId.title)
					return -1;
				return 0;
			}));
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
		})
	}

	useEffect(updateApplications, [profile]);

	return (
		<div  style={{paddingBottom: "4rem", paddingTop: "4rem"}}>
			{
				loading ? <CircularProgress /> :
				<IconButton onClick={updateApplications}>
					<RefreshIcon fontSize={"large"}/>
				</IconButton>
			}
			{
				applications.length === 0
					? loading ? <CircularProgress /> : <h3>You have no open applications</h3>
					: <Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">Title</TableCell>
								<TableCell align="center">Salary</TableCell>
								<TableCell align="center">Recruiter</TableCell>
								<TableCell align="center">Duration</TableCell>
								<TableCell align="center">Type</TableCell>
								<TableCell align="center">Status</TableCell>
								<TableCell align="center">Accepted On</TableCell>
								<TableCell align="center">Rating</TableCell>
								<TableCell align="center">Rate</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								applications.map(application => (
									<MyApplicationRow
										profile={profile}
										key={application._id}
										applicationId={application._id}
										updateApplications={updateApplications}
										title={application.jobId.title}
										salary={application.jobId.monthlySalary}
										recruiter={`${application.creatorId.fName} ${application.creatorId.lName}`}
										duration={application.jobId.durationInMonths}
										type={application.jobId.typeOfJob}
										status={application.status}
										acceptedOn={application.dateOfAcceptance}
										rating={application.jobId.rating}
										rated={application.jobRated}
										jobId={application.jobId._id}
									/>
								))
							}
						</TableBody>
					</Table>
			}
		</div>
	);
};

export default MyApplications;