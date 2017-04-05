import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'

// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class PocketListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
    date: PropTypes.string.isRequired
  };

  requestDeleteClick = e => {
    this.props.handleRequestDelete(e)
  }

  urlParser = url => {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
  }

  render(){
    const item = this.props.item;
    const date = this.props.date;

    return (
      <div
        style={{
          margin: "8px"
        }}
        className="paper"
        >
          <Paper
            style={{
              width: "240px",
              // height: "225px",
              padding: "10px 0"
            }}
            >
              <a
                href={"https://getpocket.com/a/read/".concat(item.item_id)}
                style={{
                  textDecoration: "none"
                }}
                target="_blank"
                className="pocket-link"
                >
                  <div style={{margin: "0 10px 5px"}}>
                    <div style={{display: "inline-block"}}>
                      <img src="http://www.google.com/s2/favicons?domain=https://getpocket.com/"
                        style={{verticalAlign: 'text-top'}} />
                      <span style={{display: 'inline-block', marginLeft: '7px',}}
                        className="pocket-title">
                        {
                          item.resolved_title
                          ? item.resolved_title
                          : item.given_title
                        }
                      </span>
                    </div>
                  </div>
                  <div style={{maxHeight: "270px", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {
                      (item.image)
                      ? (
                        <div
                          style={{
                            margin: "10px auto",
                            display: "table"
                          }}
                          >
                            <img
                              style={{
                                maxWidth: "240px",
                                fontSize: "12px",
                                color: "darkgray"
                              }}
                              src={item.image.src}
                              alt={(item.excerpt ? item.excerpt : "")}
                            />
                          </div>
                        )
                        : (
                          item.excerpt
                          ? (
                            <div
                              style={{
                                fontSize: "12px",
                                margin: "5px 9px 0px 9px",
                                color: "darkgray"
                              }}
                              >
                                {item.excerpt}
                              </div>
                            )
                            : <span />
                          )
                        }
                      </div>
                    </a>
                    <div style={{margin: "9px 9px 0px 9px"}}>
                      <a
                        href={item.given_url}
                        style={{
                          textDecoration: "none"
                        }}
                        target="_blank"
                        >
                          <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                            <img src={"http://www.google.com/s2/favicons?domain=".concat(item.given_url)} />
                            {" "}
                            <span className="item-url">{this.urlParser(item.given_url)}</span>
                          </div>
                        </a>
                      </div>
                      <div style={{margin: "0 10px 0 20px"}}>
                        {
                          item.tags
                          ? (
                            <div className="tags">
                              {Object.keys(item.tags).map((tag, idx) => {
                                return (
                                  <div key={idx} style={{cursor: "pointer"}} className="tag">
                                    {tag}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        margin: "0 0 0 5px"
                                      }}
                                      onClick={this.requestDeleteClick}
                                      >
                                        x
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                            : <span style={{display: "none"}} />
                          }
                        </div>

                        {/* <div style={{margin: "10px"}}>
                          {date}
                        </div> */}
                      </Paper>
                    </div>
    )
  }
}
