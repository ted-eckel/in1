/** @flow */

// import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux'
import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import React, {Component, PropTypes} from 'react'

// import * as ThreadActions from '../actions/Gmail/ThreadActions'
// import * as PocketActions from '../actions/PocketActions'
// import * as DriveActions from '../actions/Drive/FileActions'

import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import CircularProgress from 'material-ui/CircularProgress'
// import RSVP from 'rsvp'

// import {
//   isFetchingSelector,
//   isLoadingSelector,
//   servicesLoadedSelector,
//   getAllItemsSelector,
//   getAllItemsSelectorTwo,
//   allAccountsCountSelector,
//   allAccountsSelector,
//   endOfListSelector,
//
//   driveIsLoadingSelector,
//   gmailIsLoadingSelector,
// } from '../selectors';

// @connect(
//   state => ({
//     // allItems: allItemsSelector(state),
//     servicesLoaded: servicesLoadedSelector(state),
//     isFetching: isFetchingSelector(state),
//     isLoading: isLoadingSelector(state),
//     getAllItems: getAllItemsSelector(state),
//     getAllItemsTwo: getAllItemsSelectorTwo(state),
//     allAccountsCount: allAccountsCountSelector(state),
//     allAccounts: allAccountsSelector(state),
//     endOfList: endOfListSelector(state),
//
//     driveIsLoading: driveIsLoadingSelector(state),
//     gmailIsLoading: gmailIsLoadingSelector(state)
//   }),
//   dispatch => bindActionCreators({
//     fetchItems: PocketActions.fetchItems,
//     loadThreadList: ThreadActions.loadList,
//     driveLoadList: DriveActions.loadList
//     // ...ThreadActions,
//   }, dispatch),
// )

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object,
    onRequestMoreItems: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    allAccounts: PropTypes.array.isRequired,
    endOfList: PropTypes.bool.isRequired,
    allAccountsCount: PropTypes.number.isRequired,
    servicesLoaded: PropTypes.array.isRequired,
    getAllItems: PropTypes.array.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
    handleLoadMore: PropTypes.func.isRequired,
    fetchItems: PropTypes.func.isRequired
  };

  componentWillMount = () => {
    const { fetchItems, isFetching, isLoading } = this.props;
    if (!isFetching && !isLoading){
      fetchItems();
    }
  }

  // handleRequestDelete = e => {
  //   e.preventDefault();
  //   alert('You clicked the delete button.');
  // }

  // handleLoadMore = () => {
  //   const { fetchItems, isFetching, isLoading, loadThreadList, onRequestMoreItems, servicesLoaded, endOfList, allAccounts, driveIsLoading, gmailIsLoading } = this.props;
  //   const pocketGet = () => {
  //     if (!isFetching && (/*Object.keys(servicesLoaded)*/allAccounts.includes('pocket') && servicesLoaded.pocket === true) && !endOfList){
  //       fetchItems()
  //     }
  //   }
  //   const gmailGet = () => {
  //     if (/*!isLoading*/ !gmailIsLoading && (/*Object.keys(servicesLoaded)*/allAccounts.includes('gmail')) && servicesLoaded.gmail === true) {
  //       onRequestMoreItems()
  //     }
  //   }
  //   const driveGet = () => {
  //     if (/*!isLoading*/ !driveIsLoading && (/*Object.keys(servicesLoaded)*/allAccounts.includes('drive')) && servicesLoaded.drive === true) {
  //       console.log('driveLoadList');
  //       driveLoadList()
  //     }
  //   }
  //
  //   pocketGet()
  //   gmailGet()
  //   driveGet()
  //   // RSVP.all([
  //   // ])
  //   // if (/*Object.keys(servicesLoaded*/allAccounts.length === 3){
  //   // }
  // }

  render(): ?ReactComponent {

    const items = this.props.getAllItems /*this.props.getAllItemsTwo*/;
    const servicesLoaded = this.props.servicesLoaded;
    // const requestMoreItems = this.props.onRequestMoreItems;
    const drawerOpen = this.props.drawerOpen;
    const allAccountsCount = this.props.allAccountsCount;
    const endOfList = this.props.endOfList;
    const allAccounts = this.props.allAccounts;

    console.log(allAccounts);
    console.log('items:');
    console.log(items);

    const drawerOpenStyles = {
      marginLeft: "266px",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const drawerClosedStyles = {
      marginLeft: "0",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const styles = {
      root: {maxWidth: "1296px", margin: "80px auto"}
    };

    const elementInfiniteLoad = (
      endOfList
      ? (
          <div style={{
            display: 'table',
            margin: '45px auto',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '400',
            fontSize: '18px',
            color: '#40555f'
          }}>
            End of your inbox!
          </div>
        )
      : (<CircularProgress size={80} thickness={6} style={{display: "block", margin: "0 auto"}} />)
    );

    if (allAccountsCount === 0) {
      return(
        <div style={{
          display: 'table',
          margin: '45px auto',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '400',
          fontSize: '20px',
          color: '#40555f'
        }}>
          Click a link in the sidebar to authorize a service
        </div>
      )
    } else if (Object.keys(servicesLoaded).length < allAccountsCount) {
      return (
        <div style={{marginTop: "80px"}}>
          {elementInfiniteLoad}
        </div>
      )
    } else {
      const childElements = items.map((item, idx) => {
        if (item.service === "pocket") {
          return (
            <div style={{display: 'inline-block'}} key={idx}>
              <PocketListItem
                item={items[idx].item}
                date={items[idx].date.toString()}
                handleRequestDelete={this.props.handleRequestDelete}
              />
            </div>
          )
        } else if (item.service === "gmail") {
          return (
            <div style={{display: 'inline-block'}} key={idx}>
              <GmailListItem
                gmailId={items[idx].id}
                from={items[idx].from}
                subject={items[idx].subject}
                snippet={items[idx].snippet}
                labelIDs={items[idx].labelIDs}
                isUnread={items[idx].isUnread}
                handleRequestDelete={this.props.handleRequestDelete}

                threadID={items[idx].threadID}
                hasAttachment={items[idx].hasAttachment}
                date={items[idx].date.toString()}
              />
            </div>
          )
        }
      })

      return (
        <div style={drawerOpen ? drawerOpenStyles : drawerClosedStyles}>
          <div style={{maxWidth: "1296px", margin: "75px auto"}}>
            <InfiniteScroll
              ref='masonryContainer'
              loadMore={this.props.handleLoadMore /*requestMoreItems*/}
              loader={elementInfiniteLoad}
              hasMore
              threshold={200}
              >
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
