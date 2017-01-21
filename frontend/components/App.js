import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GreetingContainer from './greeting/GreetingContainer'
// import PocketContainer from './pocket/PocketContainer'
// import ActionType from '../actions/ActionType'
import { fetchItems } from '../actions/PocketActions'
import { toggleDrawer } from '../actions/AppActions'
import { checkAuth, load, loadThreadList, loadThreads } from '../actions/GoogleActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
// import MasonryInfiniteScroller from 'react-masonry-infinite'
import InfiniteScroll from 'react-infinite-scroller'
import AppBar from 'material-ui/AppBar'
import Infinite from 'react-infinite'
// import Masonry from 'masonry-layout'
import Masonry from 'react-masonry-component'
// import InView from 'in-view'
// import MasonryMixin from 'react-masonry-mixin'
// import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import SvgIconClear from 'material-ui/svg-icons/content/clear'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import config from '../config'
// import MasonryInfinite from './pocket/MasonryInfiniteScroller'


// if there is are no more items, Pocket will return something like this as a response:
// {"status":2,"complete":1,"list":[],"error":null,"search_meta":{"search_type":"normal"},"since":1484251363}

{/* <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].given_url)} />
{ " " }
<a href={items[idx].given_url}>
  {items[idx].resolved_title}
</a> : { (new Date(parseInt(items[idx].time_added) * 1000)).toString() }
{ " : "}
{ items[idx].image ? <img style={{ "maxHeight": "100px" }} src={items[idx].image.src}  /> : <span/>} */}

class App extends Component {

  static propTypes = {
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired
  }

  // componentDidMount() {
  //   const { dispatch } = this.props
  //   dispatch(fetchItems())
  //   console.log("componentDidMount()")
  // }

  componentWillMount() {
    const { dispatch } = this.props;
    window.gapi.load('client', () => {
      dispatch({type: ActionType.Gmail.Authorization.REQUEST})
      checkAuth(true, this.handleAuth.bind(this));
    });
  }

  handleAuth = authResult => {
    const { dispatch } = this.props;
    if (authResult && !authResult.error) {
      dispatch({type: ActionType.Gmail.Authorization.SUCCESS})
      dispatch({type: ActionType.Gmail.Label.LOAD_ALL_REQUEST})
      load(this.handleLabels.bind(this), this.handleLabelError.bind(this))
      dispatch({type: ActionType.Gmail.Thread.LOAD_LIST_REQUEST})
      loadThreadList(this.handleThreadList.bind(this), this.handleThreadListError)
    } else {
      dispatch({type: ActionType.Gmail.Authorization.FAILURE})
    }
  }

  handleLabels = labels => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Label.LOAD_ALL_SUCCESS, labels})
  }

  handleLabelError = error => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Label.LOAD_ALL_FAILURE, error})
  }

  // handleAuthClick = e => {
  //   e.preventDefault();
  //   const { dispatch } = this.props;
  //   dispatch(toggleDrawer());
  //   dispatch(handleAuthClicking());
  // }

  handleThreadList = threadList => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Thread.LOAD_LIST_SUCCESS, threadList})
    dispatch({type: ActionType.Gmail.Thread.LOAD_REQUEST})
    loadThreads(this.handleThreads.bind(this), this.handleThreadsError.bind(this))
  }

  handleThreadListError = error => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Thread.LOAD_LIST_FAILURE, error})
  }

  handleThreads = threadMessages => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Thread.LOAD_SUCCESS, threadMessages})
  }

  handleThreadsError = error => {
    const { dispatch } = this.props;
    dispatch({type: ActionType.Gmail.Thread.LOAD_FAILURE, error})
  }

  handleClick = e => {
    e.preventDefault()
    const { dispatch } = this.props;
    dispatch(fetchItems())
    console.log("handleClick()")
  }

  handleRefresh = () => {
    const { dispatch } = this.props;
    dispatch(fetchItems());
    console.log("handleRefresh()");
  }

  handleLoadMore = () => {
    const { dispatch, isFetching } = this.props;
    if (!isFetching){
      dispatch(fetchItems());
      console.log("handleLoadMore()");
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  handleTouchTap = e => {
    e.preventDefault();
    alert('You clicked the Chip.');
  }

  handleDrawerClose = () => {
    const { dispatch } = this.props;
    dispatch(toggleDrawer());
  }

  urlParser = url => {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
  }

  render() {
    const { items, isFetching } = this.props
    const isEmpty = items.length === 0
    const elementInfiniteLoad = (
      <CircularProgress size={80} thickness={6} style={{display: "block", margin: "0 auto"}} />
    );

    const childElements = items.map((item, idx) => {
      return (
        <div
          key={idx}
          style={{
            margin: "15px"
          }}
          className="paper"
        >
          <Paper
            style={{
              width: "275px",
              // height: "225px",
              padding: "10px 0"
            }}
          >
            <a
              href={"https://getpocket.com/a/read/".concat(items[idx].item.item_id)}
              style={{
                textDecoration: "none"
              }}
              target="_blank"
              className="pocket-link"
            >
              <div style={{margin: "0 10px 5px"}}>
                {
                  items[idx].service === "pocket"
                  ? (
                    <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                      <img src="http://www.google.com/s2/favicons?domain=https://getpocket.com/" />
                      {" "}
                    </div>
                  )
                  : <span />
                }
              <span style={{}} className="pocket-title">
                {
                  items[idx].item.resolved_title
                  ? items[idx].item.resolved_title
                  : items[idx].item.given_title
                }
              </span>
            </div>
            <div style={{maxHeight: "350px", overflow: "hidden"}}>
              {
                (items[idx].item.image)
                ? (
                  <div
                    style={{
                      margin: "10px auto",
                      display: "table"
                    }}
                    >
                      <img
                        style={{
                          maxWidth: "275px",
                          fontSize: "12px",
                          color: "darkgray"
                        }}
                        src={items[idx].item.image.src}
                        alt={(items[idx].item.excerpt ? items[idx].item.excerpt : "")}
                      />
                    </div>
                  )
                  : (
                    items[idx].item.excerpt
                    ? (
                      <div
                        style={{
                          fontSize: "12px",
                          margin: "10px",
                          color: "darkgray"
                        }}
                        >
                          {items[idx].item.excerpt}
                        </div>
                      )
                    : <span />
                    )
                  }
              </div>
            </a>
            <div style={{margin: "0 0 7px 10px"}}>
              <a
                href={items[idx].item.given_url}
                style={{
                  textDecoration: "none"
                }}
                target="_blank"
              >
                <div style={{display: "inline-block", margin: "0 10px 0 0"}}>
                  <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].item.given_url)} />
                  {" "}
                  <span className="item-url">{this.urlParser(items[idx].item.given_url)}</span>
                </div>
              </a>
            </div>
            <div style={{margin: "0 10px 0 20px"}}>
              {
                items[idx].item.tags
                ? (
                  <div className="tags">
                    {Object.keys(items[idx].item.tags).map((tag, idx) => {
                      return (
                        <div key={idx} style={{cursor: "pointer"}} className="tag">
                          {tag}
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              margin: "0 0 0 5px"
                            }}
                            onClick={this.handleRequestDelete}
                          >
                            x
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  )
                : <span style={{display: "none"}} />
              }
            </div>
          </Paper>
        </div>
      )
    });



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
          <div style={{maxWidth: "1525px", margin: "80px auto"}}>
            <InfiniteScroll
              ref='masonryContainer'
              loadMore={this.handleLoadMore}
              loader={elementInfiniteLoad}
              hasMore
              threshold={200}
              >
              <Masonry>
                {childElements}
              </Masonry>
            </InfiniteScroll>
          </div>
          {/* <Masonry>
            {childElements}
          </Masonry> */}
          {/* <div>
            { isEmpty ? elementInfiniteLoad : <PocketContainer /> }
          </div> */}
          {/* <FlatButton className="lolol" label="Fetch more items" onClick={this.handleClick} /> */}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    items: state.pocket.items,
    isFetching: state.pocket.isFetching,
    error: state.pocket.error,
    drawerOpen: state.app.drawerOpen
  }
}

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

export default connect(mapStateToProps)(App)
