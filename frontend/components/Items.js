/** @flow */

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import React, {Component, PropTypes} from 'react'
import * as ThreadActions from '../actions/Gmail/ThreadActions'
import * as PocketActions from '../actions/PocketActions'
import values from 'lodash/values'
import uniqBy from 'lodash/uniqBy'
import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import CircularProgress from 'material-ui/CircularProgress'
import RSVP from 'rsvp'

import {
  allItemsSelector,
  isFetchingSelector,
  isLoadingSelector,
  servicesLoadedSelector,
  getAllItemsSelector,
  getAllItemsSelectorTwo,
  allAccountsCountSelector
} from '../selectors';

@connect(
  state => ({
    allItems: allItemsSelector(state),
    servicesLoaded: servicesLoadedSelector(state),
    isFetching: isFetchingSelector(state),
    isLoading: isLoadingSelector(state),
    getAllItems: getAllItemsSelector(state),
    getAllItemsTwo: getAllItemsSelectorTwo(state),
    allAccountsCount: allAccountsCountSelector(state)
  }),
  dispatch => bindActionCreators({
    fetchItems: PocketActions.fetchItems,
    loadThreadList: ThreadActions.loadList,
    // ...ThreadActions,
  }, dispatch),
)

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object,
    onRequestMoreItems: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired
  };

  componentWillMount = () => {
    const { fetchItems, isFetching, isLoading } = this.props;
    if (!isFetching && !isLoading){
      fetchItems();
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  handleLoadMore = () => {
    const { fetchItems, isFetching, isLoading, loadThreadList, onRequestMoreItems } = this.props;
    if (!isFetching /*&& !isLoading*/){
      RSVP.all([
        fetchItems(),
        // loadThreadList()
        onRequestMoreItems()
      ])
    }
  }

  render(): ?ReactComponent {
    const items = this.props.getAllItems /*this.props.getAllItemsTwo*/;
    const servicesLoaded = this.props.servicesLoaded;
    const requestMoreItems = this.props.onRequestMoreItems;
    const drawerOpen = this.props.drawerOpen;
    const allAccountsCount = this.props.allAccountsCount;

    const drawerOpenStyles = {maxWidth: "1200px", margin: "20px 0 0 276px"}
    const drawerClosedStyles = {maxWidth: "1525px", margin: "20px auto"}

    const styles = {
      root: {maxWidth: "1525px", margin: "80px auto"}
    };

    const elementInfiniteLoad = (
      <CircularProgress size={80} thickness={6} style={{display: "block", margin: "0 auto"}} />
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
                handleRequestDelete={this.handleRequestDelete}
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
                handleRequestDelete={this.handleRequestDelete}

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
          <InfiniteScroll
            ref='masonryContainer'
            loadMore={this.handleLoadMore /*requestMoreItems*/}
            loader={elementInfiniteLoad}
            hasMore
            threshold={200}
            >
              <Masonry>
                { childElements }
              </Masonry>
            </InfiniteScroll>
          </div>
        );
    }
  }
}
