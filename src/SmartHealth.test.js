import React from 'react';
import ReactDOM from 'react-dom';
import SmartHealth from './SmartHealth';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SmartHealth />, div);
  ReactDOM.unmountComponentAtNode(div);
});
