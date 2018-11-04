import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Pickems from './components/pickems';

const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

const PickemsComponent = () => <Pickems />;

const AppRouter = () => (
  <Router>
    <div>
      <Route path='/' exact component={PickemsComponent} />
      <Route path='/about/' component={About} />
      <Route path='/users/' component={Users} />
    </div>
  </Router>
);

export default AppRouter;