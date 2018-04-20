import React, { Component } from 'react'
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RaisedButton } from 'material-ui';
import { Alert } from 'antd';
import { fullBlack, white } from 'material-ui/styles/colors';
import axios from 'axios';

class SignUp extends Component {
  state = {
    username: '',
    signupUsername: '',
    signupPassword: '',
    signupConfirmPassword: '',
    signupEmail: '',
    blankPasswordError: false,
    blankConfirmPasswordError: false,
    passwordMatchError: false,
    blankEmailError: false,
    usernameExistsError: false,
    emailExistsError: false,
    openDialog: 'none',
    openLogin: false,
    openSignUp: false,
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
      signupUsername: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupEmail: '',
      blankPasswordError: false,
      blankConfirmPasswordError: false,
      passwordMatchError: false,
      blankEmailError: false,
      usernameExistsError: false,
      emailExistsError: false,
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

  render() {
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
        onChange={(e) => { 
          this.setState({ 
            signupUsername: e.target.value 
          }) 
        }}
      />, <br />,
      <TextField
        floatingLabelText='New Password'
        floatingLabelFixed={true}
        type='password'
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { 
          this.setState({ 
            signupPassword: e.target.value 
          }) 
        }}
      />,
      <TextField
        floatingLabelText='Confirm Password'
        floatingLabelFixed={true}
        type='password'
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        fullWidth={true}
        onChange={(e) => { 
          this.setState({ 
            signupConfirmPassword: e.target.value 
          }) 
        }}
      />,
      <TextField
        floatingLabelText='Email'
        floatingLabelFixed={true}
        underlineFocusStyle={{ borderColor: 'black' }}
        floatingLabelStyle={{ color: 'black' }}
        type='text'
        fullWidth={true}
        onChange={(e) => { 
          this.setState({ 
            signupEmail: e.target.value 
          }) 
        }}
      />,
      <FlatButton
        label='Cancel'
        color={fullBlack}
        onClick={(e) => { 
          this.handleClose('openSignUp'); 
          this.clearUserInput();
        }}
      />,
      <FlatButton
        label='Submit'
        color={fullBlack}
        keyboardFocused={true}
        onClick={(e) => { 
          e.preventDefault(); 
          this.submitSignUp(this.state.signupUsername, this.state.signupPassword, this.state.signupConfirmPassword, this.state.signupEmail) 
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
          onRequestClose={(e) => { 
            this.handleClose('openSignUp'); 
            this.clearUserInput() 
          }}
        />
      </span>
    )
  }
}
export default SignUp;