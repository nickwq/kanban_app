import App from './components/App.jsx';
import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';
import ReactDOM from 'react-dom';
import React from 'react';

//var app = document.createElement('div');
//
//document.body.appendChild(app);
//app.appendChild(component());
persist(alt, storage, 'app');

ReactDOM.render(<App />, document.getElementById('app'));