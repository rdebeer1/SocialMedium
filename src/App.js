import React, { Component } from 'react';
import './App.css';
import HandleUser from './components/HandleUser.js'
import Images from './components/Images.js'
import Artists from './components/Artists.js'
import Details from './components/Details.js'
import Form from './components/Form.js'
import Logo from './components/Logo.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import axios from 'axios';
const config = require('./config.js');

class App extends Component {
  state = {
    events: [],
    images: [],
    artist: [],
    input: null
  }
  urls = {
    root: 'https://app.ticketmaster.com/discovery/v2/'
  }

  handleFormChange = (e, input) => {
    this.setState({
      input: input
    })
  }

  getEvents = () => {
    const city = this.state.input;
    let base_url = this.urls.root + `events.json?city=${city}&segmentId=KZFzniwnSyZfZ7v7nJ&size=100&source=ticketmaster&sort=date,asc&apikey=${config.MY_API_TOKEN}`;
    var myInit = {
      method: 'GET',
      cache: 'default',
      dataType: 'json',
    };
    fetch(base_url, myInit)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        let images = []
        let artist = []
        let events = []
        let mapped = data._embedded.events.map(next => {
          if (next.dates.status.code === 'offsale') {
            return next;
          } else {
            events.push(next)
            artist.push(next.name)
          }
          for (let i = 0; i < next.images.length; i++) {
            if (next.images[i].width === 2048) {
              images.push(next.images[i].url)
            }
          }
          return mapped
        })
        this.setState({
          events: events,
          images: images,
          artist: artist,
        })
      })
  }

  getUserProfile(username) {
    axios.post('/userProfile', {
      username: username
    })
      .then(res => {
        console.log('res.data from getting User Profile:', res.data);
        this.setState({
          userProfile: res.data
        }, () => {
          console.log('this.state.userProfile:', this.state.userProfile);
        })
      })
      .catch(err => {
        console.log('error getting user Profile:', err);
      })
  }


  render() {
    const { images } = this.state
    const { artist } = this.state
    const { events } = this.state

    const styles = { 
      app: {
        backgroundColor: 'white',
        position: 'static',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        maxHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '100',
        textTransform: 'uppercase',
      },
      container: {
        flex: 1,
        display: 'inline-flex',
        flexDirection: 'column',
      },
      scroll: {
        overflow: 'auto',
        alignItems: 'center',
        display: 'flex',
        flex: 1,
      },
      paper: {
        paddingTop: '2em',
        paddingBottom: '.5em',
        alignItems: 'center',
        maxHeight: '100%',
      }
    }

    return (
      <div className="App" style={styles.app}>
        <MuiThemeProvider>
          <div>
            <HandleUser getEvents={this.getEvents} />
            <Logo />
            <Form 
              handleFormChange={this.handleFormChange}
              getEvents={this.getEvents} 
            />
            <div style={styles.scroll}>
              <div style={styles.container}>
                <Paper style={styles.paper} zDepth={1} rounded={false}>
                <Images images={images} />
                <Details details={events} />
                <Artists artist={artist} />
                </Paper>
              </div> 
              <script type="text/javascript" src="http://api.eventful.com/js/api"></script>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
export default App;
