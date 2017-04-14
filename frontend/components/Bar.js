import React from 'react'
import { Link } from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import SvgIcon from 'material-ui/SvgIcon'
import {blueGrey900} from 'material-ui/styles/colors'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'
import { logout } from '../actions/SessionActions'
import { toggleDrawer } from '../actions/AppActions'

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

const Bar = ({logout, logoutRefresh, toggleDrawer}) => (
  <AppBar
    title="in1box"
    style={{
      backgroundColor: "#546E7A",
      zIndex: 2,
      position: "fixed",
      top: 0
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
          className="tooltip--bottom toolbar-button"
          style={{
            width: "27px",
            display: "inline-block",
            paddingTop: "10px",
            marginRight: "15px"
          }}
          src="gridview.svg"
          alt="Grid View" />
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

const mapStateToProps = ({ session }) => ({
  currentUser: session.currentUser
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  toggleDrawer: () => dispatch(toggleDrawer()),
  logoutRefresh: () => {
    dispatch(logout());
    window.setTimeout(window.location.reload, 2000);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar);
