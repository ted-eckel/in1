import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GreetingContainer from './greeting/GreetingContainer'
import PocketContainer from './pocket/PocketContainer'
import { fetchItems } from '../actions/PocketActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import InfiniteScroll from 'react-infinite-scroller'
import AppBar from 'material-ui/AppBar'
import Infinite from 'react-infinite'


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
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchItems())
    console.log("componentDidMount()")
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

  render() {
    const { items, isFetching } = this.props
    const isEmpty = items.length === 0
    const elementInfiniteLoad = (
      <div style={{margin: "0 auto"}}>
        <CircularProgress size={80} thickness={6} />
      </div>
    );

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div style={{backgroundColor: "#F4F4F6"}}>
          <GreetingContainer />
          <br />
          <br />
          <Infinite elementHeight={225}
                    containerHeight={window.innerHeight}
                    infiniteLoadingBeginEdgeOffset={200}
                    loadingSpinnerDelegate={elementInfiniteLoad}
                    isInfiniteLoading={isFetching}
                    useWindowAsScrollContainer
                    onInfiniteLoad={this.handleRefresh}
                    style={{
                      padding: "0 175px",
                      margin: "0 auto",
                      display: "-webkit-box",
                      display: "-moz-box",
                      display: "-ms-flexbox",
                      display: "-webkit-flex",
                      display: "flex",
                      alignContent: "flex-start",
                      flexWrap: "wrap"
                    }}
                    >
                      {items.map((item, idx) => {
                        return (
                          <span
                            key={idx}
                            style={{
                              margin: "15"
                            }}>
                            <a
                              href={items[idx].item.given_url}
                              style={{
                                textDecoration: "none"
                              }}>
                              <Paper
                                style={{
                                  width: "275",
                                  height: "225",
                                  padding: "10",
                                }}
                                zDepth={1}>
                                {items[idx].service === "pocket"
                                  ? (
                                        <span>
                                          <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].item.given_url)} />
                                          {" "}
                                        </span>
                                      )
                                    : <span />
                                  }
                                <span>
                                  {
                                    items[idx].item.resolved_title
                                    ? items[idx].item.resolved_title
                                    : items[idx].item.given_title
                                  }
                                </span>
                              </Paper>
                            </a>
                          </span>
                        )
                      })}
          </Infinite>
          {/* <div>
            { isEmpty ? elementInfiniteLoad : <PocketContainer /> }
          </div> */}
          {/* <FlatButton label="Fetch more items" onClick={this.handleClick} /> */}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  const {
    items,
    isFetching,
    error
  } = state.pocket

  return {
    items,
    isFetching,
    error
  }
}

export default connect(mapStateToProps)(App)
