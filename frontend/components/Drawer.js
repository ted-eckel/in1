import React, { Component, PropTypes } from 'react'
import MuiDrawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

export default class Drawer extends Component {
  static propTypes = {
    style: PropTypes.object,
    drawerOpen: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    toggleKeepModal: PropTypes.func.isRequired,
    allAuth: PropTypes.object.isRequired,
    gmailLogin: PropTypes.func.isRequired,
    driveLogin: PropTypes.func.isRequired,
  }

  handleDrawerClose = () => {
    this.props.toggleDrawer();
  }

  onGmailAuthClick = () => {
    // API.login();
    this.handleDrawerClose();
    this.props.gmailLogin();
  };

  onDriveAuthClick = () => {
    // 'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false
    // gapi.client.drive.files.list({q: "'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false", fields: "nextPageToken, files"}).execute(response => console.log(response))
    // API.driveLogin();
    this.handleDrawerClose();
    this.props.driveLogin();
  };

  toggleKeepModal = () => {
    this.props.toggleKeepModal();
  }

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
            this.props.allAuth.gmail &&
            this.props.allAuth.drive &&
            this.props.allAuth.pocket
            ? (
              <div>
                <span style={{border: '10px', boxSizing: 'border-box',
                   display: 'block', cursor: 'default',  margin: '0px', padding: '0px',
                   outline: 'none', lineHeight: '48px', position: 'relative',
                   minHeight: '48px', whiteSpace: 'nowrap'}}>
                  <div>
                    <span style={{height: '100%', width: '100%', position: 'absolute',
                       top: '0px', left: '0px', overflow: 'hidden', pointerEvents: 'none'}}></span>
                    <div style={{marginLeft: '0px', padding: '0px 16px', position: 'relative'}}>
                      All possible services connected!
                    </div>
                  </div>
                </span>
              </div>
            )
            : null
          }
          <MenuItem onClick={this.toggleKeepModal}>Upload Google Keep Notes</MenuItem>
      </MuiDrawer>
    )
  }
}

/* <div style={{margin: '0 auto', display: 'table'}}>
  All possible services connected!
</div> */
