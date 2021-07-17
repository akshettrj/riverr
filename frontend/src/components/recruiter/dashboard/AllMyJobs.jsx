import React, {useEffect, useState} from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import JobListingRow from "./JobListingRow";
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from "@material-ui/icons/Refresh";
import {IconButton} from "@material-ui/core";

function AllMyJobs(props){

	const {profile, setJobIdForOpenApplications} = props;

	const [jobs, setJobs] = useState([]);

	const [loading, setLoading] = useState(true);

	function updateJobs(){
		setLoading(true);
		axios.get("http://localhost:4000/job/myJobs", {
			params: {
				profile: profile
			}
		}).then(res => {
			setJobs(res.data.activeJobs.sort((firstEl, secondEl) => {
				return new Date(firstEl.dateCreated).getTime() > new Date(secondEl.dateCreated).getTime();
			}));
			setJobIdForOpenApplications("");
			setLoading(false);
		}).catch(err => {
			console.log(err.response.data);
			setLoading(false);
		});
	};

	useEffect(updateJobs, [profile, setJobIdForOpenApplications]);

	return (
		<div style={{paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center", paddingLeft: "2rem", paddingRight: "2rem"}}>
			<div style={{margin: " 2rem auto 4rem auto"}}>
				{
					loading ? <CircularProgress /> :
						<IconButton onClick={updateJobs}>
							<RefreshIcon fontSize={"large"} />
						</IconButton>
				}
			</div>
			{
				jobs.length === 0
					? loading ? <CircularProgress /> : <h3>No active job listings !</h3>
					: <Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">Title</TableCell>
								<TableCell align="center">Posted On</TableCell>
								<TableCell align="center">Positions Available</TableCell>
								<TableCell align="center">Applicants</TableCell>
								<TableCell align="center">Accepted</TableCell>
								<TableCell align="center">Deadline</TableCell>
								<TableCell align="center">Max Applications</TableCell>
								<TableCell align="center">Max Positions</TableCell>
								<TableCell align="center">{""}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{jobs.map((job, indx) => (
								<JobListingRow
									key={job.jobId}
									profile={profile}
									jobId={job.jobId}
									title={job.title}
									dateCreated={job.dateCreated}
									positionsLeft={job.positionsLeft}
									applicantCount={job.applicantCount}
									acceptedApplications={job.acceptedApplications}
									maxApplications={job.maxApplications}
									positionsAvailable={job.positionsAvailable}
									deadline={job.deadline}
									index={indx}
									setJobIdForOpenApplications={setJobIdForOpenApplications}
									setValue={props.setValue}
									updateJobs={updateJobs}
									{...props}
								/>
								))}
						</TableBody>
					</Table>
			}
		</div>
	);
};

export default AllMyJobs;