import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/shared/header';
import Pickems from './components/pickems';
import PickemsWeekly from './components/pickemsWeekly';
import withAuth from './components/shared/withAuth';
import Home from './components/home';

ReactDOM.render(
    <Router>
        <div>
            <Route path='/' component={Header} />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/login' component={Login} />
                <Route exact path='/pickems' component={withAuth(Pickems)} />
                <Route exact path='/pickems/week' component={withAuth(PickemsWeekly)} />
            </Switch>
        </div>
    </Router>, document.getElementById('root'));