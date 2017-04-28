import React from 'react'
import BaseComponent from 'BaseComponent'
import dom from 'domquery'
import size from 'element-size'
import AppConstants from 'AppConstants'

export default class TextBtn extends BaseComponent {
	render() {
		return (
			<div className='text-btn btn' ref='parent' onClick={this.props.clickCallback} id={this.props.id}>
				<div className="inside-wrapper">
					<div className="text-title">{this.props.title}</div>
					<div className="rects-container">
						<div className="bg-line"></div>
						<div className="bg-box"></div>
						<div className="bg-line"></div>
					</div>
					<div className="rects-container">
						<div className="bg-line"></div>
						<div className="bg-box"></div>
						<div className="bg-line"></div>
					</div>
				</div>
				<div className="background"></div>
			</div>
		)
	}
	componentDidMount() {
		this.mouseEnter = this.mouseEnter.bind(this)
		this.mouseLeave = this.mouseLeave.bind(this)

		this.parent = React.findDOMNode(this.refs['parent'])
		if(!this.props['no-mouseevents']) {
			dom(this.parent).on('mouseenter', this.mouseEnter)
			dom(this.parent).on('mouseleave', this.mouseLeave)
		}

		var rectContainers = dom(this.parent).select('.rects-container')
		var bgLinesLeft = dom(rectContainers[0]).select('.bg-line')
		var bgBoxLeft = dom(rectContainers[0]).select('.bg-box')
		var bgLinesRight = dom(rectContainers[1]).select('.bg-line')
		var bgBoxRight = dom(rectContainers[1]).select('.bg-box')
		
		var offsetX = 26
		this.tlLeft = new TimelineMax()
		this.tlLeft.fromTo(bgLinesLeft[0], 1, { scaleX:0, transformOrigin:'0% 50%' }, { scaleX:1, transformOrigin:'0% 50%', ease:Expo.easeInOut }, 0)
		this.tlLeft.fromTo(bgBoxLeft, 1, { scaleX:0, transformOrigin:'0% 50%' }, { scaleX:1, transformOrigin:'0% 50%', ease:Expo.easeInOut }, 0.2)
		this.tlLeft.fromTo(bgLinesLeft[1], 1, { scaleX:0, transformOrigin:'0% 50%' }, { scaleX:1, transformOrigin:'0% 50%', ease:Expo.easeInOut }, 0.4)
		this.tlLeft.to(bgLinesLeft[0], 1, { x:'100%', transformOrigin:'0% 50%', ease:Expo.easeInOut }, 0.5)
		this.tlLeft.to(bgBoxLeft, 1, { x:'100%', transformOrigin:'0% 50%', ease:Expo.easeInOut }, 0.6)
		this.tlLeft.addLabel('in')
		this.tlLeft.to(bgLinesLeft[1], 1, { x:'100%', transformOrigin:'0% 50%', ease:Expo.easeInOut }, 'in')
		this.tlLeft.addLabel('out')
		this.tlLeft.pause(0)

		this.tlRight = new TimelineMax()
		this.tlRight.fromTo(bgLinesRight[0], 1, { scaleX:0, transformOrigin:'100% 50%' }, { scaleX:1, transformOrigin:'100% 50%', ease:Expo.easeInOut }, 0)
		this.tlRight.fromTo(bgBoxRight, 1, { scaleX:0, transformOrigin:'100% 50%' }, { scaleX:1, transformOrigin:'100% 50%', ease:Expo.easeInOut }, 0.2)
		this.tlRight.fromTo(bgLinesRight[1], 1, { scaleX:0, transformOrigin:'100% 50%' }, { scaleX:1, transformOrigin:'100% 50%', ease:Expo.easeInOut }, 0.4)
		this.tlRight.to(bgLinesRight[0], 1, { x:'-100%', transformOrigin:'100% 50%', ease:Expo.easeInOut }, 0.5)
		this.tlRight.to(bgBoxRight, 1, { x:'-100%', transformOrigin:'100% 50%', ease:Expo.easeInOut }, 0.6)
		this.tlRight.addLabel('in')
		this.tlRight.to(bgLinesRight[1], 1, { x:'-100%', transformOrigin:'100% 50%', ease:Expo.easeInOut }, 'in')
		this.tlRight.addLabel('out')
		this.tlRight.pause(0)
	}
	mouseEnter(e) {
		e.preventDefault()
		if(this.props.mouseEnterCallback != undefined) this.props.mouseEnterCallback()
		var rect = e.currentTarget.getBoundingClientRect();
		var xMousePos = e.clientX
		var xPos = xMousePos - rect.left
		var w = rect.right - rect.left
		if(xPos > w / 2) {
			this.tweenIn(AppConstants.RIGHT)
		}else{
			this.tweenIn(AppConstants.LEFT)
		}
	}
	mouseLeave(e) {
		e.preventDefault()
		this.tweenOut()
	}
	tweenIn(direction) {
		if(direction == AppConstants.LEFT) {
			this.currentTl = this.tlLeft
			this.tlLeft.timeScale(1.6).tweenFromTo(0, 'in')
		}else{	
			this.currentTl = this.tlRight
			this.tlRight.timeScale(1.6).tweenFromTo(0, 'in')
		}
	}
	tweenOut() {
		this.currentTl.timeScale(1.6).tweenTo('out')
	}
	changeColor(color) {
		var bgLines = dom(this.parent).select('.bg-line')
		var bgBox = dom(this.parent).select('.bg-box')
		TweenLite.set(this.parent, { color:color })
		TweenLite.set(bgLines, { backgroundColor:color })
		TweenLite.set(bgBox, { backgroundColor:color })
	}
	componentWillUnmount() {
		if(!this.props['no-mouseevents']) {
			dom(this.parent).off('mouseenter', this.mouseEnter)
			dom(this.parent).off('mouseleave', this.mouseLeave)
		}
		this.tlLeft.clear()
		this.tlRight.clear()
	}
}
