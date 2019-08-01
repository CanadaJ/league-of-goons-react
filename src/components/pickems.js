import React, { Component } from 'react';

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

        fetch(`/api/pickems/week/${week}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    pickCounts: data.pickCounts,
                    pickems: data.userPicks,
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

        if (!pickem.canupdate || pickem.idpickteam === idTeam) {
            return false;
        }

        fetch('/api/pickems/update/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idMatchup: pickem.idmatchup,
                idUser: this.props.idUser,
                idTeam: idTeam
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updatePickems(this.state.week);
            }
        });
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

        return (
            <div key={`matchup-${pickem.idmatchup}`} className={`${rowClassName} ${!pickem.canupdate ? 'is-locked' : ''}`}>
                <div className={`${pickemComplete ? 'pickem-complete' : 'pickem-time'} ${pickemComplete && pickWasCorrect ? 'is-correct' : ''} ${pickemComplete && !pickWasCorrect ? 'is-incorrect' : ''}`}>
                    {pickemComplete &&
                        <i className='material-icons pick-icon'>{pickWasCorrect ? 'check' : 'close'}</i>}
                    {!pickemComplete &&
                        <div className='pickem-time'>{this.formatDate(pickem.gametime)}</div>}
                </div>
                <div onClick={(e) => this.doUpdatePickem(e, pickem, pickem.idawayteam)} className={`pickem-team ${!pickem.canupdate ? 'is-locked' : ''} ${pickem.idpickteam === pickem.idawayteam ? 'is-selected' : ''} ${pickemComplete && (pickem.idpickteam === pickem.winner || pickem.istie) ? 'is-winner' :  pickemComplete ? 'is-loser' : ''}`}>
                        {pickem.away}
                </div>
                <div onClick={(e) => this.doUpdatePickem(e, pickem, pickem.idhometeam)} className={`pickem-team ${!pickem.canupdate ? 'is-locked' : ''} ${pickem.idpickteam === pickem.idhometeam ? 'is-selected' : ''} ${pickemComplete && (pickem.idpickteam === pickem.winner || pickem.istie) ? 'is-winner' :  pickemComplete ? 'is-loser' : ''}`}>
                        {pickem.home}
                </div>
            </div>
        );
    }

    formatWeekName = (week) =>
    {
        if (week <= 17) return `Week ${week}`;

        if (week === 18) return 'Wild Card';
        if (week === 19) return 'Divisional';
        if (week === 20) return 'Conference';
        if (week === 22) return 'Super Bowl';
    }

    render() {
        const pickCounts = this.state.pickCounts;

        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22];

        const WeekLink = (week) => {
            if (week <= 17) return (<a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Week {week}</a>);

            if (week === 18) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Wild Card</a>;
            if (week === 19) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Divisional</a>;
            if (week === 20) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Conference</a>;
            if (week === 22) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Super Bowl</a>;
        };

        if (this.state.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
            <div className='jumbotron-center-compact'>
                <h1>League of Goons Pick'ems ({this.formatWeekName(this.state.week)})</h1>
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
            </div>
        );
    }
}

export default Pickems;