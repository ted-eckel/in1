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
