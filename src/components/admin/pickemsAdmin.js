import React, { Component } from 'react';
import WeekSelector from '../shared/weekSelector';

class PickemsAdmin extends Component {
    state = {
        week: 1,
        matchups: []
    }

    componentDidMount() {
        this.getMatchups(this.state.week);
    }

    changeWeek = (week) => {
        if (week === this.state.week) return false;

        this.getMatchups(week);
    }

    getMatchups = (week) => {
        this.setState({ loading: true });

        fetch(`/api/admin/pickems/week/${week}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    matchups: data.matchups,
                    week: parseInt(week),
                    loading: false
                });
            });
    }

    formatDate(date) {
        date = new Date(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const meridian = hours >= 12 ? 'PM' : 'AM';

        if (hours > 12) hours = hours - 12;
        if (minutes.toString().length === 1) minutes = '0' + minutes.toString();

        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + meridian;
    }

    doUpdateMatchup = (matchup, idTeam) => {
        if (matchup.winner === idTeam) {
            return false;
        }

        fetch('/api/admin/setmatchupwinner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idMatchup: matchup.idMatchup,
                winner: idTeam
            })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                this.getMatchups(this.state.week);
            }
        });
    }

    buildMatchupRows() {
        if (this.state.matchups) {
            return this.state.matchups.map((matchup, idx) => this.buildMatchupRow(matchup, idx));
        }
    }

    buildMatchupRow(pickem, idx) {

        const rowClassName = idx % 2 === 1 ? 'pickem' : 'pickem-alt';

        return (
            <div key={`matchup-${pickem.idMatchup}`} className={`${rowClassName}`}>
                <div className='pickem-time'>
                    <div className='pickem-time'>{this.formatDate(pickem.gameTime)}</div>
                </div>
                <div
                    onClick={(e) => this.doUpdateMatchup(pickem, pickem.awayTeam)}
                    className={`pickem-team admin ${pickem.awayTeam === pickem.winner || pickem.isTie ? 'is-winner' : ''}`}
                >
                        {pickem.awayName}
                </div>
                <div
                    onClick={(e) => this.doUpdateMatchup(pickem, pickem.homeTeam)}
                    className={`pickem-team admin ${pickem.homeTeam === pickem.winner || pickem.isTie ? 'is-winner' : ''}`}
                >
                        {pickem.homeName}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
            <div className='jumbotron-center-compact'>
                <h1>League of Goons Pick'ems Admin</h1>
                <WeekSelector changeWeek={this.changeWeek} />
                <div className='pickems-area'>
                    <div className='pickem-week'>
                        <a href={`/pickems/week/#week${this.state.week}/`}>WEEK {this.state.week}</a>
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
                    {this.buildMatchupRows()}
                </div>
            </div>
        );
    }
}

export default PickemsAdmin;