import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import unescape from 'lodash/unescape'
import FontIcon from 'material-ui/FontIcon'

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
    gmailTrashThread: PropTypes.func.isRequired,
    threadID: PropTypes.string.isRequired,
    hasAttachment: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
    messageCount: PropTypes.number.isRequired,
  };

  requestDeleteClick = e => {
    this.props.handleRequestDelete(e)
  }

  gmailTrashThread = e => {
    e.preventDefault();
    this.props.gmailTrashThread(this.props.threadID);
  }

  render(){
    const gmailId = this.props.gmailId;
    const from = (
      this.props.from.name ?
      this.props.from.name :
      this.props.from.email.substring(0, this.props.from.email.lastIndexOf("@")));
    const subject = this.props.subject;
    const snippet = this.props.snippet;
    const labelIDs = this.props.labelIDs;
    const isUnread = this.props.isUnread;

    const threadID = this.props.threadID;
    const hasAttachment = this.props.hasAttachment.toString();
    const date = this.props.date;
    const unreadFont = isUnread ? 'bold' : 'normal';
    const messageCount = this.props.messageCount;

    const removeCategory = tag => {
      if (tag.slice(0, 9) === 'CATEGORY_') {
        return tag.slice(9)
      }
      return tag
    }

    return (
      <div className="paper">
        <Paper>
          <a href={"https://mail.google.com/mail/u/0/#inbox/".concat(gmailId)}
            target="_blank" className="item-link">
            <div className="gmail-link">
              <div style={{whiteSpace: 'nowrap'}}>
                <img src="http://www.google.com/s2/favicons?domain=https://www.google.com/gmail/about"
                  style={{verticalAlign: 'bottom'}} />
                <span style={{fontWeight: unreadFont}} className="item-title highlight gmail-title">
                  { from }
                  <span style={{fontWeight: 'normal'}}>
                    { messageCount <= 1 ? null : ' (' + messageCount + ')' }
                  </span>
                </span>
              </div>
              <div style={{marginTop: '12px', overflow: 'hidden', lineHeight: '14px'}}>
                <span style={{fontWeight: unreadFont}}
                  className='highlight'>
                  {subject}
                </span>
                <span style={{color: "rgb(117, 117, 117)"}}>
                  {snippet.length > 0
                    ? " - " + unescape(snippet) + "..."
                    : ""}
                </span>
              </div>
            </div>
          </a>
          <div style={{margin: '0 12px 4px 30px'}}>
            {labelIDs
              ? (<div className="tags">
                  {labelIDs.map((tag, idx) => {
                    return (
                      <div key={idx} style={{cursor: "pointer"}} className="tag">
                        {removeCategory(tag)}
                         <span onClick={this.requestDeleteClick}>
                            <FontIcon className='material-icons'
                              style={{margin: '0 1px 0',
                              fontSize: '12px', top: '2px',
                              transition: 'inherit', color: 'inherit'}}>
                              clear
                            </FontIcon>
                        </span>
                      </div>)
                    })}
                  </div>)
              : <span style={{display: "none"}} />}
            </div>
            <div className='item-toolbar'>
              <FontIcon className='material-icons item-toolbar-button'
                onClick={this.gmailTrashThread}>
                delete
              </FontIcon>
            </div>
        </Paper>
      </div>
    )
  }
}
