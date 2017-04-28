import React from 'react'

export default class Img extends React.Component {
	render() {
		return (
			<img src={this.props.src}/>
		)
	}
	componentDidMount() {
		var img = new Image()
		img.onload = ()=> {
			if(this.props.didLoad != undefined) {
				this.props.size = [img.width, img.height]
				this.props.didLoad(this.props)
			}
		}
		img.src = this.props.src
	}
}
