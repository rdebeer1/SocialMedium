import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RaisedButton } from 'material-ui';
import { Alert } from 'antd';
import { fullBlack, white } from 'material-ui/styles/colors';
import axios from 'axios';

class LogIn extends Component {
  state = {
    username: '',
    loginUsername: '',
    loginPassword: '',
    loggedInUsername: '',
    forgottenPassword: '',
    blankUsernamePasswordError: false,
    userNotExistsError: false,
    badPasswordError: false,
    openDialog: 'none',
    openLogin: false,
    openSignUp: false,
    openForgotPassword: false,
    userProfile: null,
  }

  handleOpen = (name) => {
    this.setState({
      [name]: true,
      openDialog: name
    });
  }

  handleClose = (name, callback) => {
    this.setState({
      [name]: false,
      openDialog: 'none',
    });
    if (callback) {
      callback();
    }
  }

  handleErrorState = (error) => {
    this.setState({
      [error]: true
    })
  }

  clearUserInput = () => {
    this.setState({
      loginUsername: '',
      loginPassword: '',
      blankUsernamePasswordError: false,
      userNotExistsError: false,
      badPasswordError: false,
    })
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
            this.handleClose('openLogin');
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

  render() {
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
        onChange={(e) => {
          this.setState({
            loginUsername: e.target.value
          })
        }}
      />, <br />,
      <TextField
        floatingLabelText='Password'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        type='password'
        fullWidth={true}
        onChange={(e) => {
          this.setState({
            loginPassword: e.target.value
          })
        }}
      />,
      <FlatButton
        label='Cancel'
        color={fullBlack}
        onClick={(e) => {
          this.handleClose('openLogin');
          this.clearUserInput();
        }}
      />,
      <FlatButton
        label='Submit'
        color={fullBlack}
        keyboardFocused={false}
        onClick={(e) => {
          e.preventDefault();
          this.submitLogin(this.state.loginUsername, this.state.loginPassword)
        }}
      />,
      <FlatButton
        label='Forgot Password?'
        color={fullBlack}
        keyboardFocused={false}
        onClick={() => {
          this.setState({
            openForgotPassword: true
          })
        }}
      />
    ];

    const forgotPassword = [
      <TextField
        floatingLabelText='Email'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => {
          this.setState({
            forgottenPassword: e.target.value
          })
        }}
      />,
      <FlatButton
        label='Send'
        color={fullBlack}
        onClick={(e) => {
          this.setState({
            openForgotPassword: false
          })
        }}
      />,
    ];

    return (
      <span>
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
          onRequestClose={(e) => {
            this.handleClose('openLogin');
            this.clearUserInput();
          }}
        />
        <Dialog title='Enter Your Email to Change Your Password'
          actions={forgotPassword}
          modal={false}
          open={this.state.openForgotPassword}
          onRequestClose={() => {
            this.setState({
              openForgotPassword: false
            })
          }}
        />
      </span>
    )
  }
}

export default LogIn;