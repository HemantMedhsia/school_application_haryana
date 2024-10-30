// MobileWarning.js
import React from 'react';
import ved from '../Mobile/mobilemsg.mp4'

const MobileWarning = () => (
  <div style={styles.container}>
    <video style={styles.video} autoPlay loop muted>
      <source src={ved} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default MobileWarning;
