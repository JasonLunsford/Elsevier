import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SmartHealth from './SmartHealth';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SmartHealth />, document.getElementById('root'));
registerServiceWorker();
