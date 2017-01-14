import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper'

// const list = items => { items.list ? items.list : {} };

const handleClick = fetchItems => fetchItems();

const Pocket = ({items}) => (
  <div style={{
    padding: "0 175px",
    margin: "0 auto",
    display: "-webkit-box",
    display: "-moz-box",
    display: "-ms-flexbox",
    display: "-webkit-flex",
    display: "flex",
    alignContent: "flex-start",
    flexWrap: "wrap"
  }}>
    {items.map((item, idx) => {
      return (
        <span
          key={idx}
          style={{
            margin: "15px"
          }}>
          <a
            href={items[idx].item.given_url}
            style={{
              textDecoration: "none"
            }}>
            <Paper
              style={{
                width: "275px",
                height: "225px",
                padding: "10px",
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
  </div>
);

Pocket.propTypes = {
  items: PropTypes.array.isRequired,
}

export default Pocket;
