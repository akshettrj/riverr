import React, {useEffect, useState} from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {IconButton} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import OpenApplicationsRow from "./OpenApplicationsRow";

function OpenApplications(props) {
	const {jobId, profile} = props;

	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([]);

	function updateOpenApplications(){
		setLoading(true);
		axios.get("http://localhost:4000/job/openApplications", {
			params: {
				profile: profile,
				jobId: jobId
			}
		}).then(res => {
			setLoading(false);
			setApplications(res.data.applications);
		}).catch(err => {
			if(err.response){
				alert(err.response.data);
			}
			else alert("Failed to fetch data");
			console.log(err);
			setLoading(false);
		})
	}

	useEffect(updateOpenApplications, [profile, jobId]);

	return (
		<div style={{paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center", paddingLeft: "2rem", paddingRight: "2rem"}}>
			<div style={{margin: " 2rem auto 4rem auto"}}>
				{
					loading ? <CircularProgress /> :
						<IconButton onClick={updateOpenApplications}>
							<RefreshIcon fontSize={"large"} />
						</IconButton>
				}
			</div>
			{
				applications.length === 0
					? (loading ? <CircularProgress/> : <h4>No open applications for this Job</h4>)
					: <Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">Applicant</TableCell>
								<TableCell align="center">Education</TableCell>
								<TableCell align="center">Skills</TableCell>
								<TableCell align="center">Date Applied</TableCell>
								<TableCell align="center">SOP</TableCell>
								<TableCell align="center">Rating</TableCell>
								<TableCell align="center">Status</TableCell>
								<TableCell align="center">Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								applications.map(application => (
									<OpenApplicationsRow
										key={application.applicationId}
										application={application.applicationId}
										applicant={application.applicant}
										education={application.education}
										skills={application.skills}
										dateOfApplication={application.dateOfApplication}
										profile={profile}
										sop={application.sop}
										rating={application.rating}
										status={application.status}
										updateApplications={updateOpenApplications}
									/>
								))
							}
						</TableBody>
					</Table>
			}
		</div>
	);
};

export default OpenApplications;