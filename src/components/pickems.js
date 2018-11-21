import React, { Component } from 'react';
import Header from './shared/header';

class Pickems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            week: 1
        };
        
    }

    componentDidMount() {
        this.updatePickems(this.state.week);
    }

    updatePickems(week) {
        var hashValue = window.location.hash ? window.location.hash.substr(1) : '';

        if (hashValue) {
            // go get the data for the week # in the hash
            return;
        }

        fetch(`/api/pickems/week/${week}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                this.setState({
                    pickCounts: data.pickCounts,
                    pickems: data.userPicks,
                    week: week,
                    loading: false
                });
            });
    }

    formatDate(date) {
        date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var meridian = hours >= 12 ? 'PM' : 'AM';

        if (hours > 12) hours = hours - 12;
        if (minutes.toString().length === 1) minutes = '0' + minutes.toString();

        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + meridian;
    }

    changeWeek(week) {
        console.log(week);

        this.setState({
            loading: true
        });

        this.updatePickems(week);
    }

    buildPickemRows() {
        if (this.state.pickems) {
            return this.state.pickems.map((pickem, idx) => this.buildPickemRow(pickem, idx));
        }
    }

    buildPickemRow(pickem, idx) {

        const rowClassName = idx % 2 === 1 ? 'pickem' : 'pickem-alt';
        const pickemComplete = pickem.winner || pickem.istie;
        const pickWasCorrect = pickem.istie || (pickem.winner && pickem.winner === pickem.idpickteam);

        const homeWinner = pickem.winner && pickem.winner === pickem.idhometeam;
        const awayWinner = pickem.winner && pickem.winner === pickem.idawayteam;

        return (
            <div key={`matchup-${pickem.idmatchup}`} className={`${rowClassName} ${!pickem.canupdate ? 'is-locked' : ''}`}>
                <div className={`${pickemComplete ? 'pickem-complete' : 'pickem-time'} ${pickemComplete && pickWasCorrect ? 'is-correct' : ''} ${pickemComplete && !pickWasCorrect ? 'is-incorrect' : ''}`}>
                    {pickemComplete &&
                        <i className='material-icons pick-icon'>{pickWasCorrect ? 'check' : 'close'}</i>}
                    {!pickemComplete &&
                        <div className='pickem-time'>{this.formatDate(pickem.gametime)}</div>}
                </div>
                <div className={`pickem-team ${!pickem.canupdate ? 'is-locked' : ''} ${pickem.idpickteam === pickem.idawayteam ? 'is-selected' : ''} ${pickemComplete && pickem.idpickteam === pickem.winner ? 'is-winner' :  pickemComplete ? 'is-loser' : ''}`}>
                        {pickem.away}
                </div>
                <div className={`pickem-team ${!pickem.canupdate ? 'is-locked' : ''} ${pickem.idpickteam === pickem.idhometeam ? 'is-selected' : ''} ${pickemComplete && pickem.idpickteam === pickem.winner ? 'is-winner' :  pickemComplete ? 'is-loser' : ''}`}>
                        {pickem.home}
                </div>
            </div>
        );
    }

    render() {
        const pickCounts = this.state.pickCounts;

        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        const WeekLink = (week) => (
            <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Week {week}</a>
        );

        if (this.state.loading) {
            return <div className="loading">Loading&#8230;</div>;
        }

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