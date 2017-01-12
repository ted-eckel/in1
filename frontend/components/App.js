import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GreetingContainer from './greeting/GreetingContainer'
import PocketContainer from './pocket/PocketContainer'
import { fetchItems, fetchItemsIfNeeded } from '../actions/PocketActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import InfiniteScroll from 'react-infinite-scroller'


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
    dispatch(fetchItemsIfNeeded({count: 20, detailType: "complete"}))
  }

  handleClick = e => {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(fetchItems({count: 20, detailType: "complete"}))
  }

  handleRefresh = () => {
    const { dispatch } = this.props
    dispatch(fetchItems({count: 20, detailType: "complete"}))
  }

  render() {
    const { items, isFetching } = this.props
    const isEmpty = items.length === 0
    const elementInfiniteLoad = <CircularProgress style={{margin: "0 auto"}} size={80} thickness={6} />;

    // const isEmpty = Object.keys(items).length === 0
    return (
      <MuiThemeProvider>
        <div style={{width: "100%", height: "100%"}}>
          <h1>in1</h1>
          <GreetingContainer />
          <br />
          <FlatButton label="Fetch 20 items" onClick={this.handleClick} />
          <br />
          {isEmpty
            ? (isFetching ? <CircularProgress style={{margin: "0 auto"}} size={80} thickness={6} /> : <h2>Empty.</h2>)
            : <div>
                <InfiniteScroll
                  loadMore={this.handleRefresh}
                  hasMore={true}
                  loader={elementInfiniteLoad}
                  style={{
                   display: "-webkit-box",
                   display: "-moz-box",
                   display: "-ms-flexbox",
                   display: "-webkit-flex",
                   display: "flex",
                   alignContent: "flex-start",
                   width: "100%",
                   flexWrap: "wrap"
                  }}>
                  {
                    items.map((item, idx) => {
                      return (
                        <span key={idx}>
                          <a href={items[idx].given_url} style={{textDecoration: "none"}}>
                            <Paper style={{width: "200px", height: "200px", padding: "10px", margin: "10px"}} zDepth={1}>
                              <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].given_url)} />
                              { " " }
                              <span>{items[idx].resolved_title}</span>
                            </Paper>
                          </a>
                        </span>
                      )
                    })
                  }
                </InfiniteScroll>
                {/* <MasonryInfiniteScroller
                  hasMore={true}
                  loadMore={this.handleRefresh}
                  style={{ margin: "0 auto", width: "100%", opacity: isFetching ? 0.5 : 1}}
                  sizes={
                    [
                      { columns: 5, gutter: 20 },
                      { mq: '768px', columns: 3, gutter: 20 },
                      { mq: '1024px', columns: 5, gutter: 20 }
                    ]
                  }>
                  {
                    items.map((item, idx) => {
                      return (
                        <div key={idx}>
                          <a href={items[idx].given_url} style={{textDecoration: "none"}}>
                            <Paper style={{width: "200px", padding: "10px"}} zDepth={1}>
                              <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].given_url)} />
                              { " " }
                              <span>{items[idx].resolved_title}</span>
                            </Paper>
                          </a>
                        </div>
                      )
                    })
                  }
                </MasonryInfiniteScroller> */}
              </div>
          }
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
