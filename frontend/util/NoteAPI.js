import { convertFromHTML, convertToHTML } from 'draft-convert'
import { convertToRaw , convertFromRaw} from 'draft-js'

export const fetchNotes = (data) => {
  return $.ajax({
    method: 'GET',
    url: 'api/notes',
    data
  });
};

export const createNotes = (data) => {
  return $.ajax({
    method: 'POST',
    url: 'api/notes',
    data
  });
};

export const deleteNotes = (data) => {
  return $.ajax({
    method: 'DELETE',
    url: 'api/notes',
    data
  });
};

export const modifyNote = (noteID, actions) => {
  return $.ajax({
    method: 'PATCH',
    url: 'api/notes/' + noteID,
    data: {
      note: actions
    }
  });
};

export const rawContentConvert = rawContent => {
  const content = convertFromRaw(rawContent)
  return convertToHTML({
    blockToHTML: (block) => {
      if (block.type === 'todo') {
        if (block.data.checked === true) {
          return {start: `<div class="listitem checked">`, end: `</div>`}
        } else {
          return {start: `<div class="listitem">`, end: `</div>`}
        }
      }
    }
  })(content)
}

export const htmlConvert = html => {
   const content = convertFromHTML({
    htmlToBlock: (nodeName, node) => {
      if (node.className === "listitem checked") {
        return {
          type: 'todo',
          data: {checked: true},
        }
      }
      if (node.className === "listitem") {
        return {
          type: 'todo',
          data: {},
        }
      }
    }
  })(html)

  return convertToRaw(content)
}

export const contentConvert = content => {
  return convertToHTML({
    blockToHTML: (block) => {
      if (block.type === 'todo') {
        if (block.data.checked === true) {
          return {start: `<div class="listitem checked">`, end: `</div>`}
        } else {
          return {start: `<div class="listitem">`, end: `</div>`}
        }
      }
    }
  })(content)
}

// export const TODO_TYPE = 'todo';
//
// /*
// Returns default block-level metadata for various block type. Empty object otherwise.
// */
// export const getDefaultBlockData = (blockType, initialData = {}) => {
//   switch (blockType) {
//     case TODO_TYPE: return { checked: false };
//     default: return initialData;
//   }
// };
//
// /*
// Changes the block type of the current block.
// */
// export const resetBlockType = (editorState, newType = 'unstyled') => {
//   const contentState = editorState.getCurrentContent();
//   const selectionState = editorState.getSelection();
//   const key = selectionState.getStartKey();
//   const blockMap = contentState.getBlockMap();
//   const block = blockMap.get(key);
//   let newText = '';
//   const text = block.getText();
//   if (block.getLength() >= 2) {
//     newText = text.substr(1);
//   }
//   const newBlock = block.merge({
//     text: newText,
//     type: newType,
//     data: getDefaultBlockData(newType),
//   });
//   const newContentState = contentState.merge({
//     blockMap: blockMap.set(key, newBlock),
//     selectionAfter: selectionState.merge({
//       anchorOffset: 0,
//       focusOffset: 0,
//     }),
//   });
//   return EditorState.push(editorState, newContentState, 'change-block-type');
// };
//
// /*
// A higher-order function.
// */
// export const getBlockRendererFn = (getEditorState, onChange) => (block) => {
//   const type = block.getType();
//   switch(type) {
//     case TODO_TYPE:
//       return {
//         component: TodoBlock,
//         props: {
//           onChange,
//           getEditorState,
//         },
//       };
//     default:
//       return null;
//   }
// };

// export const blockStyleFn = block => {
//   switch (block.getType()) {
//     case TODO_TYPE:
//       return 'block block-todo';
//     default:
//       return 'block';
//   }
// }
