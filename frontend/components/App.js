/** @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import GreetingContainer from './greeting/GreetingContainer'
import * as PocketActions from '../actions/PocketActions'
import { toggleDrawer } from '../actions/AppActions'
import { checkAuth, load, loadThreadList, loadThreads, initClient } from '../actions/GoogleActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import FlatButton from 'material-ui/FlatButton'
// import CircularProgress from 'material-ui/CircularProgress'
// import Paper from 'material-ui/Paper'
// import InfiniteScroll from 'react-infinite-scroller'
import AppBar from 'material-ui/AppBar'
// import Masonry from 'react-masonry-component'
import Avatar from 'material-ui/Avatar'
import SvgIconClear from 'material-ui/svg-icons/content/clear'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import config from '../config'
import configureStore from '../store'
import Items from './Items'
import * as GmailAppActions from '../actions/Gmail/AppActions'
import * as LabelActions from '../actions/Gmail/LabelActions'
import * as ThreadActions from '../actions/Gmail/ThreadActions'
import { push } from 'react-router-redux';
import {
  itemsSelector,
  isFetchingSelector,
  errorSelector,
  drawerOpenSelector,
  hasMoreThreadsSelector,
  isAuthorizedSelector,
  isAuthorizingSelector,
  isLoadingSelector,
  labelsSelector,
  lastMessageInEachThreadSelector,
  loadedThreadCountSelector,
  // nextMessageSelector,
  // prevMessageSelector,
  searchQuerySelector,
  threadsSelector,
} from '../selectors'

const PAGE_SIZE = 20;

@connect(
  state => ({
    items: itemsSelector(state),
    // isFetching: isFetchingSelector(state),
    error: errorSelector(state),
    drawerOpen: drawerOpenSelector(state),
    isAuthorized: isAuthorizedSelector(state),
    isAuthorizing: isAuthorizingSelector(state),
    // isLoading: isLoadingSelector(state),
    labels: labelsSelector(state),
    searchQuery: searchQuerySelector(state),
    threads: threadsSelector(state),
    lastMessageInEachThread: lastMessageInEachThreadSelector(state),
    hasMoreThreads: hasMoreThreadsSelector(state),
    loadedThreadCount: loadedThreadCountSelector(state),
    // nextMessage: nextMessageSelector(state),
    // prevMessage: prevMessageSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchItems: PocketActions.fetchItems,
    loadLabels: LabelActions.loadAll,
    loadThreadList: ThreadActions.loadList,
    refresh: ThreadActions.refresh,
    markAsRead: ThreadActions.markAsRead,
    search: GmailAppActions.search,
    push
  }, dispatch),
)

class App extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  }

  state = {
    maxResultCount: PAGE_SIZE,
    queryProgress: null,
  };

  componentWillMount() {
    this._tryLoad(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    this._tryLoad(nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    this._tryLoad(nextProps, this.state);
  }

  _tryLoad(props, state) {
    this.props.loadThreadList(props.searchQuery, state.maxResultCount);
  }

  _onRequestMoreItems = () => {
    this.setState({maxResultCount: this.state.maxResultCount + PAGE_SIZE});
  };

  _onMessageSelected = (message: ?Object) => {
    if (message && message.isUnread) {
      this.props.markAsRead(message.threadID);
    }

    if (!message) {
      this.props.push('/')
    } else {
      this.props.push(`/thread/${message.threadID}/message/${message.id}/`);
    }
  }

  _onQueryChange = (query: string) => {
    this.setState({
      queryProgress: query,
      maxResultCount: PAGE_SIZE,
    });
  };

  _onQuerySubmit = (query: string) => {
    this.props.search(query);
    this.setState({
      queryProgress: query,
      maxResultCount: PAGE_SIZE,
    });
  }

  _onRefresh = () => {
    this.props.refresh();
  }

  _onLogoClick = () => {
    window.location.reload();
  }

  // componentDidMount() {
  //   const { dispatch } = this.props
  //   dispatch(fetchItems())
  //   console.log("componentDidMount()")
  // }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   window.gapi.load('client', () => {
  //     dispatch({type: ActionType.Gmail.Authorization.REQUEST})
  //     checkAuth(true, this.handleAuth.bind(this));
  //   });
  // }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   window.gapi.load('client')
  //   .then(() => dispatch({type: ActionType.Gmail.Authorization.REQUEST}))
  //   .then(() => dispatch(checkAuth(true, this.handleauth.bind(this))))
  // }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   window.gapi.client.init({
  //     'apiKey': config.apiKey,
  //     'discoveryDocs': ['https://gmail.googleapis.com/$discovery/rest?version=v1'],
  //     'clientId': config.clientId,
  //     'scope': config.scope
  //   }).then(() => gapi.client.gmail.users)
  // }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   window.gapi.load('client:auth2', () => dispatch(initClient());
  // }

  //YOU HAVE TO MAKE SURE TO ACTUALLY DISPATCH THE ACTIONS!!!

  handleAuth = authResult => {
    const { dispatch } = this.props;
    if (authResult && !authResult.error) {
      dispatch({type: ActionType.Gmail.Authorization.SUCCESS})
      dispatch({type: ActionType.Gmail.Label.LOAD_ALL_REQUEST})
      load(this.handleLabels.bind(this), this.handleLabelError.bind(this))
      dispatch({type: ActionType.Gmail.Thread.LOAD_LIST_REQUEST})
      loadThreadList(this.handleThreadList.bind(this), this.handleThreadListError.bind(this), this.handleThreads.bind(this))
    } else {
      dispatch({type: ActionType.Gmail.Authorization.FAILURE})
    }
  }

  handleDrawerClose = () => {
    const { dispatch } = this.props;
    dispatch(toggleDrawer());
  }

  render() {

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div>
          <Drawer
            open={this.props.drawerOpen}
            docked={false}
            onRequestChange={this.handleDrawerClose}
            containerStyle={{zIndex: 1}}
            overlayStyle={{display: "none"}}
          >
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <MenuItem onClick={this.handleDrawerClose}>Connect to Pocket</MenuItem>
            <MenuItem onClick={this.handleDrawerClose}>Connect to Gmail</MenuItem>
          </Drawer>
          <GreetingContainer />
          <Items  />
          {/* <div style={{maxWidth: "1525px", margin: "80px auto"}}>
            <InfiniteScroll
              ref='masonryContainer'
              loadMore={this.handleLoadMore}
              loader={elementInfiniteLoad}
              hasMore
              threshold={200}
              >
              <Masonry>
                <Items />
              </Masonry>
            </InfiniteScroll>
          </div> */}
          {/* <Masonry>
            {childElements}
          </Masonry> */}
          {/* <div>
            { isEmpty ? elementInfiniteLoad : <PocketContainer /> }
          </div> */}
          {/* <FlatButton className="lolol" label="Fetch more combinedElements" onClick={this.handleClick} /> */}
        </div>
      </MuiThemeProvider>
    )
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     items: state.pocket.items,
//     googleThreadList: state.google.threadList,
//     googleThreadMessages: state.google.threadMessages,
//     isFetching: state.pocket.isFetching,
//     error: state.pocket.error,
//     drawerOpen: state.app.drawerOpen
//   }
// }

// const mapStateToProps = state => {
//   const {
//     items,
//     isFetching,
//     error
//   } = state.pocket
//
//   return {
//     items,
//     isFetching,
//     error
//   }
// }

// export default connect(mapStateToProps)(App)
export default App
