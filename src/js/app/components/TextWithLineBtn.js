import React from 'react'
import BaseComponent from 'BaseComponent'
import dom from 'domquery'
import TextBtn from 'TextBtn'

export default class TextWithLineBtn extends BaseComponent {
	render() {
		return (
			<div className='text-with-line-btn' ref='parent'>
				<TextBtn ref='text-btn' id={this.props.text} title={this.props.text} />
				<div className="bottom-line"></div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['parent'])
		var btnLine = dom(this.parent).select('.bottom-line')[0]
		dom(btnLine).style({
			'background-color': this.props.ambientColor
		})
	}
	willChangeAmbient(color) {
		this.refs['text-btn'].changeColor(color)
	}
}
