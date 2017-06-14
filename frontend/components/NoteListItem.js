import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'
import { EditorState, convertFromRaw } from 'draft-js'
import BasicEditor from './BasicEditor'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import ActionLabel from 'material-ui/svg-icons/action/label'
import ActionDone from 'material-ui/svg-icons/action/done'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import difference from 'lodash/difference'


// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class NoteListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      tags: props.item.tags.map(tag => tag.name),
      open: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
  }

  trash = () => {
    this.props.trashNote(this.props.item.id)
  }

  archive = () => {
    this.props.archiveNote(this.props.item.id)
  }

  handleChange(tags) {
    this.setState({tags})
  }

  handleChangeInput(tag) {
    this.setState({tag})
  }

  render(){
    const item = this.props.item;
    const date = this.props.date;

    const colorHex = () => {
      if (this.props.createdNoteState.id === item.id) {
        return '#F2F2F2'
      } else {
        if (this.props.item.color) {
          switch (this.props.item.color) {
            case 'DEFAULT':
            return '#fff'
            case 'RED':
            return 'rgb(255, 109, 63)'
            case 'ORANGE':
            return 'rgb(255, 155, 0)'
            case 'YELLOW':
            return 'rgb(255, 218, 0)'
            case 'GREEN':
            return 'rgb(149, 214, 65)'
            case 'TEAL':
            return 'rgb(28, 232, 181)'
            case 'BLUE':
            return 'rgb(63, 195, 255)'
            case 'GRAY':
            return 'rgb(184, 196, 201)'
            default:
            return '#fff'
          }
        } else {
          return '#fff'
        }
      }
    }

    const toggleCreateNoteModal = () => {
      this.props.toggleCreateNoteModal(item)
    }

    const textColor = () => {
      if (this.props.createdNoteState.id === item.id) {
        return '#F2F2F2'
      } else {
        return '#000'
      }
    }

    const name = () => {
      if (this.props.createdNoteState.id === item.id) {
        return 'paper-selected'
      } else {
        return 'paper'
      }
    }

    const tags = this.props.currentUser.tags.map(tag => tag.name).sort();

    function defaultRenderTag (props) {
      let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
      return (
        <span key={key} {...other}>
          <span style={{
            whiteSpace: 'nowrap', maxWidth: '130px', overflow: 'hidden',
            textOverflow: 'ellipsis', display: 'inline-block'
          }}>
            {getTagDisplayValue(tag)}
          </span>
          {!disabled &&
            <a className={classNameRemove} onClick={(e) => onRemove(key)} />
          }
        </span>
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

    const handleCloseMenu = (open, reason) => {
      if (open) {
        this.setState({open: true})
      } else {
        this.setState({open: false})
        let stateTags = this.state.tags;
        let propTags = this.props.item.tags.map(tag => tag.name);
        let theDifference = difference(stateTags, propTags)
        if (theDifference.length) {
          console.log(theDifference)
          console.log('state tags not the same as prop tags')
        } else {
          console.log(theDifference)
          console.log("they're the same")
        }
      }
      console.log(open)
      console.log(reason)
    }

    const defaultRenderLayout = (tagComponents, inputComponent) => {
      const archive = this.archive;
      const deleteFunc = this.trash;
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
              width={200}>
              {inputComponent}
            </IconMenu>
            <IconButton onTouchTap={archive}>
              <ActionDone data-tip='archive' className='item-toolbar-button' />
            </IconButton>
            <IconButton onTouchTap={deleteFunc}>
              <ActionDelete data-tip='trash' className='item-toolbar-button' />
            </IconButton>
          </div>
        </div>
      )
    }

    const editorState = EditorState.createWithContent(convertFromRaw(item.content));

    return (
      <div style={{margin: "8px"}} className={name()}>
        <Paper style={{width: "240px", padding: "12px 0", backgroundColor: colorHex()}}>
          <div style={{cursor: 'default', color: textColor()}} onClick={toggleCreateNoteModal}>
            {item.title
              ? (
                <div style={{display: "inline-block",
                  fontFamily: "'Roboto Condensed',arial,sans-serif",
                  fontSize: '17px', fontWeight: 'bold', lineHeight: '23px',
                  minHeight: '27px', padding: '2px 15px 0'}}>
                  {item.title}
                </div>
              )
              : null}
            <div style={{fontFamily: "'Roboto Slab','Times New Roman',serif",
              padding: '0 15px 15px', minHeight: '48px', maxHeight: '369px',
              fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '19px'}}>
              <BasicEditor editorState={editorState} readOnly={true} />
            </div>
          </div>
          <TagsInput
            onlyUnique
            renderInput={autocompleteRenderInput}
            value={this.state.tags}
            onChange={this.handleChange}
            renderLayout={defaultRenderLayout}
            renderTag={defaultRenderTag}
          />
          {/* <div style={{margin: '9px 12px 4px 30px'}}>
            {item.tags.length
              ? (<div className="tags">
                  {item.tags.map((tag, idx) => {
                    return (
                      <div key={idx} style={{cursor: "pointer"}} className="tag">
                        {tag.name}
                      </div>)
                    })}
                  </div>)
              : null}
          </div> */}
          {/* <div className='item-toolbar' style={{padding: '0 15px'}}>
            <IconMenu
              iconButtonElement={
                <IconButton animated={false}>
                  <ActionLabel
                    data-tip={item.tags.length ? 'change tags' : 'add tags'}
                    className='item-toolbar-button' />
                </IconButton>
              }
              width={200}>
              <TagsInput
                onlyUnique
                renderInput={autocompleteRenderInput}
                value={this.state.tags}
                onChange={this.handleChange}
              />
            </IconMenu>
            <IconButton animated={false} onTouchTap={this.archive}>
              <ActionDone data-tip='archive' className='item-toolbar-button' />
            </IconButton>
            <IconButton animated={false} onTouchTap={this.delete}>
              <ActionDelete data-tip='trash' className='item-toolbar-button' />
            </IconButton>
          </div> */}
          <ReactTooltip place="bottom" type="dark" effect="solid" />
        </Paper>
      </div>
    )
  }
}
