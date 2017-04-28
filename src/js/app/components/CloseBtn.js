import React from 'react'
import SVGComponent from 'SVGComponent'

export default class CloseBtn extends React.Component {
	render() {
		return (
			<div className='close-btn btn' onClick={this.props.didClick}>
				<SVGComponent width="100%" viewBox="0 0 35.422 35.422">
					<path id="circle" fill={this.props.ambientColor} d="M17.711,0.5C8.221,0.5,0.5,8.221,0.5,17.711s7.721,17.211,17.211,17.211s17.211-7.721,17.211-17.211
						S27.201,0.5,17.711,0.5z M17.711,33.367c-8.633,0-15.656-7.023-15.656-15.656S9.078,2.055,17.711,2.055s15.656,7.023,15.656,15.656
						S26.344,33.367,17.711,33.367z"/>
					<polygon id="close" fill={this.props.ambientColor} points="18.81,17.71 24.182,12.34 23.082,11.24 17.71,16.611 12.34,11.24 11.241,12.34 16.611,17.71 
						16.611,17.71 16.612,17.711 11.241,23.082 12.34,24.182 17.711,18.811 23.082,24.182 24.182,23.082 18.811,17.711 "/>
				</SVGComponent>
			</div>
		)
	}
}
