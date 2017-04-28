import React from 'react'
import TextBtn from 'TextBtn'
import dom from 'domquery'

export default class ConnectBtns extends React.Component {
	render() {
		return (
			<div id='connect-btns' ref='connect-btns'>
				<div className="btns-wrapper">
					<div className="socials-wrapper">
						<a target='_blank' href='https://twitter.com/convoystudio'><TextBtn ref='twitter-btn' id='twitter-btn' title='Twitter' /></a>
						<a target='_blank' href='https://www.instagram.com/convoystudio/'><TextBtn ref='instagram-btn' id='instagram-btn' title='instagram' /></a>
					</div>
					<TextBtn ref='main-title' id='main-title' no-mouseevents title='Connect' />
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['connect-btns'])
		var connectTitle = dom(this.parent).select('#main-title')[0]
		this.socialWrapper = dom(this.parent).select('.socials-wrapper')[0]
		this.btns = dom(this.socialWrapper).select('.text-btn')

		this.onMouseEnter = this.onMouseEnter.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)
		dom(this.parent).on('mouseenter', this.onMouseEnter)
		dom(this.parent).on('mouseleave', this.onMouseLeave)

		this.tl = new TimelineMax()
		this.tl.staggerFrom(this.btns, 1, { x:-20, opacity:0, ease:Expo.easeInOut }, 0.08, 0)
		this.tl.pause(0)

		this.width = connectTitle.offsetWidth
		this.height = connectTitle.offsetHeight
	}
	onMouseEnter(e) {
		e.preventDefault()
		this.tl.timeScale(1.4).play(0)
	}
	onMouseLeave(e) {
		e.preventDefault()
		this.tl.timeScale(1.8).reverse()
	}
	changeColor(color) {
		this.refs['main-title'].changeColor(color)
		this.refs['twitter-btn'].changeColor(color)
		this.refs['instagram-btn'].changeColor(color)
	}
}
