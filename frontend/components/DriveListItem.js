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

    return (
      <div style={{margin: "8px"}} className="paper">
        <Paper style={{
            width: "240px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <a href={file.webViewLink} style={{textDecoration: "none"}}
            target="_blank" className="pocket-link">
            <div>
              <img style={{width: "240px", fontSize: "12px", color: "darkgray"}}
                src={file.thumbnailLink} />
            </div>
            <div style={{fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "13px", margin: '9px'}}>
              <div style={{whiteSpace: 'nowrap'}}>
                <img src={file.iconLink} style={{verticalAlign: 'bottom'}} />
                <span style={{fontWeight: viewedFont, overflow: 'hidden',
                        display: 'inline-block', marginLeft: '7px',
                        textOverflow: 'ellipsis', maxWidth: '195px'}}
                  className="pocket-title">
                  { file.name }
                </span>
              </div>
            </div>
          </a>
        </Paper>
      </div>
    )
  }
}
