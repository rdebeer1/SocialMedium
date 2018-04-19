import React, { Component } from 'react';

class Artists extends Component {
  render () {
    const styles = {
      artistFlex: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        flex: 1,
      },
      artistDiv: {
        flex: 1
      },
      artist: {
        marginTop: '.25em',
        fontSize: '1.25em',
        color: 'black',
        cursor: 'default',
        fontWeight: '300',
      }
    }
    const { artist } = this.props
    return (
      <div style={styles.artistFlex}>
        {
        artist.map((artists, key) => 
        <div key={'artists' + key} style={styles.artistDiv}>
          <span style={styles.artist}>{artists}</span>
        </div>
          )
        }
      </div>
    )
  }
}

export default Artists;