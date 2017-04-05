import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import unescape from 'lodash/unescape'

export default class DriveListItem extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    handleRequestDelete: PropTypes.func.isRequired
  };

  requestDeleteClick = e => {
    this.props.handleRequestDelete(e)
  }

  render(){
    const file = this.props.file;
    const date = this.props.date;

    return (
      <div style={{margin: "8px"}} className="paper">
        <Paper style={{
            width: "240px",
            padding: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <a href={file.webViewLink} style={{textDecoration: "none"}}
            target="_blank" className="pocket-link">
            <div style={{margin: "10px auto", display: "table"}}>
              <img style={{maxWidth: "240px", fontSize: "12px", color: "darkgray"}}
                src={file.thumbnailLink} />
            </div>
            <div style={{fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "13px"}}>
              <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                <img src={file.iconLink} />
                {" "}
              </div>
              <span style={
                  file.viewedByMe
                  ? {fontWeight: "normal"}
                  : {fontWeight: "bold"}}
                className="pocket-title">
                { file.name }
              </span>
            </div>
          </a>
        </Paper>
      </div>
    )
  }
}
