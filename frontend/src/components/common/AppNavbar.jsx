import PersonIcon from "@material-ui/icons/Person";
import "./AppNavbar.css";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function AppNavbar(props) {
	return (
		<div className="AppNavbar">

			<Link to={{ pathname: "/" }}>
				<IconButton>
					<HomeIcon fontSize="large" className="AppNavbarItem" />
				</IconButton>
			</Link>

			{ props.profile.loggedIn ? <Link to={props.profile.loggedIn ? "/profile" : "/login"}>
				<IconButton>
					<PersonIcon fontSize="large" className="AppNavbarItem" />
				</IconButton>
			</Link> : null }

			{ props.profile.loggedIn ? <Link to={props.profile.loggedIn ? "/dashboard" : "/login"}>
				<IconButton>
					<DashboardIcon fontSize="large" className="AppNavbarItem" />
				</IconButton>
			</Link> : null }

			{ props.profile.loggedIn ?
				<IconButton onClick={() => {
					props.setProfile({
						fName: "",
						lName: "",
						email: "",
						loggedIn: false,
						isRecruiter: false,
						dateJoined: "",
						hash: "",
						profileComplete: false
					});
				}}>
					<ExitToAppIcon fontSize="large" className="AppNavbarItem" />
				</IconButton>
				: null }

		</div>
	);
}

export default AppNavbar;
