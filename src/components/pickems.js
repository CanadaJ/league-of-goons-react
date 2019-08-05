import React,  { Component } from 'react';

class Pickems extends Component {
    state = {
        loading: true
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

    doUpdatePickem = (e, pickem, idTeam) => {
        e.persist();

        this.props.updatePickem(pickem, idTeam);
    }

    buildPickemRows() {
        if (this.props.pickems) {
            return this.props.pickems.map((pickem, idx) => this.buildPickemRow(pickem, idx));
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

    render() {
        const pickCounts = this.props.pickCounts;

        if (this.props.loading || this.state.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
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

export default Pickems;