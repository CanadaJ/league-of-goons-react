import React, { Component } from 'react';
import WeekSelector from '../shared/weekSelector';

class PickemsContainer extends Component {
    state = {
        week: 1
    }

    changeWeek = (week) => {
        if (week === this.state.week) return false;

        console.log('new week:', week);
        this.setState({ week });
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className='jumbotron-center-compact'>
                <h1>Test</h1>
                <WeekSelector changeWeek={this.changeWeek} />
            </div>
        );
    }
}

export default PickemsContainer;