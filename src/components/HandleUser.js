import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RaisedButton } from 'material-ui';
import { Alert } from 'antd';
import { fullBlack, white } from 'material-ui/styles/colors';
import axios from 'axios';

class HandleUser extends Component {
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
          this.handleClose('openSignUp', () => {
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

  render () {
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
          this.handleClose.bind('openLogin');
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
        onClick={(e) => { this.handleClose('openSignUp'); this.clearUserInput() }}
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
          onRequestClose={(e) => { this.handleClose('openSignUp'); this.clearUserInput() }}
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
              this.handleClose('openLogin'); this.clearUserInput()
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
      </div>
    )
  }
}
export default HandleUser;