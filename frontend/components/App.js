/** @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import RSVP from 'rsvp'

import configureStore from '../store'

import GreetingContainer from './greeting/GreetingContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Items from './Items'

import * as PocketActions from '../actions/PocketActions'
import { toggleDrawer } from '../actions/AppActions'
import * as GmailAppActions from '../actions/Gmail/AppActions'
import * as LabelActions from '../actions/Gmail/LabelActions'
import * as ThreadActions from '../actions/Gmail/ThreadActions'
import * as FileActions from '../actions/Drive/FileActions'

import { push } from 'react-router-redux'
import API from '../util/API'

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
  servicesLoadedSelector,
  threadsSelector,
  driveIsLoadingSelector,
  driveIsAuthorizedSelector,

  getAllItemsSelector,
  getAllItemsSelectorTwo,
  allAccountsCountSelector,
  allAccountsSelector,
  endOfListSelector,
  gmailIsLoadingSelector,
} from '../selectors'

const PAGE_SIZE = 20;

@connect(
  state => ({
    items: itemsSelector(state),
    isFetching: isFetchingSelector(state),
    error: errorSelector(state),
    drawerOpen: drawerOpenSelector(state),
    isAuthorized: isAuthorizedSelector(state),
    isAuthorizing: isAuthorizingSelector(state),
    isLoading: isLoadingSelector(state),
    labels: labelsSelector(state),
    searchQuery: searchQuerySelector(state),
    threads: threadsSelector(state),
    lastMessageInEachThread: lastMessageInEachThreadSelector(state),
    hasMoreThreads: hasMoreThreadsSelector(state),
    loadedThreadCount: loadedThreadCountSelector(state),
    servicesLoaded: servicesLoadedSelector(state),
    driveIsLoading: driveIsLoadingSelector(state),
    driveIsAuthorized: driveIsAuthorizedSelector(state),
    // nextMessage: nextMessageSelector(state),
    // prevMessage: prevMessageSelector(state),
    getAllItems: getAllItemsSelector(state),
    getAllItemsTwo: getAllItemsSelectorTwo(state),
    allAccountsCount: allAccountsCountSelector(state),
    allAccounts: allAccountsSelector(state),
    endOfList: endOfListSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchItems: PocketActions.fetchItems,
    loadLabels: LabelActions.loadAll,
    loadThreadList: ThreadActions.loadList,
    loadFileList: FileActions.loadList,
    refresh: ThreadActions.refresh,
    markAsRead: ThreadActions.markAsRead,
    search: GmailAppActions.search,
    toggleDrawer: toggleDrawer,
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
    console.log('componentWillMount _tryLoad')
    this._tryLoad(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate _tryLoad')
    this._tryLoad(nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps _tryLoad')
    this._tryLoad(nextProps, this.state);
  }

  _tryLoad(props, state) {
    this.props.loadThreadList(props.searchQuery, state.maxResultCount);
    this.props.loadFileList();
    // if (!this.props.driveIsLoading && this.props.driveIsAuthorized){
    // }
    // if (!this.props.isFetching && !this.props.isLoading){
    //   this.props.fetchItems();
    // }
    // RSVP.all([
    //   this.props.loadThreadList(props.searchQuery, state.maxResultCount),
    //   this.props.loadFileList(),
    //   this.props.fetchItems()
    // ])
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  handleLoadMore = () => {
    const { fetchItems, isFetching, isLoading, loadThreadList, onRequestMoreItems, servicesLoaded, endOfList, allAccounts, driveIsLoading, gmailIsLoading } = this.props;
    const pocketGet = () => {
      if (!isFetching && (/*Object.keys(servicesLoaded)*/allAccounts.includes('pocket') && servicesLoaded.pocket === true) && !endOfList){
        fetchItems()
      }
    }
    const gmailGet = () => {
      if (/*!isLoading*/ !gmailIsLoading && (/*Object.keys(servicesLoaded)*/allAccounts.includes('gmail')) && servicesLoaded.gmail === true) {
        onRequestMoreItems()
      }
    }
    const driveGet = () => {
      if (/*!isLoading*/ !driveIsLoading && (/*Object.keys(servicesLoaded)*/allAccounts.includes('drive')) && servicesLoaded.drive === true) {
        console.log('driveLoadList');
        driveLoadList()
      }
    }

    pocketGet()
    gmailGet()
    driveGet()
    // RSVP.all([
    // ])
    // if (/*Object.keys(servicesLoaded*/allAccounts.length === 3){
    // }
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

  _onLoginClick = () => {
    API.login();
    this.handleDrawerClose();
  };

  _onDriveClick = () => {
    // 'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false
    // gapi.client.drive.files.list({q: "'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false", fields: "nextPageToken, files"}).execute(response => console.log(response))
    API.driveLogin();
    this.handleDrawerClose();
  };

  _onRefresh = () => {
    this.props.refresh();
  }

  _onLogoClick = () => {
    window.location.reload();
  }

  //YOU HAVE TO MAKE SURE TO ACTUALLY DISPATCH THE ACTIONS!!!

  handleDrawerClose = () => {
    this.props.toggleDrawer();
  }

  render() {

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div>
          <div>
            <Drawer
              open={this.props.drawerOpen}
              docked={true}
              onRequestChange={this.handleDrawerClose}
              containerStyle={{zIndex: 1, backgroundColor: "transparent", boxShadow: "none"}}
              overlayStyle={{display: "none"}}
              style={{}}
              >
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                {
                  Object.keys(this.props.servicesLoaded).includes('pocket')
                  ? null
                  : (
                      <MenuItem onClick={this.handleDrawerClose}>
                        <a href="auth/pocket">
                          Connect to Pocket
                        </a>
                      </MenuItem>
                    )
                }
                {
                  Object.keys(this.props.servicesLoaded).includes('gmail')
                  ? null
                  : (<MenuItem onClick={this._onLoginClick}>Connect to Gmail</MenuItem>)
                }
                {
                  Object.keys(this.props.servicesLoaded).includes('drive')
                  ? null
                  : (<MenuItem onClick={this._onDriveClick}>Connect to Google Drive</MenuItem>)
                }
                {
                  Object.keys(this.props.servicesLoaded).length === 3
                  ? (
                    <div style={{margin: '0 auto', display: 'table'}}>
                      All possible services connected!
                    </div>
                  )
                  : null
                }
            </Drawer>
          </div>
          <GreetingContainer />
          <Items
            fetchItems={this.props.fetchItems}
            allAccounts={this.props.allAccounts}
            endOfList={this.props.endOfList}
            allAccountsCount={this.props.allAccountsCount}
            servicesLoaded={this.props.servicesLoaded}
            getAllItems={this.props.getAllItems}
            handleRequestDelete={this.handleRequestDelete}
            handleLoadMore={this.handleLoadMore}
            drawerOpen={this.props.drawerOpen}
            onRequestMoreItems={this._onRequestMoreItems}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
