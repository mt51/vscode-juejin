import React from 'react';
import ReactDOM from 'react-dom';
import Articles from './modules/articles';
import Github from './modules/github';
import './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <div className="app-container">
      <Articles />
      <Github />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
