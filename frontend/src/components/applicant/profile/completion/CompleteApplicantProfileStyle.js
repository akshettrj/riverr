import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	table: {
		minWidth: 650,
	},
	tableContainer: {
		maxWidth: "70%",
		margin: "2rem auto",
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

export default useStyles;
