import React from 'react';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/svg-icons/navigation/menu';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import SvgIcon from 'material-ui/SvgIcon'
import {blueGrey900} from 'material-ui/styles/colors'
import ReactTooltip from 'react-tooltip'

const iconStyles = {
  marginRight: "24px"
}

const listButton = () => (
  <IconButton tooltip="Grid View">
    <div className="group" style={{display: "inline-block", paddingTop: "10px", marginRight: "15px"}}>
      <img style={{width: "27px", opacity: ".54"}} src="gridview.svg" alt="Grid View" />
    </div>
  </IconButton>
)

const sessionLinks = () => (
  <nav className="login-signup">
    <Link to="/login" activeClassName="current">Login</Link>
    &nbsp;or&nbsp;
    <Link to="/signup" activeClassName="current">Sign up!</Link>
  </nav>
);

const logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

logged.muiName = 'IconMenu'

const /*personal*/Greeting = ({/*currentUser,*/ logout, logoutRefresh, toggleDrawer}) => (
  <AppBar
    title="in1box"
    style={{
      backgroundColor: "#546E7A",
      zIndex: 2
    }}
    iconElementLeft={
      <IconButton
        onClick={toggleDrawer}>
        <Menu />
      </IconButton>
    }
    iconElementRight={
      <div>
        <img
          className="tooltip--bottom appbar-button"
          style={{
            width: "27px",
            display: "inline-block",
            paddingTop: "10px",
            marginRight: "15px",
            cursor: "pointer"
          }}
          src="gridview.svg"
          alt="Grid View"
          data-tip="Grid View" />
        <ReactTooltip place="bottom" type="dark" effect="solid" />
        <a href="/">
          <FlatButton
            style={{bottom: "10px", color: "#fff"}}
            label="Logout"
            onClick={logout}
          />
        </a>
      </div>
    }
  />
);

{/* <hgroup className="header-group">
  <h2 className="header-name">Hi, {currentUser.username}!</h2>
  <button className="header-button" onClick={logout}>Log Out</button>
</hgroup> */}

// const Greeting = ({ /*currentUser,*/ logout, toggleDrawer }) => (
//   currentUser ? personalGreeting(/*currentUser,*/ logout, toggleDrawer) : sessionLinks()
// );

export default Greeting;
