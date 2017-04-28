import React from 'react'
import AppStore from 'AppStore'
import dom from 'domquery'
import Utils from 'Utils'

export default class SplitTitle extends React.Component {
	render() {
		return (
			<div ref='split-title' className='title btn'>
				<div className="title-wrapper">
					{this.props.title}
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['split-title'])
		var title = dom(this.parent).select('.title-wrapper')[0]

		var splitLetters = new SplitText(this.parent, {type:"lines"})
		this.tweenIn = new TimelineMax()
		this.tweenIn.staggerFromTo(splitLetters.lines, 1, { scaleY:1, scaleX:1, opacity:1, transformOrigin:'50% 50%' }, { scaleY:1.8, scaleX:2, opacity:0, transformOrigin:'50% 50%', ease:Expo.easeInOut, force3D:true }, 0, 0)

		this.tweenOut = new TimelineMax()
		this.tweenOut.staggerTo(splitLetters.lines, 1, { scaleY:1, scaleX:1, opacity:1, force3D:true, transformOrigin:'50% 50%', ease:Expo.easeInOut }, 0, 0)
	}
	componentWillUnmount() {
		this.tweenIn.clear()	
		this.tweenOut.clear()	
	}
}