import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
const config = require('../config.js');

class Details extends Component {
  state = {
    eventName: [],
    localDate: [],
    localTime: [],
    ticketStatus: [],
    minPrice: [],
    maxPrice: [],
    promoter: [],
    venue: [],
    url: [],
    eventId: null,
  }
  getEventDetails = (event_base_url) => {
    let url = 'https://app.ticketmaster.com' + event_base_url + `&apikey=${config.MY_API_TOKEN}`
    var myInit = {
      method: 'GET',
      cache: 'default',
      dataType: 'json',
    }
    fetch(url, myInit)
      .then((res) => res.json())
      .then((data) => {
        let result = []
        result.push(data)
        let minPrice = []
        let maxPrice = []
        let promoter = []
        let venue = []
        let checkPrices = result.map(check => {
          if (!check.priceRanges) {
            minPrice.push('N/A') && maxPrice.push('N/A')
          } else {
            minPrice.push(check.priceRanges[0].min) && maxPrice.push(check.priceRanges[0].max)
          }
          return checkPrices;
        })
        let checkPromoter = result.map(check => {
          if (!check.promoter) {
            promoter.push('N/A')
          } else {
            promoter.push(check.promoter.name)
          }
          return checkPromoter;
        })
        let checkVenue = result.map(check => {
          if (!check._embedded.venues) {
            venue.push('TBD')
          } else {
            venue.push(check._embedded.venues[0].name)
          }
          return checkVenue;
        })
        this.setState({
          check: data,
          eventName: data.name,
          localDate: data.dates.start.localDate,
          localTime: data.dates.start.localTime,
          ticketStatus: data.dates.status.code,
          minPrice: minPrice,
          maxPrice: maxPrice,
          promoter: promoter,
          venue: venue,
          url: data.url
        })
      })
  }
  handleEventClick = (event_base_url) => {
    this.setState({
      eventId: event_base_url,
    });
    this.getEventDetails(event_base_url);
  }

  handleToggle = () =>
    this.setState({
      open: !this.state.open
    });
    
  render() {
    const { details } = this.props
    const { eventName } = this.state
    const { localDate } = this.state
    const { ticketStatus } = this.state
    const { minPrice } = this.state
    const { maxPrice } = this.state
    const { promoter } = this.state
    const { venue } = this.state
    const { url } = this.state

    const styles = {
      buttonFlex: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center'
      },
      buttonDiv: {
        flex: 1,
      },
      button: {
        flex: 1,
        color: 'black',
        cursor: 'pointer',
        borderRadius: '50%',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
      },
      drawerContainer: {
        height: '100vh',
        background: 'white',
        textAlign: 'left',
        overflow: 'hidden'
      },
      drawerDivs: {
        fontSize: '1em',
        fontWeight: '400',
        color: 'black',
        textAlign: 'left',
      },
      buyTickets: {
        fontSize: '1em',
        fontWeight: '700',
        color: 'black',
        textAlign: 'center',
      },
      drawerSpans: {
        fontSize: '1em',
        fontWeight: '100',
        color: 'black',
        itemAlign: 'center',
        marginLeft: '.5em',
        display: 'inline-block'
      },
      drawerStyle: {
        background: 'white',
        borderLeft: 'solid 1px',
        borderColor: 'black',
      },
      eventDrawer: {
        fontSize: '1.25em',
        fontWeight: '400',
        color: 'black',
        textAlign: 'center',
        margin: '1em'
      },
      link: {
        textDecoration: 'none'
      }
    }

    let time = this.state.localTime.toString()
    let splitTime = time.split(':')
    let hours = Number(splitTime[0]);
    let minutes = Number(splitTime[1]);
    let seconds = Number(splitTime[2]);
    let timeValue;
    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    }
    else if (hours === 0) {
      timeValue = "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeValue += (seconds < 10) ? "" : ":" + seconds;
    timeValue += (hours >= 12) ? " P.M." : " A.M.";

    return (
      <div>
        <div style={styles.buttonFlex}>
          {
            details.map((details, key) =>
              <div style={styles.buttonDiv} key={'details' + key} onClick={() => this.handleEventClick(details._links.self.href)}>
                <i style={styles.button} onClick={this.handleToggle} className="material-icons" >info_outline</i>
              </div>
            )
          }
        </div>
        <Drawer style={styles.drawerStyle} containerStyle={styles.drawerStyle} docked={false} onRequestChange={(open) => this.setState({ open })} width={'30%'} openSecondary={true} open={this.state.open}>
          <div style={styles.drawerContainer}>
            <div style={styles.eventDrawer}>
              {eventName}
            </div>
            <Divider />
            <List>
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Date:
                      <span style={styles.drawerSpans}>
                    {localDate}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Time:
                      <span style={styles.drawerSpans}>
                    {timeValue}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Tickets:
                      <span style={styles.drawerSpans}>
                    {ticketStatus}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Ticket Prices:
                      <span style={styles.drawerSpans}>
                    $ {minPrice} - $ {maxPrice}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Promoter:
                      <span style={styles.drawerSpans}>
                    {promoter}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <ListItem insetChildren={true} disabled={true}>
                <div style={styles.drawerDivs}>
                  Venue:
                      <span style={styles.drawerSpans}>
                    {venue}
                  </span>
                </div>
              </ListItem>
              <Divider inset={true} />
              <a style={styles.link} target="_blank" href={url}>
              <ListItem insetChildren={true}>
                <div style={styles.buyTickets}>
                  Buy Tickets
                    </div>
              </ListItem>
              </a>
            </List>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default Details;