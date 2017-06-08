import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import ReactTooltip from 'react-tooltip'
import { EditorState, convertFromRaw } from 'draft-js'
import BasicEditor from './BasicEditor'


// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

export default class NoteListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
  };

  trash = () => {
    this.props.trashNote(this.props.item.id)
  }

  archive = () => {
    this.props.archiveNote(this.props.item.id)
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

    // const editorState = EditorState.createWithContent(item.content);
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
          <div style={{margin: '9px 12px 4px 30px'}}>
            {item.tags
              ? (<div className="tags">
                  {item.tags.map((tag, idx) => {
                    return (
                      <div key={idx} style={{cursor: "pointer"}} className="tag">
                        {tag.name}
                      </div>)
                    })}
                  </div>)
              : <span style={{display: "none"}} />}
          </div>
          <div className='item-toolbar' style={{padding: '0 15px'}}>
            <FontIcon className='material-icons item-toolbar-button' data-tip='trash' onClick={this.trash}>
              delete
            </FontIcon>
            <FontIcon className='material-icons item-toolbar-button' data-tip='archive' onClick={this.archive}>
              done
            </FontIcon>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
          </div>
        </Paper>
      </div>
    )
  }
}
