import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ViewListIcon from '@material-ui/icons/ViewList';
import CreateIcon from '@material-ui/icons/Create';
import WorkIcon from '@material-ui/icons/Work';
import CreateNewJob from "./CreateNewJob";
import MyOpenJobs from "./MyOpenJobs";
import OpenApplications from "./OpenApplications";
import MyEmployees from "./MyEmployees";
import AllMyJobs from "./AllMyJobs";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		textAlign: "center",
	},
}));

export default function RecruiterDashboard(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const {profile, setProfile} = props;

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const [jobIdForOpenApplications, setJobIdForOpenApplications] = useState("");

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default" >
				<Tabs
					value={value}
					style={{padding: "auto"}}
					onChange={handleChange}
					variant="scrollable"
					scrollButtons="on"
					indicatorColor="primary"
					textColor="primary"
					aria-label="scrollable force tabs example"
				>
					<Tab label="My Active Jobs" icon={<ViewListIcon />} {...a11yProps(0)} />
					<Tab label="Create new Job" icon={<CreateIcon />} {...a11yProps(1)} />
					<Tab label="Employees" icon={<WorkIcon />} {...a11yProps(2)} />
					<Tab label="All My Jobs" icon={<ViewListIcon />} {...a11yProps(3)} />
					{jobIdForOpenApplications === "" ? null : <Tab label="Open Applications" icon={<WorkIcon />} {...a11yProps(4)} />}
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<MyOpenJobs
					profile={profile}
					setProfile={setProfile}
					setValue={setValue} {...props}
					setJobIdForOpenApplications={setJobIdForOpenApplications}
				/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<CreateNewJob
					profile={profile}
					setValue={setValue}
					setJobIdForOpenApplications={setJobIdForOpenApplications}
				/>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<MyEmployees
					profile={profile}
					setJobIdForOpenApplications={setJobIdForOpenApplications}
				/>
			</TabPanel>
			<TabPanel index={3} value={value}>
				<AllMyJobs
					profile={profile}
					setProfile={setProfile}
					setValue={setValue} {...props}
					setJobIdForOpenApplications={setJobIdForOpenApplications}
				/>
			</TabPanel>
			<TabPanel value={value} index={4}>
				<OpenApplications profile={profile} jobId={jobIdForOpenApplications} />
			</TabPanel>
		</div>
	);
}