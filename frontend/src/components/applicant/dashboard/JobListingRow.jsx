import React, {useEffect, useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import {Rating} from "@material-ui/lab";

function JobListingRow(props) {

	const {
		title,
		recruiter,
		salary,
		duration,
		deadline,
		seatsLeft,
		applied,
		applicationsLeft,
		updateJobs,
		profile,
		jobId,
		typeOfJob,
		rating
	} = props

	const durationString = duration === 0
		? "Indeterminate"
		: `${duration} Month` + (duration === 1 ? "" : "s")

	const jobType = typeOfJob === 0
		? "W.F.H."
		: typeOfJob === 1 ? "Part Time" : "Full Time"

	const [applyMode, setApplyMode] = useState(false);

	const [sop, setSop] = useState("");

	const [sopWordsUsed, setSopWordsUsed] = useState(0);

	function getCountOfWords(text) {
		text = text.replace(/(^\s*)|(\s*$)/gi, "");
		text = text.replace(/[ ]{2,}/gi, " ");
		text = text.replace(/\n /, "\n");
		const textWords = text.split(" ");
		return textWords.length;
	}

	useEffect(() => {  setSopWordsUsed(getCountOfWords(sop));  },[sop]);


	function handleSopInputChange(event) {
		const { value } = event.target;
		const newWordCount = getCountOfWords(value);
		if (newWordCount <= 250) {
			setSop(value);
		}
	};

	function handleApply(event) {
		event.preventDefault();
		axios.post("http://localhost:4000/job/apply", {
			sop: sop,
			profile: profile,
			jobId: jobId
		}).then(res => {
			setApplyMode(false);
			updateJobs();
		}).catch(err => {
			if(err.response)
				alert(err.response.data);
			else
			alert("Failure");
			updateJobs();
		});
	};

	return (
		<>
			{
				applyMode
					? <TableRow style={{textAlign: "center", padding: "auto"}}>
						<TableCell align={"center"} colSpan={6}>
							<TextField
								style={{ width: "80%" }}
								name="sop"
								label="Write a Statement of Purpose"
								multiline
								rows={6}
								defaultValue=""
								variant="outlined"
								value={sop}
								onChange={handleSopInputChange}
								helperText={
									(sop === "" ? 250 : 250 - sopWordsUsed).toString() + " words left"
								}
							/>
						</TableCell>
						<TableCell align={"center"} colSpan={1}>
							<Button type="submit" variant="contained"
							        style={{backgroundColor: "red"}}
							        fullWidth
							        onClick={() => {setSop(""); setApplyMode(false)}}>Cancel</Button>
						</TableCell>
						<TableCell align={"center"} colSpan={1}>
							<Button type="submit" variant="contained"
							        style={{backgroundColor: "yellow"}}
							        fullWidth
							        onClick={handleApply}>Submit</Button>
						</TableCell>
					</TableRow>
					: <TableRow>
						<TableCell component="th" scope="row" align="center">
							{title}
						</TableCell>
						<TableCell align={"center"}>{recruiter}</TableCell>
						<TableCell align={"center"}>{salary}</TableCell>
						<TableCell align={"center"}>{durationString}</TableCell>
						<TableCell align={"center"}>{jobType}</TableCell>
						<TableCell
							align={"center"}>{deadline.toLocaleDateString() + " @ " + deadline.toLocaleTimeString()}</TableCell>
						<TableCell align={"center"}>{seatsLeft}</TableCell>
						<TableCell align={"center"}><Rating precision={0.5} readOnly={true} value={rating} /></TableCell>
						<TableCell align={"center"}>
							{
								applied
									? <Button type="submit" fullWidth variant="contained" disabled
									          style={{backgroundColor: "green", color: "white"}}>Applied</Button>
									:
									applicationsLeft <= 0
										? <Button type="submit" fullWidth variant="contained" disabled
										          style={{backgroundColor: "red", color: "white"}}>Full</Button>
										: <Button type="submit" fullWidth variant="contained"
										          style={{backgroundColor: "yellow", color: "black"}}
										          onClick={() => {setApplyMode(true)}}>Apply</Button>}
						</TableCell>
					</TableRow>
			}
		</>
	);
}

export default JobListingRow;