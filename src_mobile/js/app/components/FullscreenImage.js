import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import Utils from 'Utils'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import Img from 'Img'

export default class FullscreenImage extends BaseComponent {
	constructor(props) {
		super(props)
	}
	render() {
		var imgurl = this.props.imgurl
		return (
			<div id='fullscreen-content-wrapper' ref='fullscreen-content-wrapper'>
				<Img ref='fullscreenBg' {...this.props} src={imgurl} />
			</div>
		)
	}
	componentDidMount() {
		this.fullscreenBg = React.findDOMNode(this.refs.fullscreenBg)
		this.fullscreenContentWrapper = React.findDOMNode(this.refs['fullscreen-content-wrapper'])
	}
	resize(wW, wH, contW, contH) {
		var windowW = wW || AppStore.Window.w
		var windowH = wH || AppStore.Window.h
		var contentW = contW || AppConstants.MEDIA_GLOBAL_W
		var contentH = contH || AppConstants.MEDIA_GLOBAL_H
		var resizeVals = Utils.ResizePositionProportionally(windowW, windowH, contentW, contentH)

		dom(this.fullscreenBg).style({
			width: resizeVals.width + 'px',
			height: resizeVals.height + 'px',
			left: resizeVals.left + 'px',
			top: resizeVals.top + 'px'	
		})

		dom(this.fullscreenContentWrapper).style({
			width: windowW + 'px',
			height: windowH + 'px',
		})
	}
}
