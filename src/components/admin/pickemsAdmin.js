import React, { Component } from 'react';

class PickemsAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matchups: [],
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
            const rgx = new RegExp(/^week([0-9]+)/);

            if (rgx.test(hashValue)) {
                const weekHash = rgx.exec(hashValue)[1];

                if (weekHash && parseInt(weekHash) <= 22) {
                     week = weekHash;
                } else {
                    window.location.hash = `week${week}`;
                }
            }
        }

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

    changeWeek(week) {
        if (week === this.state.week) return false;

        window.location.hash = `week${week}`;
    }

    doUpdatePickem = (e, pickem, idTeam) => {
        e.persist();

        if (pickem.winner === idTeam) {
            return false;
        }

        fetch('/api/admin/setmatchupwinner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idMatchup: pickem.idMatchup,
                winner: idTeam
            })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                this.updatePickems(this.state.week);
            }
        });
    }

    buildPickemRows() {
        if (this.state.matchups) {
            return this.state.matchups.map((matchup, idx) => this.buildPickemRow(matchup, idx));
        }
    }

    buildPickemRow(pickem, idx) {

        const rowClassName = idx % 2 === 1 ? 'pickem' : 'pickem-alt';

        return (
            <div key={`matchup-${pickem.idMatchup}`} className={`${rowClassName}`}>
                <div className='pickem-time'>
                    <div className='pickem-time'>{this.formatDate(pickem.gameTime)}</div>
                </div>
                <div
                    onClick={(e) => this.doUpdatePickem(e, pickem, pickem.awayTeam)}
                    className={`pickem-team admin ${pickem.awayTeam === pickem.winner || pickem.isTie ? 'is-winner' : ''}`}
                >
                        {pickem.awayName}
                </div>
                <div
                    onClick={(e) => this.doUpdatePickem(e, pickem, pickem.homeTeam)}
                    className={`pickem-team admin ${pickem.homeTeam === pickem.winner || pickem.isTie ? 'is-winner' : ''}`}
                >
                        {pickem.homeName}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
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
                {this.buildPickemRows()}
            </div>
        );
    }
}

export default PickemsAdmin;