/** @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import GreetingContainer from './greeting/GreetingContainer'
import * as PocketActions from '../actions/PocketActions'
import { toggleDrawer } from '../actions/AppActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
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

  //YOU HAVE TO MAKE SURE TO ACTUALLY DISPATCH THE ACTIONS!!!

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
          <Items
            onRequestMoreItems={this._onRequestMoreItems}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
