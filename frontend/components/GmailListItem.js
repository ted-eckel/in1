import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import unescape from 'lodash/unescape'

// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class GmailListItem extends Component {
  static propTypes = {
    gmailId: PropTypes.string.isRequired,
    from: PropTypes.object.isRequired,
    subject: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    labelIDs: PropTypes.array.isRequired,
    isUnread: PropTypes.bool.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,

    threadID: PropTypes.string.isRequired,
    hasAttachment: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired
  };

  requestDeleteClick = e => {
    this.props.handleRequestDelete(e)
  }

  render(){
    const gmailId = this.props.gmailId;
    const from = this.props.from;
    const subject = this.props.subject;
    const snippet = this.props.snippet;
    const labelIDs = this.props.labelIDs;
    const isUnread = this.props.isUnread;

    const threadID = this.props.threadID;
    const hasAttachment = this.props.hasAttachment.toString();
    const date = this.props.date;
    const unreadFont = isUnread ? 'bold' : 'normal';

    return (
      <div style={{margin: "8px"}} className="paper">
        <Paper style={{
            width: "240px",
            padding: "9px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <a href={"https://mail.google.com/mail/u/0/#inbox/".concat(gmailId)}
            style={{textDecoration: "none"}} target="_blank"
            className="pocket-link">
            <div style={{fontFamily: "Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
                fontSize: "13px"}}>
              <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                <img src="http://www.google.com/s2/favicons?domain=https://www.google.com/gmail/about"
                  style={{verticalAlign: 'bottom'}} />
                <span style={{fontWeight: unreadFont, display: 'inline-block',
                  marginLeft: '7px'}}
                  className="pocket-title">
                  { from.name ? from.name : from.email }
                </span>
              </div>
                <span style={{fontWeight: unreadFont, display: 'inline-block',
                  marginTop: '9px'}}
                  className='pocket-title'>
                  {subject}
                </span>
              <div style={{color: "rgb(117, 117, 117)"}}>
                <br/>
                {snippet.length > 0
                  ? unescape(snippet) + "..."
                  : ""}
              </div>
            </div>
          </a>
          <div style={{margin: "9px"}}>
            {labelIDs
              ? (<div className="tags">
                  {labelIDs.map((tag, idx) => {
                    return (
                      <div key={idx} style={{cursor: "pointer"}} className="tag">
                        {tag}
                        <span style={{
                            fontWeight: "bold",
                            fontSize: "12px",
                            margin: "0 0 0 5px"}}
                          onClick={this.requestDeleteClick}>
                            x
                        </span>
                      </div>)
                    })}
                  </div>)
              : <span style={{display: "none"}} />}
            </div>
        </Paper>
      </div>
    )
  }
}
