import React, { Component } from 'react';

class WeekSelector extends Component {
    renderWeekLinks = () => {
        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22];

        return weeks.map((week) => {
            if (week <= 17) return (<a key={`week-link-${week}`} className='week-link' onClick={() => this.props.changeWeek(week)}>Week {week}</a>);

            if (week === 18) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.props.changeWeek(week)}>Wild Card</a>;
            if (week === 19) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.props.changeWeek(week)}>Divisional</a>;
            if (week === 20) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.props.changeWeek(week)}>Conference</a>;
            if (week === 22) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.props.changeWeek(week)}>Super Bowl</a>;
        });
    }

    render() {
        return (
            <div className='controls-container'>
                {this.renderWeekLinks()}
            </div>
        );
    }
}

export default WeekSelector;