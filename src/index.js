import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/shared/header';
import Pickems from './components/pickems';
import PickemsWeekly from './components/pickemsWeekly';
import withAuth from './components/shared/withAuth';
import Home from './components/home';
import Page from './components/shared/page';
import Leaderboard from './components/leaderboard';

ReactDOM.render(
    <Router>
        <div>
            <Route path='/' component={Header} />
            <Switch>
                <Route
                    exact
                    path='/'
                    render={(props) => (
                        <Page {...props} component={Home} title={'Home - League of Goons'} />
                    )}
                />
                <Route path='/login' component={Login} />
                <Route
                    exact
                    path='/pickems'
                    render={(props) => (
                        <Page {...props} component={withAuth(Pickems)} title={'Pick\'ems - League of Goons'} />
                    )}
                />
                <Route
                    exact
                    path='/pickems/week'
                    render={(props) => (
                        <Page {...props} component={withAuth(PickemsWeekly)} title={'Weekly Pick\'ems - League of Goons'} />
                    )}
                />
                <Route
                    exact
                    path='/leaderboard'
                    render={(props) => (
                        <Page {...props} component={withAuth(Leaderboard)} title={'Leaderboard - League of Goons'} />
                    )}
                />
            </Switch>
        </div>
    </Router>, document.getElementById('root'));