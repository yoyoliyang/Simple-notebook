import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


document.title = 'Simple notebook'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

