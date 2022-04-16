import React from 'react';
import ReactDOM from 'react-dom';

import './backdrop.css';

const Backdrop = props => {
  return <div className="backdrop" onClick={props.onClick}></div>
};

export default Backdrop;
