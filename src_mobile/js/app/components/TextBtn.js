import React from 'react'
import BaseComponent from 'BaseComponent'
import dom from 'domquery'
import size from 'element-size'

export default class TextBtn extends BaseComponent {
	render() {
		return (
			<div className='text-btn btn' ref='parent' onClick={this.props.clickCallback} id={this.props.id}>
				<div className="text-title">{this.props.title}</div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['parent'])
	}
	changeColor(color) {
	}
	componentWillUnmount() {
	}
}
