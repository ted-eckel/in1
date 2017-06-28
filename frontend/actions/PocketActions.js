import ActionType from '../actions/ActionType'
import * as APIUtil from '../util/PocketAPI'
import merge from 'lodash/merge'

export const receiveItems = (items, search) => (
  {
    type: ActionType.Pocket.Items.FETCH_SUCCESS,
    search,
    status: items.status,
    items: Object.keys(items.list).map(key => {
      let d = new Date(0);
      d.setUTCSeconds(items.list[key].time_added);
      return {
        service: 'pocket',
        date: d,
        item: items.list[key],
        id: key
      }
    })
  }
)

export const receiveError = error => ({
  type: ActionType.Pocket.Items.FETCH_FAILURE,
  error
})

export const fetchItems = (search = '', requestedResultCount = 20) => (dispatch, getState) => {
  const itemList = getState().pocket.itemListBySearch[search];

  let offset = 0;
  if (itemList) {
    offset = itemList.nextOffset;
    let status = itemList.status;
    if (status === 2) {
      return;
    }
  }

  dispatch({
    type: ActionType.Pocket.Items.FETCH_REQUEST,
    search,
    requestedResultCount
  })

  // let params = getState().pocket.params;
  return APIUtil.pocketRetrieve({
    count: requestedResultCount,
    detailType: 'complete',
    search,
    offset
  })
  .then(items => {
    dispatch(receiveItems(items, search))
    // if (items.status !== 2) {
      // return dispatch(receiveItems(items, search.search));
    // } else {
    //   return dispatch({type: ActionType.Pocket.Items.END_OF_LIST})
    // }
  }, error => {
    return dispatch(receiveError(error))
  });
}

export const archiveItem = itemID => (dispatch, getState) => {
  dispatch({type: ActionType.Pocket.Items.ARCHIVE_REQUEST, itemID})

  let date = Math.floor(Date.now() / 1000).toString();

  return APIUtil.pocketModify({
    modify_action: 'archive',
    item_id: itemID,
    time: date
  }).then(res => {
    dispatch({type: ActionType.Pocket.Items.ARCHIVE_SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Pocket.Items.ARCHIVE_FAILURE, err})
  })
}

export const unarchiveItem = itemID => (dispatch, getState) => {
  dispatch({type: ActionType.Pocket.Items.UNARCHIVE_REQUEST, itemID})

  let date = Math.floor(Date.now() / 1000).toString();
  return APIUtil.pocketModify({
    action: 'readd',
    item_id: itemID,
    time: date
  }).then(res => {
    dispatch({type: ActionType.Pocket.Items.UNARCHIVE_SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Pocket.Items.UNARCHIVE_FAILURE, err})
  })
}

export const deleteItem = itemID => (dispatch, getState) => {
  dispatch({type: ActionType.Pocket.Items.DELETE_REQUEST, itemID})

  let date = Math.floor(Date.now() / 1000).toString();

  return APIUtil.pocketModify(
    {
      modify_action: 'delete',
      item_id: itemID,
      time: date
    }
  ).then(res => {
    dispatch({type: ActionType.Pocket.Items.DELETE_SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Pocket.Items.DELETE_FAILURE, err})
  })
}

export const setTags = (itemID, tagString) => (dispatch, getState) => {
  dispatch({type: ActionType.Pocket.Items.SET_TAGS_REQUEST, tagString, itemID})

  let date = Math.floor(Date.now() / 1000).toString();

  return APIUtil.pocketTags(
    {
      modify_action: 'tags_replace',
      item_id: itemID,
      tags: tagString,
      time: date
    }
  ).then(res => {
    dispatch({type: ActionType.Pocket.Items.SET_TAGS_SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Pocket.Items.SET_TAGS_FAILURE, err})
  })
}

export const removeTag = (itemID, tagString) => (dispatch, getState) => {
  dispatch({type: ActionType.Pocket.Items.REMOVE_TAG_REQUEST, tagString, itemID})

  let date = Math.floor(Date.now() / 1000).toString();

  return APIUtil.pocketTags(
    {
      modify_action: 'tags_remove',
      item_id: itemID,
      tags: tagString,
      time: date
    }
  ).then(res => {
    dispatch({type: ActionType.Pocket.Items.REMOVE_TAG_SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Pocket.Items.REMOVE_TAG_FAILURE, err})
  })
}
