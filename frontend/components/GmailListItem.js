import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import {default as lodashUnescape} from 'lodash/unescape'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import ActionLabel from 'material-ui/svg-icons/action/label'
import ActionDone from 'material-ui/svg-icons/action/done'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import difference from 'lodash/difference'
import differenceBy from 'lodash/differenceBy'
import pickBy from 'lodash/pickBy'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { threadsByIDSelector, labelsSelector, allTagsSelector } from '../selectors'
import { trash, archive, removeLabel, addLabels } from '../actions/Gmail/ThreadActions'



// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

@connect(
  state => ({
    gmailThreadsByID: threadsByIDSelector(state),
    gmailLabels: labelsSelector(state),
    allTags: allTagsSelector(state),
  }),
  dispatch => bindActionCreators({
    gmailTrashThread: trash,
    gmailArchiveThread: archive,
    gmailRemoveLabel: removeLabel,
    gmailAddLabels: addLabels,
  }, dispatch),
)

export default class GmailListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: props.item.labelIDs.map(labelID => props.gmailLabels[labelID].name),
      open: false,
    }

    this.removeCategory = this.removeCategory.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.changeTags = this.changeTags.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        tags: nextProps.item.labelIDs.map(labelID => this.props.gmailLabels[labelID].name),
      })
    }
  }

  handleChange(tags) {
    this.setState({tags})
  }

  changeTags(newTags) {
    let { gmailLabels } = this.props;
    console.log('changeTags()')
    let gmailLabelsByName = {};
    Object.keys(gmailLabels).forEach(key => gmailLabelsByName[gmailLabels[key].name] = gmailLabels[key])
    let labelIDs = [];
    let labelNames = [];
    newTags.forEach(tag => {
      if (gmailLabelsByName[tag]) {
        labelIDs.push(gmailLabelsByName[tag].id)
      } else {
        labelNames.push(tag)
      }
    })
    this.props.gmailAddLabels(this.props.item.threadID, labelIDs, labelNames)
  }

  deleteTag(key) {
    let { gmailLabels } = this.props;
    console.log(`deleteTag(${key})`)
    let labelToDelete = this.state.tags[key]
    let gmailLabelsByName = {};
    Object.keys(gmailLabels).forEach(key => gmailLabelsByName[gmailLabels[key].name] = gmailLabels[key])
    let labelID =  gmailLabelsByName[labelToDelete].id
    this.props.gmailRemoveLabel(this.props.item.threadID, labelID)
  }

  gmailTrashThread = () => {
    this.props.gmailTrashThread(this.props.item.threadID);
  }

  gmailArchiveThread = () => {
    this.props.gmailArchiveThread(this.props.item.threadID);
  }

  removeCategory(tag) {
    if (tag.slice(0, 9) === 'CATEGORY_') {
      return tag.slice(9)
    }
    return tag
  }

  render(){
    const item = this.props.item;
    const gmailId = item.id;
    const from = (
      item.from.length > 1 ?
      item.from.reverse().map(title => title.split(' ')[0]).join(', ') :
      item.from[0]);
    const subject = item.subject;
    const snippet = item.snippet;
    const labelIDs = item.labelIDs;
    const isUnread = item.isUnread;

    const threadID = item.threadID;
    const unreadFont = isUnread ? 'bold' : 'normal';
    const messageCount = this.props.gmailThreadsByID[item.threadID].messageIDs.length;



    const tags = Object.keys(this.props.allTags).map(key => this.props.allTags[key].name).sort();

    const defaultRenderTag = props => {
      let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props;
      return (
        <span key={key} {...other}>
          <span style={{
            whiteSpace: 'nowrap', maxWidth: '130px', overflow: 'hidden',
            textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'top'
          }}>
            {getTagDisplayValue(tag)}
          </span>
          {!disabled &&
            <a
              className={classNameRemove}
              onClick={
                (e) => {
                  onRemove(key);
                  this.deleteTag(key)
                }
              }
            />
          }
        </span>
      )
    }

    const handleCloseMenu = (open, reason) => {
      if (open) {
        this.setState({open: true})
      } else {
        this.setState({open: false})
        let stateTags = this.state.tags;
        let propTags = labelIDs.map(labelID => this.props.gmailLabels[labelID].name);
        let theDifference = difference(stateTags, propTags);
        console.log(theDifference);
        if (theDifference.length) {
          this.changeTags(theDifference);
        }
      }
    }

    const defaultRenderLayout = (tagComponents, inputComponent) => {
      return (
        <div>
          {tagComponents}
          <div className='item-toolbar' style={{padding: '0 15px'}}>
            <IconMenu
              onRequestChange={(open, reason) => handleCloseMenu(open, reason)}
              open={this.state.open}
              iconButtonElement={
                <IconButton>
                  <ActionLabel
                    data-tip={this.state.tags.length ? 'change tags' : 'add tags'}
                    className='item-toolbar-button' />
                </IconButton>
              }
              autoWidth={false}
              menuStyle={{width: '200px'}}>
              {inputComponent}
            </IconMenu>
            <IconButton onTouchTap={this.gmailArchiveThread}>
              <ActionDone data-tip='archive' className='item-toolbar-button' />
            </IconButton>
            <IconButton onTouchTap={this.gmailTrashThread}>
              <ActionDelete data-tip='trash' className='item-toolbar-button' />
            </IconButton>
          </div>
        </div>
      )
    }

    function autocompleteRenderInput({addTag, ...props}) {

      const handleOnChange = (e, {newValue, method}) => {
        if (method === 'enter') {
          e.preventDefault()
        } else {
          props.onChange(e)
        }
      }

      const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
      const inputLength = inputValue.length

      let suggestions = tags.filter((tag) => {
        return tag.toLowerCase().slice(0, inputLength) === inputValue
      })

      return (
        <Autosuggest
          ref={props.ref}
          suggestions={suggestions}
          alwaysRenderSuggestions
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => <span>{suggestion}</span>}
          inputProps={{...props, onChange: handleOnChange}}
          onSuggestionSelected={(e, {suggestion}) => {
            addTag(suggestion)
          }}
          onSuggestionsClearRequested={() => {}}
          onSuggestionsFetchRequested={() => {}}
        />
      )
    }

    return (
      <div className="paper">
        <Paper>
          <a href={"https://mail.google.com/mail/u/0/#inbox/".concat(gmailId)}
            target="_blank" className="item-link">
            <div className="gmail-link">
              <div>
                <span className='gmail-title'>
                  <img src="icons/gmail.png"
                  style={{verticalAlign: 'bottom'}} />
                  <span style={{fontWeight: unreadFont}} className="item-title highlight">
                    { from }
                  </span>
                </span>
                <span style={{fontWeight: 'normal', display: 'inline-block', paddingLeft: '2px'}}>
                  { messageCount <= 1 ? null : ' (' + messageCount + ')' }
                </span>
              </div>
              <div style={{marginTop: '12px', overflow: 'hidden', lineHeight: '14px'}}>
                <span style={{fontWeight: unreadFont}}
                  className='highlight'>
                  {subject}
                </span>
                <span style={{color: "rgb(117, 117, 117)"}}>
                  {snippet.length > 0
                    ? " - " + lodashUnescape(snippet) + "..."
                    : ""}
                </span>
              </div>
            </div>
          </a>
          <TagsInput
            onlyUnique
            renderInput={autocompleteRenderInput}
            value={this.state.tags}
            onChange={this.handleChange}
            renderLayout={defaultRenderLayout}
            renderTag={defaultRenderTag}
          />
        </Paper>
      </div>
    )
  }
}
