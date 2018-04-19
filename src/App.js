import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { RaisedButton } from 'material-ui';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Alert } from 'antd';
import {fullBlack, white } from 'material-ui/styles/colors';
import Images from './components/Images.js'
import Artists from './components/Artists.js'
import Details from './components/Details.js'
import Logo from './components/Logo.js'
import './App.css';
const config = require('./config.js');

class App extends Component {
  state = {
    openLogin: false,
    openSignUp: false,
    openForgotPassword: false,
    blankUsernameLoginError: false,
    blankUsernamePasswordError: false,
    userNotExistsError: false,
    badPasswordError: false,
    blankUsernameError: false,
    blankPasswordError: false,
    blankConfirmPasswordError: false,
    passwordMatchError: false,
    blankEmailError: false,
    wholeNumberLimitError: false,
    usernameExistsError: false,
    emailExistsError: false,
    openDialog: 'none',
    signupUsername: '',
    signupPassword: '',
    signupConfirmPassword: '',
    signupEmail: '',
    loginUsername: '',
    loginPassword: '',
    username: '',
    forgottenPassword: '',
    userProfile: null,
    check : [],
    events: [],
    images: [],
    artist: [],
  }
  urls = {
    root: 'https://app.ticketmaster.com/discovery/v2/'
  }

  handleClose = () => 
    this.setState({ 
      open: false 
    });

  handleOpen = (name) => {
    this.setState({
      [name]: true,
      openDialog: name
    });
  }

  handleName = (name, callback) => {
    this.setState({
      [name]: false,
      openDialog: 'none',
    });
    if (callback) {
      callback();
    }
  }
  
  clearUserInput = () => {
    this.setState({
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupEmail: '',
      blankUsernameLoginError: false,
      blankUsernamePasswordError: false,
      userNotExistsError: false,
      badPasswordError: false,
      blankUsernameError: false,
      blankPasswordError: false,
      blankConfirmPasswordError: false,
      passwordMatchError: false,
      blankEmailError: false,
      blankLimitError: false,
      usernameExistsError: false,
      emailExistsError: false
    })
  }

  handleErrorState = (error) => {
    this.setState({
      [error]: true
    })
  }

  getEvents = () => {
    const city = this.refs.city.input.value
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

  submitSignUp = (username, password, passwordConfirm, email) => {
    if (username === '') {
      this.setState({
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        usernameExistsError: false,
        emailExistsError: false,
      })
      this.handleErrorState('blankUsernameError');
    } else if (password === '') {
      this.setState({
        blankUsernameError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankPasswordError');
    } else if (passwordConfirm === '') {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankConfirmPasswordError');
    } else if (password !== passwordConfirm) {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        blankEmailError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('passwordMatchError');
    } else if (email === '') {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankEmailError');
    } else {
      axios.post('/createAccount', {
        username: this.state.signupUsername,
        password: this.state.signupPassword,
        email: this.state.signupEmail,
      }).then(res => {
        console.log('res.data from /createAccount post:', res.data);
        if (res.data === 'Username already exists') {
          this.setState({
            blankUsernameError: false,
            blankPasswordError: false,
            blankConfirmPasswordError: false,
            passwordMatchError: false,
            blankEmailError: false,
            emailExistsError: false
          })
          this.handleErrorState('usernameExistsError')
        } else if (res.data === 'Email already exists') {
          this.setState({
            blankUsernameError: false,
            blankPasswordError: false,
            blankConfirmPasswordError: false,
            passwordMatchError: false,
            blankEmailError: false,
            usernameExistsError: false,
          })
          this.handleErrorState('emailExistsError')
        } else if ('User saved in saveUserIntoDataBase') {
          this.handleErrorState('accountCreationSuccess')
          this.handleName('openSignUp', () => {
            this.setState({
              username: res.data,
            }, () => {
              console.log('this.state.username:', this.state.username);
              this.getUserProfile(this.state.username);
            });
          });
        }
      }).catch(err => {
        console.log('error:', err)
      })
    }
  }
  submitLogin = (username, password) => {
    if (username === '') {
      this.setState({
        blankUsernamePasswordError: false,
        userNotExistsError: false,
        badPasswordError: false,
      });
      this.handleErrorState('blankUsernameLoginError');
    } else if (password === '') {
      this.setState({
        blankUsernameLoginError: false,
        userNotExistsError: false,
        badPasswordError: false,
      });
      this.handleErrorState('blankUsernamePasswordError');
    } else {
      axios.post('/login', {
        username: username,
        password: password
      })
        .then(res => {
          if (res.status === 202) {
            this.setState({
              username: res.data,
              loggedInUsername: res.data
            })
            this.handleName('openLogin');
            this.clearUserInput();
            this.getUserProfile(this.state.username);
          } if (res.status === 200) {
            if (res.data === 'user not found') {
              this.setState({
                blankUsernameLoginError: false,
                blankUsernamePasswordError: false,
                badPasswordError: false,
              });
              this.handleErrorState('userNotExistsError');
            } else if (res.data === 'password does not match') {
              this.setState({
                blankUsernameLoginError: false,
                blankUsernamePasswordError: false,
                userNotExistsError: false,
              });
              this.handleErrorState('badPasswordError');
            }
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
  }
  logout = () => {
    console.log('running')
    axios.post('/logout')
      .then(() => {
        this.setState({
          username: '',
          userProfile: null,
          loggedInUsername: ''
        })
      })
      .catch(err => console.log('error on logout function:', err));
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
      scroll: {
        overflow: 'auto',
        alignItems: 'center',
        display: 'flex',
        flex: 1,
      },
      container: {
        flex: 1,
        display: 'inline-flex',
        flexDirection: 'column',
      },
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
      reactCard: {
        position: 'none',
      },
      form: {
        flex: 1,
        backgroundColor: 'transparent',
        color: 'white',
        textAlign: 'center'
      },
      input: {
        color: 'black',
        fontSize: '18px',
        textAlign: 'center'
      },
      formButton: {
        size: '1em',
        color: 'black',
        margin: '.25em',
        alignItems: 'center',
        border: 'black'
      },
      paper: {
        paddingTop: '2em',
        paddingBottom: '.5em',
        alignItems: 'center',
        maxHeight: '100%',
      }
    }
    const logIn = [
      this.state.blankUsernameLoginError ?
        <Alert
          description="Please enter a username"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankUsernamePasswordError ?
        <Alert
          description="Please enter a password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.userNotExistsError ?
        <Alert
          description="This user does not exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.badPasswordError ?
        <Alert
          description="This password is incorrect"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      <TextField
        floatingLabelText='Username'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        type='text'
        fullWidth={true}
        onChange={(e) => { this.setState({ loginUsername: e.target.value }) }}
      />, <br />,
      <TextField
        floatingLabelText='Password'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        type='password'
        fullWidth={true}
        onChange={(e) => { this.setState({ loginPassword: e.target.value }) }}
      />,
      <FlatButton
        label='Cancel'
        color={fullBlack}
        onClick={(e) => {
          this.handleName.bind('openLogin');
        }}
      />,
      <FlatButton
        label='Submit'
        color={fullBlack}
        keyboardFocused={false}
        onClick={(e) => { e.preventDefault(); this.submitLogin(this.state.loginUsername, this.state.loginPassword) }}
      />,
      <FlatButton
        label='Forgot Password?'
        color={fullBlack}
        keyboardFocused={false}
        onClick={() => { this.setState({ openForgotPassword: true }) }}
      />
    ];
    const signUp = [
      this.state.blankUsernameError ?
        <Alert
          description="Please enter a username"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankPasswordError ?
        <Alert
          description="Please enter a password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankConfirmPasswordError ?
        <Alert
          description="Please confirm your password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.passwordMatchError ?
        <Alert
          description="Passwords do not match"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankEmailError ?
        <Alert
          description="Please enter an email"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.usernameExistsError ?
        <Alert
          description="This username already exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.emailExistsError ?
        <Alert
          description="This email address already exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.accountCreationSuccess ?
        <Alert
          description="Success creating account"
          type="success"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      <TextField
        floatingLabelText='New Username'
        floatingLabelFixed={true}
        type='text'
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { this.setState({ signupUsername: e.target.value }) }}
      />, <br />,
      <TextField
        floatingLabelText='New Password'
        floatingLabelFixed={true}
        type='password'
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { this.setState({ signupPassword: e.target.value }) }}
      />,
      <TextField
        floatingLabelText='Confirm Password'
        floatingLabelFixed={true}
        type='password'
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { this.setState({ signupConfirmPassword: e.target.value }) }}
      />,
      <TextField
        floatingLabelText='Email'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        type='text'
        fullWidth={true}
        onChange={(e) => { this.setState({ signupEmail: e.target.value }) }}
      />,
      <FlatButton
        label='Cancel'
        color={fullBlack}
        onClick={(e) => { this.handleName('openSignUp'); this.clearUserInput() }}
      />,
      <FlatButton
        label='Submit'
        color={fullBlack}
        keyboardFocused={true}
        onClick={(e) => { e.preventDefault(); this.submitSignUp(this.state.signupUsername, this.state.signupPassword, this.state.signupConfirmPassword, this.state.signupEmail) }}
      />,
    ];
    const forgotPassword = [
      <TextField
        floatingLabelText='Email'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { this.setState({ forgottenPassword: e.target.value }) }}
      />,
      <FlatButton
        label='Send'
        color={fullBlack}
        onClick={(e) => {
          this.setState({ openForgotPassword: false })
        }}
      />,
    ];

    return (
      <div className="App" style={styles.app}>
        <MuiThemeProvider>
          <div>
            {this.state.username === '' ?
              <RaisedButton
                style={{ margin: 7.925 }}
                labelColor={fullBlack}
                backgroundColor={white}
                label='Sign Up'
                onClick={this.handleOpen.bind(this, "openSignUp")}
              /> :
              null
            }
            <Dialog
              title='Enter a new username, password, and email'
              actions={signUp}
              modal={false}
              open={this.state.openSignUp}
              onRequestClose={(e) => { this.handleName('openSignUp'); this.clearUserInput() }}
            />
            {this.state.username === '' ?
              <RaisedButton
                style={{ margin: 7.925 }}
                labelColor={fullBlack}
                backgroundColor={white}
                label='Log In'
                onClick={this.handleOpen.bind(this, "openLogin")}
              /> :
              <RaisedButton
                style={{ margin: 7.925 }}
                labelColor={fullBlack}
                backgroundColor={white}
                label='Log Out'
                onClick={this.logout.bind(this)}
              />}
            <Dialog title='Enter your username and password'
              actions={logIn}
              modal={false}
              open={this.state.openLogin}
              onRequestClose={
                (e) => {
                  this.handleName('openLogin'); this.clearUserInput()
                }}
            />
                <Dialog title='Enter Your Email to Change Your Password'
              actions={forgotPassword}
              modal={false}
              open={this.state.openForgotPassword}
              onRequestClose={
                () => { this.setState({ openForgotPassword: false }) }
              }
            />
            <Logo />
            <form style={styles.form} noValidate autoComplete='off'>
                <TextField style={styles.input} ref='city'type='text' id='serch' inputStyle={styles.input} underlineFocusStyle={{borderColor: 'black'}} floatingLabelStyle={styles.input} underlineStyle={{bottom: '4px', color: 'black'}} />
              <RaisedButton style={styles.formButton} buttonStyle={{ border: ' 1px solid black' }} onClick={this.getEvents} label='Search by City' labelPosition='before' icon={<i style={{color: 'black'}} className="material-icons">search</i>}/>
                </form> 
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
