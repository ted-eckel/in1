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
    const viewedFont = file.viewedByMe ? 'normal' : 'bold';
    const filePicture = file.thumbnailLink ? file.thumbnailLink : file.iconLink;

    return (
      <div style={{margin: "8px"}} className="paper">
        <Paper style={{
            width: "240px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <a href={file.webViewLink} style={{textDecoration: "none"}}
            target="_blank" className="item-link">
            <div style={{fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "13px", padding: '12px 15px'}}>
              <div className="drive-title">
                <img src={file.iconLink} style={{verticalAlign: 'bottom'}} />
                <span style={{fontWeight: viewedFont}}
                  className="item-title highlight">
                  { file.name }
                </span>
              </div>
            </div>
            <div style={{maxHeight: '170px', overflow: 'hidden'}}>
              <img style={{width: "240px", fontSize: "12px", color: "darkgray"}}
                src={file.thumbnailLink} />
            </div>
          </a>
        </Paper>
      </div>
    )
  }
}
