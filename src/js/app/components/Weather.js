import React from 'react'
import Img from 'Img'

export default class Weather extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			degrees: 10,
			currentlyDesc: '',
			imgUrl: ''
		};
		this.onWeatherReady = this.onWeatherReady.bind(this)
	}
	render() {
		return (
			<div ref='weather-subtitle' className="subtitle">
				{this.state.degrees}º {this.state.currentlyDesc}
				<Img didLoad={this.props.didLoad} src={this.state.imgUrl} />
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['weather-subtitle'])
		$.simpleWeather({
			location: 'Paris, FR',
			woeid: '',
			unit: 'c',
			success: this.onWeatherReady,
			error: this.props.onError
		})
	}
	onWeatherReady(weather) {
		var imgName = this.getImageNameByCode(parseInt(weather.code))
		this.setState({
			degrees: weather.temp,
			currentlyDesc: weather.currently,
			imgUrl: 'image/weather/' + imgName + '.gif'
		})
	}
	getImageNameByCode(code) {
		var imgName;
		switch(code) {
			case 11:
			case 35:
				imgName = 'rain_two'
				break
			case 12:
				imgName = 'rain'
				break
			case 5:
			case 6:
			case 14:
				imgName = 'rain_snow'
				break
			case 7:
			case 13:
			case 15:
			case 16:
			case 41:
			case 42:
			case 43:
			case 46:
				imgName = 'rain_snow_medium'
				break
			case 37:
			case 38:
			case 39:
			case 45:
			case 47:
			case 4:
			case 3:
			case 1:
				imgName = 'storm'
				break
			case 26:
			case 28:
			case 30:
			case 44:
			case 20:
				imgName = 'clouds'
				break
			case 32:
				imgName = 'sunny_two'
				break
			case 36:
			case 34:
				imgName = 'sunny'
				break
			case 31:
			case 33:
			case 29:
			case 27:
				imgName = 'night'
				break
			case 8:
			case 9:
			case 10:
				imgName = 'weather_ice'
				break
			default:
				imgName = 'weather_null'
				break
		}
		return imgName
	}
}
