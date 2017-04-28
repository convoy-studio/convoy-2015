import React from 'react'
import moment from 'moment-timezone'

export default class CityTime extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			time: ''
		}
		this.updateTime = this.updateTime.bind(this)
	}
	render() {
		return (
			<div ref='weather-title' className="title">PARIS {this.state.time}</div>
		)
	}
	componentDidMount() {
		this.updateTime()
		this.intervalId = setInterval(this.updateTime, 10000)
	}
	updateTime() {
		var zone = "Europe/Paris";
		var d = new Date();
		var time = moment.tz(d, zone).format('h:mm a');
		this.setState({
			time: time
		})
	}
	toDigitsTime(val) {
		return (val.length == 1) ? '0' + val : val
	}
	componentWillUnmount() {
		clearInterval(this.intervalId)
	}
}
