import React, { Component } from 'react';

class Logo extends Component {
  render () {
   const styles = {
      logoScroll: {
        overflow: 'auto',
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
      },
      logo: {
        textAlign: 'center',
        fontSize: '64px',
        color: 'black',
        flex: 1,
        marginBottom: '.5em'
      },
      logoImage: {
        height: 55,
        alignItems: 'center',
        marginTop: '.25em'
      }
    }
    return (
      <div style={styles.logoScroll}>
        <div style={styles.logo}>
          <div> Social Medium <img style={styles.logoImage} src='https://i.imgur.com/rkPGtDE.png' alt='' /></div>
        </div>
      </div>
    )
  }
}

export default Logo;