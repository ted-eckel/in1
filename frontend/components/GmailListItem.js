import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import unescape from 'lodash/unescape'

// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class GmailListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render(){
    const item = this.props.item;

    return (
      <div
        style={{
          margin: "15px"
        }}
        className="paper"
      >
        <Paper
          style={{
            width: "275px",
            padding: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <a
            href={"https://mail.google.com/mail/u/0/#inbox/".concat(item.id)}
            style={{
              textDecoration: "none"
            }}
            target="_blank"
            className="pocket-link"
          >
            <div
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "13px"
              }}
            >
              <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                <img src="http://www.google.com/s2/favicons?domain=https://www.google.com/gmail/about" />
                {" "}
              </div>
              <span
                style={
                  item.labelIds.includes("UNREAD")
                  ? {fontWeight: "bold"}
                  : {fontWeight: "normal"}
                }
                className="pocket-title"
              >
                {
                  item.from.name ? item.from.name : item.from.email
                }
                <br/>
                <br/>
                {item.subject}
              </span>
              <div style={{color: "rgb(117, 117, 117)"}}>
                <br/>
                {
                  item.snippet.length > 0
                  ? unescape(item.snippet) + "..."
                  : ""
                }
              </div>
            </div>
          </a>
        </Paper>
      </div>
    )
  }
}
