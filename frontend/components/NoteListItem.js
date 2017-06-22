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
import ImagePalette from 'material-ui/svg-icons/image/palette'
import difference from 'lodash/difference'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trashNote, archiveNote, updateNote } from '../actions/NoteActions'
import { createdNoteSelector, currentUserSelector } from '../selectors'
import { toggleCreateNoteModal } from '../actions/AppActions'

@connect(
  state => ({
    createdNoteState: createdNoteSelector(state),
    currentUser: currentUserSelector(state)
  }),
  dispatch => bindActionCreators({
    trashNote: trashNote,
    archiveNote: archiveNote,
    updateNote: updateNote,
    toggleCreateNoteModal: toggleCreateNoteModal,
  }, dispatch),
)


// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class NoteListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      tags: props.item.note.tags.map(tag => tag.name),
      color: props.item.note.color,
      open: false,
      colorMenuOpen: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.updateNote = this.updateNote.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.changeTags = this.changeTags.bind(this)
    this.handleColorChange =this.handleColorChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        tags: nextProps.item.note.tags.map(tag => tag.name),
        color: nextProps.item.note.color,
      })
    }
  }

  trash = () => {
    this.props.trashNote(this.props.item.note.id)
  }

  archive = () => {
    this.props.archiveNote(this.props.item.note.id)
  }

  handleChange(tags) {
    this.setState({tags})
  }

  handleChangeInput(tag) {
    this.setState({tag})
  }

  handleColorChange(color) {
    this.setState({color});
    let noteObject = {color};
    // noteObject.color = color;
    this.props.updateNote(this.props.item.note.id, noteObject)
  }

  updateNote() {
    let note = this.props.item.note;
    let noteObject = {};
    noteObject.color = this.state.color;

    if (this.state.tags[0]) {
      let tagString = `${this.props.currentUser.id}`;
      for (let i=0; i<this.state.tags.length; i++){
        tagString += `-------314159265358979323846${this.state.tags[i]}`
      }
      noteObject.all_tags = tagString;
    }

    const noteID = note.id;
    this.props.updateNote(noteID, noteObject)
  }

  changeTags() {
    let noteObject = {};

    let tagString = `${this.props.currentUser.id}`;
    for (let i=0; i<this.state.tags.length; i++){
      tagString += `-------314159265358979323846${this.state.tags[i]}`
    }
    noteObject.all_tags = tagString;
    this.props.updateNote(this.props.item.note.id, noteObject);
  }

  deleteTag(key) {
    let noteObject = {};

    let newTags = this.state.tags;
    newTags.splice(key, 1);

    let tagString = `${this.props.currentUser.id}`;
    for (let i=0; i<newTags.length; i++){
      tagString += `-------314159265358979323846${newTags[i]}`
    }
    noteObject.all_tags = tagString;
    this.props.updateNote(this.props.item.note.id, noteObject);
  }

  render(){
    const item = this.props.item.note;

    const colorHex = (color) => {
      if (color) {
        switch (color) {
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

    const colorArray = ['DEFAULT', 'RED', 'ORANGE', 'YELLOW', 'GRAY', 'BLUE', 'TEAL', 'GREEN'];

    const colorCheckMark = color => {
      if (this.state.color) {
        if (this.state.color === color) {
          return (
            <ActionDone/>
          )
        } else if (this.state.color === 'DEFAULT' && color === 'WHITE') {
          return (
            <ActionDone />
          )
        }
      } else if (color === 'WHITE') {
        return (
          <ActionDone/>
        )
      } else {
        return null;
      }
    }

    const colorDataTip = (color) => {
      if (color) {
        if (color === 'DEFAULT') {
          return 'white'
        } else {
          return color.toLowerCase()
        }
      } else {
        return null
      }
    }

    const colorButtons = colorArray.map(color => {
      return (
        <Paper
          circle
          key={`${item.id}-${color}-ITEM`}
          data-tip={colorDataTip(color)}
          onClick={() => this.handleColorChange(color)}
          style={{
            backgroundColor: colorHex(color),
            height: '25px',
            width: '25px',
            display: 'inline-block',
            margin: '3px',
            cursor: 'pointer',
            verticalAlign: 'top'
          }}>
          {colorCheckMark(color)}
        </Paper>
      )
    })

    const toggleCreateNoteModal = () => {
      this.props.toggleCreateNoteModal(item)
    }

    const name = () => {
      if (this.props.createdNoteState.id === item.id) {
        return 'paper-selected'
      } else {
        return 'paper'
      }
    }

    const visibilityFunc = () => {
      if (this.props.createdNoteState.id === item.id) {
        return 'hidden'
      } else {
        return 'visible'
      }
    }

    const tags = this.props.currentUser.tags.map(tag => tag.name).sort();

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
        let propTags = item.tags ? item.tags.map(tag => tag.name) : [];
        let theDifference = difference(stateTags, propTags)
        if (theDifference.length) {
          this.changeTags();
        }
      }
    }

    const handleCloseColorMenu = (open, reason) => {
      if (open) {
        this.setState({colorMenuOpen: true})
      } else {
        this.setState({colorMenuOpen: false})
      }
    }

    const defaultRenderLayout = (tagComponents, inputComponent) => {
      const archive = this.archive;
      const deleteFunc = this.trash;
      return (
        <div>
          {tagComponents}
          <div className='item-toolbar' style={{padding: '0 15px'}}>
            <IconMenu
              onRequestChange={(open, reason) => handleCloseColorMenu(open, reason)}
              open={this.state.colorMenuOpen}
              iconButtonElement={
                <IconButton>
                  <ImagePalette data-tip="change color" className='item-toolbar-button' />
                </IconButton>
              }
              autoWidth={false}
              menuStyle={{width: '174px', height: '115px'}}>
              <div style={{width: '124px', margin: '0 25px'}}>
                {colorButtons}
              </div>
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </IconMenu>
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

    const colorState = this.state.color;

    return (
      <div style={{margin: "8px", visibility: visibilityFunc()}} className={name()}>
        <Paper style={{width: "240px", padding: "12px 0", backgroundColor: colorHex(colorState)}}>
          <div style={{cursor: 'default'}} onClick={toggleCreateNoteModal}>
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
          <ReactTooltip place="bottom" type="dark" effect="solid" />
        </Paper>
      </div>
    )
  }
}
