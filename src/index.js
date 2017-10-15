import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AutorBox from './autor';
import LivroBox from './Livro';
import Home from './Home';
import {BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';


import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    (
      <Router>
        <App>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/autor" component={AutorBox}/>
              <Route path="/livro" component={LivroBox}/>
           </Switch>
        </App>
      </Router>
    ),
    document.getElementById('root')
  );
  registerServiceWorker();
