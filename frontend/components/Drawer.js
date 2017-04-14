import React, { Component, PropTypes } from 'react'
import MuiDrawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import API from '../util/API'

export default class Drawer extends Component {
  static propTypes = {
    style: PropTypes.object,
    drawerOpen: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    allAuth: PropTypes.object.isRequired,
  }

  handleDrawerClose = () => {
    this.props.toggleDrawer();
  }

  onGmailAuthClick = () => {
    API.login();
    this.handleDrawerClose();
  };

  onDriveAuthClick = () => {
    // 'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false
    // gapi.client.drive.files.list({q: "'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false", fields: "nextPageToken, files"}).execute(response => console.log(response))
    API.driveLogin();
    this.handleDrawerClose();
  };

  render() {
    return(
      <MuiDrawer
        open={this.props.drawerOpen}
        docked={true}
        onRequestChange={this.handleDrawerClose}
        containerStyle={{zIndex: 1, backgroundColor: "transparent", boxShadow: "none"}}
        overlayStyle={{display: "none"}}
        style={{}}
        >
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          {
            this.props.allAuth.pocket !== false
            ? null
            : (
                <MenuItem onClick={this.handleDrawerClose}>
                  <a href="auth/pocket">
                    Connect to Pocket
                  </a>
                </MenuItem>
              )
          }
          {
            this.props.allAuth.gmail !== false
            ? null
            : (<MenuItem onClick={this.onGmailAuthClick}>Connect to Gmail</MenuItem>)
          }
          {
            this.props.allAuth.drive !== false
            ? null
            : (<MenuItem onClick={this.onDriveAuthClick}>Connect to Google Drive</MenuItem>)
          }
          {
            this.props.allAuth.all === true
            ? (
              <div style={{margin: '0 auto', display: 'table'}}>
                All possible services connected!
              </div>
            )
            : null
          }
      </MuiDrawer>
    )
  }
}
