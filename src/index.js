import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/shared/header';
import PickemsWeekly from './components/pickemsWeekly';
import withAuth from './components/shared/withAuth';
import Home from './components/home';
import Page from './components/shared/page';
import Leaderboard from './components/leaderboard';
import PickemsAdmin from './components/admin/pickemsAdmin';
import PickemsContainer from './components/shared/pickemsContainer';
import MatchupsAdmin from './components/admin/matchupsAdmin';

ReactDOM.render(
    <Router>
        <div>
            <Route path='/' component={withAuth(Header)} />
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
                        <Page {...props} component={withAuth(PickemsContainer)} title={'Pick\'ems - League of Goons'} />
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
                <Route
                    exact
                    path='/admin/pickems'
                    render={(props) => (
                        <Page {...props} component={withAuth(PickemsAdmin)} title={'Pick\'ems Admin - League of Goons'} />
                    )}
                />
                <Route
                    exact
                    path='/admin/matchups'
                    render={(props) => (
                        <Page {...props} component={withAuth(MatchupsAdmin)} title={'Matchups Admin - League of Goons'} />
                    )}
                />
            </Switch>
        </div>
    </Router>, document.getElementById('root'));