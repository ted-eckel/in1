import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'

// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class PocketListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
    date: PropTypes.string.isRequired,
    archiveItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
  };

  requestDeleteClick = e => {
    this.props.handleRequestDelete(e)
  }

  archiveItem = () => {
    this.props.archiveItem(this.props.item.item_id)
  }

  deleteItem = () => {
    this.props.deleteItem(this.props.item.item_id)
  }

  urlParser = url => {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
  }

  render(){
    const item = this.props.item;
    const date = this.props.date;

    const imgExc = item.image ?
      (<div title={item.excerpt ? item.excerpt : ""} style={{
        backgroundImage: `url(${item.image.src})`,
        fontSize: '12px', color: 'darkgray', height: '150px',
        backgroundPosition: 'center center', backgroundSize: 'cover'}}>
      </div>) :
      (item.excerpt ?
        (<div style={{fontSize: "12px", margin: "5px 9px 0px 9px", color: "darkgray"}}>
          {item.excerpt}
        </div>) :
        (<span />)
      );

    return (
      <div style={{margin: "8px"}} className="paper">
        <Paper style={{width: "240px", padding: "12px 0"}}>
          <a href={"https://getpocket.com/a/read/".concat(item.item_id)}
             target="_blank" className="pocket-link item-link">
            <div style={{margin: "0 15px"}}>
              <div style={{display: "inline-block"}}>
                <img src="http://www.google.com/s2/favicons?domain=https://getpocket.com/"
                  style={{verticalAlign: 'text-top'}} />
                <span className="item-title pocket-title highlight">
                  {item.resolved_title ? item.resolved_title : item.given_title}
                </span>
              </div>
            </div>
            <div style={{overflow: "hidden",
              textOverflow: "ellipsis", marginTop: '5px'}}>
              {imgExc}
            </div>
          </a>
          <div style={{margin: "4px 15px 0"}}>
            <a href={item.given_url} style={{textDecoration: "none"}}
              target="_blank">
              <div style={{display: "inline-block"}}>
                <img src={"http://www.google.com/s2/favicons?domain=".concat(item.given_url)}
                  style={{verticalAlign: 'text-bottom'}} />
                <span className="item-url" style={{marginLeft: '5px'}}>
                  {this.urlParser(item.given_url)}
                </span>
              </div>
            </a>
          </div>
          <div style={{margin: '9px 12px 4px 30px'}}>
            {item.tags
              ? (<div className="tags">
                  {Object.keys(item.tags).map((tag, idx) => {
                    return (
                      <div key={idx} style={{cursor: "pointer"}} className="tag">
                        {tag}
                      </div>)
                    })}
                  </div>)
              : <span style={{display: "none"}} />}
          </div>
          <div className='item-toolbar'>
            <FontIcon className='material-icons item-toolbar-button'
              onClick={this.deleteItem} data-tip='delete'>
              delete
            </FontIcon>
            <FontIcon className='material-icons item-toolbar-button'
              onClick={this.archiveItem} data-tip='archive'>
              done
            </FontIcon>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
          </div>
        </Paper>
      </div>
    )
  }
}
