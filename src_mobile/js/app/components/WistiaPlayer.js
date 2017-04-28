import React from 'react'
import WistiaFrame from 'WistiaFrame'
import BaseComponent from 'BaseComponent'
import Utils from 'Utils'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import dom from 'domquery'

export default class WistiaPlayer extends BaseComponent {
	constructor(props) {
		super(props)
		this.wistiaPlayerId = 'wistia_' + props.videoId
		this.isPlaying = false
		this.yPos = 0
		this.onClick = this.onClick.bind(this)
	}
	render() {
		return (
			<div id='wistia-player' ref='wistia-player'>
				<div className="play-btn">PLAY</div>
				<div className="top-wrapper"></div>
				<WistiaFrame ref='wistia-frame' id={this.wistiaPlayerId} {...this.props} />
			</div>
		)
	}
	onClick(e) {
		e.preventDefault()
		if(this.isPlaying) {
			this.pause()
		}else{
			this.play()
		}
	}
	play() {
		if(this.isPlaying) return
		this.isPlaying = true
		this.player.play()
	}
	pause() {
		if(!this.isPlaying) return
		this.isPlaying = false
		this.player.pause()
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['wistia-player'])
		this.playerDom = React.findDOMNode(this.refs['wistia-frame'])
		this.playBtn = dom(this.parent).select('.play-btn')
		this.player = Wistia.embed(this.props.videoId)
		dom(this.parent).on('click', this.onClick)
		this.props.player = this
		if(this.props.className != undefined) this.classNames = this.props.className.split(' ')
		else this.classNames = ''
		this.player.volume(0)
		this.player.ready(()=>{
			if(this.props.didReady != undefined) this.props.didReady(this)
		})
	}
	componentWillUnmount() {
		this.player.remove()
		dom(this.parent).off('click', this.onClick)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var asset = this.player.data.asset
		if(asset == undefined) return
		var contentW = asset.width
		var contentH = asset.height

		windowW = windowW
		windowH = 0

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
		this.yPos = $(this.parent).offset().top
		this.height = resizeVals.height
	}
}
