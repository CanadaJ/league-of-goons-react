import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/shared/header';
import Pickems from './components/pickems';
import withAuth from './components/shared/withAuth';
import Home from './components/home';

ReactDOM.render(
    <Router>
        <div>
            <Route path='/' component={Header} />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/login' component={Login} />
                <Route path='/pickems' component={withAuth(Pickems)} />
            </Switch>
        </div>
    </Router>, document.getElementById('root'));