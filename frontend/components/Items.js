/** @flow */

import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import DriveListItem from './DriveListItem'
import NoteListItem from './NoteListItem'
import React, { Component, PropTypes } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import CircularProgress from 'material-ui/CircularProgress'
import { rawContentConvert } from '../util/NoteAPI'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchItems as fetchPocketItems } from '../actions/PocketActions'
import { loadList as driveFetchFiles } from '../actions/Drive/FileActions'
import { loadList as gmailLoadThreadList } from '../actions/Gmail/ThreadActions'
import { fetchNotes } from '../actions/NoteActions'
import { fetchEverything } from '../actions/AppActions'
import {
  drawerOpenSelector,
  allAuthSelector,
  getAllItemsSelector,
  endOfListSelector,
  isFetchingSelector,
  searchQuerySelector,
  hasMoreThreadsSelector,
  driveHasMoreFilesSelector,
  pocketHasMoreItemsSelector,
} from '../selectors'

@connect(
  state => ({
    drawerOpen: drawerOpenSelector(state),
    allAuth: allAuthSelector(state),
    items: getAllItemsSelector(state),
    endOfList: endOfListSelector(state),
    isFetching: isFetchingSelector(state),
    searchQuery: searchQuerySelector(state),
    gmailHasMoreThreads: hasMoreThreadsSelector(state),
    driveHasMoreFiles: driveHasMoreFilesSelector(state),
    pocketHasMoreItems: pocketHasMoreItemsSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchPocketItems: fetchPocketItems,
    driveFetchFiles: driveFetchFiles,
    gmailLoadThreadList: gmailLoadThreadList,
    fetchEverything: fetchEverything,
    fetchNotes: fetchNotes,
  }, dispatch),
)

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object,
    drawerOpen: PropTypes.bool.isRequired,
    allAuth: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      masonryWidth: null
    }

    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  updateDimensions() {
    if (window.innerWidth >= 1547) {
      this.setState({masonryWidth: '1280px'})
    } else if (window.innerWidth < 1547 && window.innerWidth >= 1291 ) {
      this.setState({masonryWidth: '1024px'})
    } else if (window.innerWidth < 1291 && window.innerWidth >= 1035) {
      this.setState({masonryWidth: '768px'})
    } else if (window.innerWidth < 1035 && window.innerWidth >= 779) {
      this.setState({masonryWidth: '512px'})
    } else if (window.innerWidth < 779) {
      this.setState({masonryWidth: '256px'})
    }
  }

  handleLoadMore() {
    const {
      fetchPocketItems, endOfList, allAuth, isFetching, driveFetchFiles,
      searchQuery, gmailLoadThreadList, fetchEverything, gmailHasMoreThreads,
      driveHasMoreFiles, pocketHasMoreItems, fetchNotes
    } = this.props;

    let promiseArray = []

    if (allAuth.all && !isFetching.any) {
      if (allAuth.gmail && gmailHasMoreThreads) {
        promiseArray.push(gmailLoadThreadList(searchQuery));
      }

      if (allAuth.pocket && pocketHasMoreItems) {
        promiseArray.push(fetchPocketItems());
      }

      if (allAuth.drive && driveHasMoreFiles) {
        promiseArray.push(driveFetchFiles());
      }

      promiseArray.push(fetchNotes());

      fetchEverything(promiseArray)
    }
    // if (!isFetching.any) {
    //   fetchNotes()
    // }
  }

  render() {
    const items = this.props.items;
    const drawerOpen = this.props.drawerOpen;
    const endOfList = this.props.endOfList;

    const drawerOpenStyles = {
      marginLeft: "256px",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const drawerClosedStyles = {
      marginLeft: "0",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const styles = {
      root: {width: this.state.masonryWidth, margin: "75px auto"}
    };

    const elementInfiniteLoad = (
      endOfList
      ? (
          <div style={{
            display: 'table',
            margin: '125px auto',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '400',
            fontSize: '18px',
            color: '#40555f'
          }}>
            End of your inbox!
          </div>
        )
      : (<CircularProgress size={80} thickness={6} style={{display: "block", margin: "300px auto 0"}} />)
    );

    if (
      this.props.allAuth.pocket === false &&
      this.props.allAuth.gmail === false &&
      this.props.allAuth.drive === false
    ) {
      return(
        <div style={{
          display: 'table',
          margin: '125px auto',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '400',
          fontSize: '20px',
          color: '#40555f'
        }}>
          Click a link in the sidebar to authorize a service
        </div>
      )
    } else if (!this.props.allAuth.all) {
      return (
        <div style={{marginTop: "80px"}}>
          {elementInfiniteLoad}
        </div>
      )
    } else {
      const childElements = items.map((item, idx) => {
        if (item && item.service === "pocket") {
          return (
            <div style={{display: 'inline-block'}} key={'pocket' + items[idx].id}>
              <PocketListItem item={items[idx]} />
            </div>
          )
        } else if (item && item.service === "gmail") {
          return (
            <div style={{display: 'inline-block'}} key={'gmail' + items[idx].id}>
              <GmailListItem item={items[idx]} />
            </div>
          )
        } else if (item && item.service === "drive") {
          return (
            <div style={{display: 'inline-block'}} key={'drive' + items[idx].id}>
              <DriveListItem item={items[idx]} />
            </div>
          )
        } else if (item && item.service === "in1box") {
          return (
            <div style={{display: 'inline-block'}} key={'note' + items[idx].id}>
              <NoteListItem item={items[idx].note} />
            </div>
          )
        }
      })

      return (
        <div style={drawerOpen ? drawerOpenStyles : drawerClosedStyles}>
          <div style={styles.root}>
            <InfiniteScroll loader={elementInfiniteLoad} hasMore threshold={80}
              ref='masonryContainer' loadMore={this.handleLoadMore}>
              <Masonry>
                { childElements }
              </Masonry>
            </InfiniteScroll>
          </div>
        </div>
      );
    }
  }
}
