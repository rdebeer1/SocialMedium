import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

class Images extends Component {
  render () {
    const { images } = this.props
    
    const styles = {
    imgFlex: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      margin: 0,
    },  
    imgStyle: {
      maxHeight: '30vh',
      flex: 1,
      borderRadius: '1px 50px',
      },
      paperStyle: {
        alignItems: 'center',
        maxHeight: '30vh',
        marginLeft: '1em',
        marginRight: '1em',
        borderRadius: '1px 50px',
        marginBottom: '1em'
      }
    }

    return ( 
      <div style={styles.imgFlex}>
      {
      images.map((image, key) =>
        <div key={'image' + key}>
          <Paper zDepth={3} style={styles.paperStyle}>
            <img style={styles.imgStyle} src={image} alt="" className="img-responsive"/>
          </Paper>
        </div>
       )
      }
    </div>
    ) 
  }
}

export default Images;