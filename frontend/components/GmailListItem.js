import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import unescape from 'lodash/unescape'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { threadsByIDSelector } from '../selectors'
import { trash, archive } from '../actions/Gmail/ThreadActions'


// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

@connect(
  state => ({
    gmailThreadsByID: threadsByIDSelector(state)
  }),
  dispatch => bindActionCreators({
    gmailTrashThread: trash,
    gmailArchiveThread: archive,
  }, dispatch),
)

export default class GmailListItem extends Component {
  gmailTrashThread = () => {
    this.props.gmailTrashThread(this.props.item.threadID);
  }

  gmailArchiveThread = () => {
    this.props.gmailArchiveThread(this.props.item.threadID);
  }

  render(){
    const item = this.props.item;
    const gmailId = item.id;
    const from = (
      item.from.name ?
      item.from.name :
      item.from.email.substring(0, item.from.email.lastIndexOf("@")));
    const subject = item.subject;
    const snippet = item.snippet;
    const labelIDs = item.labelIDs;
    const isUnread = item.isUnread;

    const threadID = item.threadID;
    const unreadFont = isUnread ? 'bold' : 'normal';
    const messageCount = this.props.gmailThreadsByID[item.threadID].messageIDs.length;

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
              <div className='gmail-title'>
                <img src="http://www.google.com/s2/favicons?domain=https://www.google.com/gmail/about"
                  style={{verticalAlign: 'bottom'}} />
                <span style={{fontWeight: unreadFont}} className="item-title highlight">
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
                         {/* <span onClick={this.requestDeleteClick}>
                            <FontIcon className='material-icons'
                              style={{margin: '0 1px 0',
                              fontSize: '12px', top: '2px',
                              transition: 'inherit', color: 'inherit'}}>
                              clear
                            </FontIcon>
                        </span> */}
                      </div>)
                    })}
                  </div>)
              : <span style={{display: "none"}} />}
            </div>
            <div className='item-toolbar'>
              <FontIcon className='material-icons item-toolbar-button'
                onClick={this.gmailTrashThread} data-tip='trash'>
                delete
              </FontIcon>
              <FontIcon className='material-icons item-toolbar-button'
                onClick={this.gmailArchiveThread} data-tip='archive'>
                done
              </FontIcon>
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </div>
        </Paper>
      </div>
    )
  }
}
