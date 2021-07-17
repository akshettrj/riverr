import React, {useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import axios from "axios";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import VisibilityIcon from '@material-ui/icons/Visibility';

function JobListingRow(props) {

	const {
		profile,
		jobId,
		title,
		dateCreated,
		positionsLeft,
		applicantCount,
		acceptedApplications,
		maxApplications,
		positionsAvailable,
		deadline,
		updateJobs,
		setJobIdForOpenApplications,
		setValue
	} = props;

	const [editMode, setEditMode] = useState(false);
	const [newMaxApplicants, setNewMaxApplicants] = useState(maxApplications);
	const [newPositions, setNewPositions] = useState(positionsAvailable);
	const [newDeadLine, setNewDeadline] = useState(deadline);

	function saveChanges() {
		axios.patch("http://localhost:4000/job/myJob", {
			profile: profile,
			maxApplications: newMaxApplicants,
			deadline: newDeadLine,
			positionsAvailable: newPositions,
			jobId: jobId
		}).then(res => {
			setEditMode(false);
			updateJobs();
		}).catch(err => {
			console.log(err);
		})
	}

	function cancelEdit() {
		setEditMode(false);
		setNewDeadline(deadline);
		setNewMaxApplicants(maxApplications);
		setNewPositions(positionsAvailable);
	}

	function deleteJob() {
		axios.delete("http://localhost:4000/job/myJob", {
			params: {
				jobId: jobId,
				profile: profile
			}
		}).then(res => {
			updateJobs();
		}).catch(err => {
			alert("fail");
		});
	}

	function editJob() {
		setEditMode(true);
	}

	function handleDeadlineChange(date){
		setNewDeadline(new Date(date));
	}

	function handleMaxApplicantsChange(event){
		const {value} = event.target;
		setNewMaxApplicants(value);
	}

	function handlePositionsChange(event){
		const {value} = event.target;
		setNewPositions(value);
	}

	function viewOpenApplications(){
		setJobIdForOpenApplications(jobId);
		setValue(4);
	}

	return (
		<TableRow>
			<TableCell component="th" scope="row" align="center">
				{title}
			</TableCell>
			<TableCell align="center">{new Date(dateCreated).toLocaleDateString() + " @ " + new Date(dateCreated).toLocaleTimeString()}</TableCell>
			<TableCell align="center">{positionsLeft}</TableCell>
			<TableCell align="center">{applicantCount}</TableCell>
			<TableCell align="center">{acceptedApplications}</TableCell>
			<TableCell align="center">{
				editMode
				?
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDateTimePicker
							margin="normal"
							name="deadline"
							label="Applications Deadline"
							value={newDeadLine}
							disablePast
							onChange={handleDeadlineChange}
							KeyboardButtonProps={{
								'aria-label': 'change time',
							}}
						/>
					</MuiPickersUtilsProvider>
				: new Date(deadline).toLocaleDateString() + " @ " + new Date(deadline).toLocaleTimeString()
			}</TableCell>
			<TableCell align="center">{
				editMode
					?
					<TextField
						variant={"outlined"}
						required
						type={"Number"}
						name={"maxApplications"}
						label={"Applications Allowed"}
						value={newMaxApplicants}
						onChange={handleMaxApplicantsChange}
						helperText={""}
					/>
					: maxApplications
			}</TableCell>
			<TableCell align={"center"}>
				{
					editMode
						?
						<TextField
							variant={"outlined"}
							required
							type={"Number"}
							name={"positionsAvailable"}
							label={"Positions Available"}
							value={newPositions}
							onChange={handlePositionsChange}
							helperText={""}
						/>
						: positionsAvailable
				}
			</TableCell>
			<TableCell align="center">
				{
					editMode ? null :
					<IconButton onClick={deleteJob}>
						<DeleteIcon/>
					</IconButton>
				}
				{
					editMode ? null :
					<IconButton  onClick={editJob}>
						<EditIcon />
					</IconButton>
				}
				{
					editMode ? null :
						<IconButton  onClick={viewOpenApplications}>
							<VisibilityIcon />
						</IconButton>
				}
				{
					!editMode ? null :
					<IconButton onClick={cancelEdit}>
						<CloseIcon/>
					</IconButton>
				}
				{
					!editMode ? null :
					<IconButton  onClick={saveChanges}>
						<SaveIcon />
					</IconButton>
				}
			</TableCell>
		</TableRow>
	);

};

export default JobListingRow;

