import React, { Component } from 'react'
import TextField from 'material-ui/TextField';
import { RaisedButton } from 'material-ui';

class Form extends Component {
  render() {
    const { getEvents } = this.props
    const { handleFormChange } = this.props
    
    const styles = {
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
        border: '1px solid black'
      },
    }
    return (
      <form style={styles.form} noValidate autoComplete='off'>
        <TextField style={styles.input} onChange={handleFormChange} type='text' id='serch' inputStyle={styles.input} underlineFocusStyle={{ borderColor: 'black' }} floatingLabelStyle={styles.input} underlineStyle={{ bottom: '4px', color: 'black' }} />
        <RaisedButton buttonStyle={styles.button} onClick={getEvents} label='Search by City' labelPosition='before' icon={<i style={{ color: 'black' }} className="material-icons">search</i>} />
      </form> 
    )
  }
}
export default Form;