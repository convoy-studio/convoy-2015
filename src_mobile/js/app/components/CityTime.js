import React from 'react'

export default class CityTime extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hours: '00',
			minutes: '00',
		}
		this.updateTime = this.updateTime.bind(this)
	}
	render() {
		return (
			<div ref='weather-title' className="title">PARIS {this.state.hours}:{this.state.minutes}</div>
		)
	}
	calcTime(city, offset) {
	    var d = new Date();
	    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
	    var nd = new Date(utc + (3600000*offset));
	    return nd;
	}
	componentDidMount() {
		this.updateTime()
		this.intervalId = setInterval(this.updateTime, 10000)
	}
	updateTime() {
		var time = this.calcTime('Paris', '-1.0')
		var hours = this.toDigitsTime(time.getHours().toString()) 
		var minutes = this.toDigitsTime(time.getMinutes().toString()) 
		this.setState({
			hours: hours,
			minutes: minutes
		})
	}
	toDigitsTime(val) {
		return (val.length == 1) ? '0' + val : val
	}
	componentWillUnmount() {
		clearInterval(this.intervalId)
	}
}
