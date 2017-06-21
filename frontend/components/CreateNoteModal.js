import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import BasicEditor from './BasicEditor'
import { htmlConvert, rawContentConvert, contentConvert } from '../util/NoteAPI'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Editor,
  EditorState,
  DefaultDraftBlockRenderMap,
  EditorBlock,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js'
import {
  createNoteModalOpenSelector,
  createdNoteSelector,
} from '../selectors'
import {
  createNote,
  updateNote,
  updateCreatedNoteTitle,
  updateCreatedNoteContent,
 } from '../actions/NoteActions'
 import { toggleCreateNoteModal } from '../actions/AppActions'

// @connect(
//   state => ({
//     createNoteModalOpen: createNoteModalOpenSelector(state),
//     createdNoteState: createdNoteSelector(state),
//   }),
//   dispatch => bindActionCreators({
//     createNote: createNote,
//     updateNote: updateNote,
//     updateCreatedNoteTitle: updateCreatedNoteTitle,
//     updateCreatedNoteContent: updateCreatedNoteContent,
//     toggleCreateNoteModal: toggleCreateNoteModal,
//   }, dispatch),
// )

const TODO_TYPE = 'todo';

class CreateNoteModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.createdNoteState.title,
      editorState: EditorState.createWithContent(convertFromRaw(this.props.createdNoteState.content)),
      color: this.props.createdNoteState.color
    }

    this.blockRenderMap = Map({
      [TODO_TYPE]: {
        element: 'div',
      }
    }).merge(DefaultDraftBlockRenderMap);

    this.onChange = (editorState) => {
      this.setState({ editorState })
    }

    this.getEditorState = () => this.state.editorState;

    this.blockRendererFn = getBlockRendererFn(this.getEditorState, this.onChange);

    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.focus = this.focus.bind(this)

    this.updateTitleState = this.updateTitleState.bind(this)
    this.createNote = this.createNote.bind(this)
    this.disabledButton = this.disabledButton.bind(this)
  }

  updateTitleState(event) {
    this.setState({title: event.target.value})
  }

  createNote() {
    let note = this.props.createdNoteState;
    let title = this.state.title;
    let currentContent = this.state.editorState.getCurrentContent();
    let noteID = note.id;

    const content = contentConvert(currentContent)

    if (this.props.createdNoteState.id === 'new') {
      this.props.createNote({title, content})
    } else {
      this.props.updateNote(noteID, {title, content})
    }
    this.props.toggleCreateNoteModal()
  }

  focus() {
    this.refs.editor.focus();
  }

  handleBeforeInput(str) {
    if (str !== ']') {
      return false;
    }
    const { editorState } = this.state;
    /* Get the selection */
    const selection = editorState.getSelection();

    /* Get the current block */
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();
    if (blockLength === 1 && currentBlock.getText() === '[') {
      this.onChange(resetBlockType(editorState, blockType !== TODO_TYPE ? TODO_TYPE : 'unstyled'));
      return true;
    }
    return false;
  }

  handleKeyCommand(command) {
      const { editorState } = this.state;
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
      return false;
  }

  disabledButton() {
    let title = this.props.createdNoteState.title;
    let content = this.props.createdNoteState.content;

    if (title === "" &&  content === htmlConvert("")) {
      return true
    }  else if (title === "" && content === htmlConvert("<p></p>")) {
      return true
    } else if (title === "" && content === htmlConvert('<div class="listitem"></div>')) {
      return true
    } else if (title === "" && content === htmlConvert('<div class="listitem checked"></div>')) {
      return true
    } else {
      return false
    }
  }

  blockStyleFn(block) {
    switch (block.getType()) {
      case TODO_TYPE:
        return 'block block-todo';
      default:
        return 'block';
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.createdNoteState !== nextProps.createdNoteState ) {
      this.setState({
        title: nextProps.createdNoteState.title,
        editorState: EditorState.createWithContent(convertFromRaw(nextProps.createdNoteState.content)),
        color: nextProps.createdNoteState.color
      })
    }
  }

  render() {
    const createNoteModalActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={() => this.props.toggleCreateNoteModal()}
        style={{color: '#202020'}}
      />,
      <FlatButton
        label="Save Note"
        onTouchTap={this.createNote}
        disabled={this.disabledButton()}
        style={{color: '#202020'}}
      />,
    ];

    // const editorState = this.props.createdNoteState.content;
    const editorState = EditorState.createWithContent(convertFromRaw(this.props.createdNoteState.content));

    const colorHexName = () => {
      if (this.state.color) {
        switch (this.state.color) {
          case 'DEFAULT':
            return 'dialogHack-white'
          case 'RED':
            return 'dialogHack-red'
          case 'ORANGE':
            return 'dialogHack-orange'
          case 'YELLOW':
            return 'dialogHack-yellow'
          case 'GREEN':
            return 'dialogHack-green'
          case 'TEAL':
            return 'dialogHack-teal'
          case 'BLUE':
            return 'dialogHack-blue'
          case 'GRAY':
            return 'dialogHack-gray'
          default:
            return 'dialogHack-white'
        }
      } else {
        return 'dialogHack-white'
      }
    }

    const colorHex = () => {
      if (this.state.color) {
        switch (this.state.color) {
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

    const title = (
      <input type="text" value={this.state.title} onChange={this.updateTitleState} placeholder="Title" />
    )

    return (
      <div>
        <Dialog
          actions={createNoteModalActions}
          modal={false}
          open={this.props.createNoteModalOpen}
          onRequestClose={this.props.toggleCreateNoteModal}
          autoScrollBodyContent
          contentClassName={colorHexName()}
          actionsContainerStyle={{borderTop: 'none'}}
          title={title}
          titleStyle={{
            fontFamily: "'Roboto Condensed',arial,sans-serif", border: 'none',
            fontSize: '17px', lineHeight: '23px', padding: '24px 24px 10px',
            backgroundColor: colorHex(), width: '93%'
          }}
          titleClassName="createNoteModalTitle">
          <div onClick={this.focus} style={{
            fontFamily: "'Roboto Slab','Times New Roman',serif",
            color: '#000', fontSize: '14px', lineHeight: '19px'
          }}>
            <Editor
              ref="editor"
              placeholder={"Write here. Type [ ] to add a todo ..."}
              editorState={this.state.editorState}
              onChange={this.onChange}
              blockStyleFn={this.blockStyleFn}
              blockRenderMap={this.blockRenderMap}
              blockRendererFn={this.blockRendererFn}
              handleBeforeInput={this.handleBeforeInput}
              handleKeyCommand={this.handleKeyCommand} />
          </div>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  createNoteModalOpen: createNoteModalOpenSelector(state),
  createdNoteState: createdNoteSelector(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createNote: createNote,
  updateNote: updateNote,
  updateCreatedNoteTitle: updateCreatedNoteTitle,
  updateCreatedNoteContent: updateCreatedNoteContent,
  toggleCreateNoteModal: toggleCreateNoteModal,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNoteModal);

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
const getDefaultBlockData = (blockType, initialData = {}) => {
  switch (blockType) {
    case TODO_TYPE: return { checked: false };
    default: return initialData;
  }
};

/*
Changes the block type of the current block.
*/
const resetBlockType = (editorState, newType = 'unstyled') => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  let newText = '';
  const text = block.getText();
  if (block.getLength() >= 2) {
    newText = text.substr(1);
  }
  const newBlock = block.merge({
    text: newText,
    type: newType,
    data: getDefaultBlockData(newType),
  });
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};

/*
A higher-order function.
*/
const getBlockRendererFn = (getEditorState, onChange) => (block) => {
  const type = block.getType();
  switch(type) {
    case TODO_TYPE:
      return {
        component: TodoBlock,
        props: {
          onChange,
          getEditorState,
        },
      };
    default:
      return null;
  }
};

class TodoBlock extends Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    updateData() {
        const { block, blockProps } = this.props;

        // This is the reason we needed a higher-order function for blockRendererFn
        const { onChange, getEditorState } = blockProps;
        const data = block.getData();
        const checked = (data.has('checked') && data.get('checked') === true);
        const newData = data.set('checked', !checked);
        console.log(checked, 'upd');
        onChange(updateDataOfBlock(getEditorState(), block, newData));
    }

    render() {
        const data = this.props.block.getData();
        const checked = data.get('checked') === true;
        return (
          <div className={checked ? 'block-todo-completed' : ''}>
            <input type="checkbox" checked={checked} onChange={this.updateData} />
            <EditorBlock {...this.props} />
          </div>
        );
    }
}

const updateDataOfBlock = (editorState, block, newData) => {
  const contentState = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: newData,
  });
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};
