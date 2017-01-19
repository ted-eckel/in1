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

const personalGreeting = (currentUser, logout, toggleDrawer) => (
  <AppBar
    title="in1"
    style={{
      zIndex: 2
    }}
    iconElementLeft={
      <IconButton
        onClick={toggleDrawer}>
        <Menu />
      </IconButton>
    }
    iconElementRight={
      <FlatButton
        label="Logout"
        onClick={logout}
      />
    }
    style={{position: "fixed", top: "0"}}/>
);

{/* <hgroup className="header-group">
  <h2 className="header-name">Hi, {currentUser.username}!</h2>
  <button className="header-button" onClick={logout}>Log Out</button>
</hgroup> */}

const Greeting = ({ currentUser, logout, toggleDrawer }) => (
  currentUser ? personalGreeting(currentUser, logout, toggleDrawer) : sessionLinks()
);

export default Greeting;
