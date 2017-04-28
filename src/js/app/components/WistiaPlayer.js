import React from 'react'
import WistiaFrame from 'WistiaFrame'
import BaseComponent from 'BaseComponent'
import Utils from 'Utils'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import dom from 'domquery'
import miniVideo from 'mini-video'

export default class WistiaPlayer extends BaseComponent {
	constructor(props) {
		super(props)
		this.wistiaPlayerId = 'wistia_' + props.videoId
		this.isPlaying = false
		this.yPos = 0
	}
	render() {
		return (
			<div id='wistia-player' ref='wistia-player'>
				{/*<WistiaFrame ref='wistia-frame' id={this.wistiaPlayerId} {...this.props} />*/}
			</div>
		)
	}
	play() {
		if(this.isPlaying) return
		this.player.play()
		this.isPlaying = true
	}
	pause() {
		if(!this.isPlaying) return
		this.player.pause()
		this.isPlaying = false
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['wistia-player'])

		this.player = miniVideo({
			autoplay: false,
			loop: true,
			volume: 0
		})
		this.player.addTo(this.parent)
		this.props.player = this
		this.player.load(this.props.videoId, ()=>{
			if(this.props.didReady != undefined) this.props.didReady(this)
			if(this.isPlaying) {
				this.player.play(0)
			}
		})

		this.playerDom = this.player.el
		if(this.props.className != undefined) this.classNames = this.props.className.split(' ')
		else this.classNames = ''
	}
	componentWillUnmount() {
		this.player.clear()
		this.player = null
	}
	resize(scrollPos) {

		if(!this.player.isLoaded) return

		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var size = this.player.size
		var contentW = size.width
		var contentH = size.height

		switch(this.props.type) {
			case AppConstants.HOMEPAGE:
				var resizeVals = Utils.ResizePositionProportionally(windowW, windowH, contentW, contentH)
				var w = (resizeVals.width)
				var h = (resizeVals.height)
				dom(this.parent).style({
					width: w + 'px',
					height: h + 'px',
				})
				dom(this.playerDom).style({
					position: 'absolute',
					top: resizeVals.top + 'px',
					left: resizeVals.left + 'px'
				})
				this.player.width(resizeVals.width)
				this.player.height(resizeVals.height)
				break
			case AppConstants.PROJECT:
				if(this.classNames[1] == 'medium') windowW = windowW * 0.8
				else windowW = windowW
				var resizeVals = Utils.ResizePositionProportionally(windowW, windowH, contentW, contentH, AppConstants.LANDSCAPE)
				var w = (resizeVals.width - 8)
				var h = (resizeVals.height - 10)
				dom(this.parent).style({
					width: w + 'px',
					height: h + 'px',
					left: (AppStore.Window.w >> 1) - (w >> 1) + 'px'
				})
				dom(this.playerDom).style({
					position: 'relative',
					width: resizeVals.width + 'px',
					height: resizeVals.height + 'px',
					top: -6 + 'px',
					left: -6 + 'px',
					margin: '0 auto'
				})
				this.player.width(resizeVals.width)
				this.player.height(resizeVals.height)
				this.yPos = $(this.parent).offset().top + scrollPos
				this.height = resizeVals.height
				break
			case AppConstants.HOME_COVER:
				dom(this.parent).style({
					width: '100%',
					height: '100%'
				})
				break
		}
		

	}
}
