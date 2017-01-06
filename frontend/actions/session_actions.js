export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SIGNUP = "SIGNUP";
export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_ERRORS = "RECEIVE_ERRORS";

export const signup = user => ({
  type: SIGNUP,
  user
});

export const login = user => ({
  type: LOGIN,
  user
});

export const logout = () => ({
  type: LOGOUT
});

export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});





// export const receiveErrors = errors => ({
//   type: RECEIVE_ERRORS,
//   errors
// });

export const requestItems = () => ({
  type: REQUEST_ITEMS
})

export const receiveItems = items => ({
  type: RECEIVE_ITEMS,
  items
})

export const fetchPocket = () => dispatch => {
  dispatch(requestItems());
  return $.ajax({
    method: 'GET',
    url: 'api/pocket_retrieve',
    data: {
      count: 10,
      detailType: "complete"
    }
  })
  .then(items => dispatch(receiveItems(items)));
}

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
