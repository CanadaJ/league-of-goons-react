import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './shared/header';

class Pickems extends Component {

    render() {
        const pickCounts = {
            correct: 100,
            incorrect: 50
        };

        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        const WeekLink = (week) => (
            <a key={`week-link-${week}`} className='week-link' href={`#week${week}`}>Week {week}</a>
        );

        return(
            <div>
                <div className='bg-image'></div>
                <div className='container full-page'>
                    <Header />
                    <div className='jumbotron-center-compact'>
                        <h1>League of Goons Pick'ems</h1>
                        <div className='controls-container'>
                            {weeks.map((week) => WeekLink(week))}
                        </div>
                        <div className='pickems-area'>
                            <div className='pickems-counts'>
                                <div>
                                    Correct: <span className='pickem-counts-correct'>{pickCounts.correct}</span>
                                </div>
                                <div>
                                    Incorrect: <span className='pickem-counts-incorrect'>{pickCounts.incorrect}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Pickems;