import React, { Component } from 'react';

class PickemsAdmin extends Component {
    state = {
        week: 1,
        matchups: []
    }

    componentDidMount() {
        this.setState({ loading: false });
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

    doUpdateMatchup = (e, matchup, idTeam) => {
        e.persist();

        this.props.updateMatchup(matchup, idTeam);
    }

    buildPickemRows() {
        if (this.props.matchups) {
            return this.props.matchups.map((matchup, idx) => this.buildPickemRow(matchup, idx));
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
        if (this.props.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
            <div className='pickems-area'>
                <div className='pickem-week'>
                    <a href={`/pickems/week/#week${this.props.week}/`}>WEEK {this.props.week}</a>
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