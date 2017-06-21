import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../actions/SessionActions'
import { toggleDrawer } from '../actions/AppActions'

const listButton = () => (
  <IconButton tooltip="Grid View">
    <div className="group" style={{display: "inline-block", paddingTop: "10px", marginRight: "15px"}}>
      <img style={{width: "27px", opacity: ".54"}} src="gridview.svg" alt="Grid View" />
    </div>
  </IconButton>
)

@connect(
  state => ({
    currentUser: state.session.currentUser,
  }),
  dispatch => bindActionCreators({
    logout: logout,
    toggleDrawer: toggleDrawer,
  }, dispatch),
)

export default class Bar extends Component {
  render() {
    return (
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
            onClick={this.props.toggleDrawer}>
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
                onClick={this.props.logout}
              />
            </a>
          </div>
        }
      />
    )
  }
}
