import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './shared/header';

class Pickems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
        
    }

    componentDidMount() {
        var hashValue = window.location.hash ? window.location.hash.substr(1) : '';

        if (hashValue) {
            // go get the data for the week # in the hash
            return;
        }

        // this.setState(this.state = {
        //     week: 1,
        //     loading: false,
        //     pickems: [{
        //         winner: 1,
        //         istie: 0,
        //         idpickteam: 1,
        //         canupdate: 0,
        //         gametime: new Date()
        //     },{
        //         winner: 2,
        //         istie: 0,
        //         idpickteam: 1,
        //         canupdate: 0,
        //         gametime: new Date()
        //     },{
        //         winner: 1,
        //         istie: 1,
        //         idpickteam: 2,
        //         canupdate: 0,
        //         gametime: new Date()
        //     },{
        //         winner: 0,
        //         istie: 0,
        //         idpickteam: 1,
        //         canupdate: 1,
        //         gametime: new Date()
        //     },]
        // });
    }

    formatDate(date) {
        console.log(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var meridian = hours >= 12 ? 'PM' : 'AM';

        if (hours > 12) hours = hours - 12;
        if (minutes.toString().length === 1) minutes = '0' + minutes.toString();

        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + meridian;
    }

    changeWeek(week) {
        this.setState({
            week: week
        });
    }

    buildPickemRows() {
        if (this.state.loading) {
            return <div className="loading">Loading&#8230;</div>;
        }

        return this.state.pickems.map((pickem, idx) => this.buildPickemRow(pickem, idx));
    }

    buildPickemRow(pickem, idx) {

        const rowClassName = idx % 2 === 1 ? 'pickem' : 'pickem-alt';
        const pickemComplete = pickem.winner || pickem.istie;
        const pickWasCorrect = pickem.istie || (pickem.winner && pickem.winner === pickem.idpickteam);

        return (
            <div className={`${rowClassName} ${!pickem.canupdate ? 'is-locked' : ''}`}>
                <div className={`${pickemComplete ? 'pickem-complete' : 'pickem-time'} ${pickemComplete && pickWasCorrect ? 'is-correct' : ''} ${pickemComplete && !pickWasCorrect ? 'is-incorrect' : ''}`}>
                    {pickemComplete &&
                        <i className='material-icons pick-icon'>{pickWasCorrect ? 'check' : 'close'}</i>}
                    {!pickemComplete &&
                        <div className='pickem-time'>{this.formatDate(pickem.gametime)}</div>}
                </div>
            </div>
        );
    }

    render() {
        const pickCounts = {
            correct: 100,
            incorrect: 50
        };

        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        const WeekLink = (week) => (
            <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Week {week}</a>
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
                            <div className='pickem-counts'>
                                <div>
                                    Correct: <span className='pickem-counts-correct'>{pickCounts.correct}</span>
                                </div>
                                <div>
                                    Incorrect: <span className='pickem-counts-incorrect'>{pickCounts.incorrect}</span>
                                </div>
                            </div>
                            <div className='pickem-week'>
                                <a href={`/pickems/week/${this.state.week}/`}>WEEK {this.state.week}</a>
                            </div>
                            <div className='pickem-homeaway'>
                                <div className='pickem-timelabel'>
                                    Time
                                </div>
                                <div className='pickem-away'>
                                    Away
                                </div>
                                <div className='pickem-home'>
                                    Home
                                </div>
                            </div>
                            {this.buildPickemRows()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Pickems;