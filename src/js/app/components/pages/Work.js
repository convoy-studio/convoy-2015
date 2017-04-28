import React from 'react'
import BaseComponent from 'BaseComponent'
import AppConstants from 'AppConstants'
import ProjectPageComponents from 'ProjectPageComponents'
import ViewSmoothScroll from 'ViewSmoothScroll'
import dom from 'domquery'
import AppStore from 'AppStore'

export default class Work extends BaseComponent {
	constructor(props) {
		super(props)
		this.imageDidLoad = this.imageDidLoad.bind(this)
		this.videoDidReady = this.videoDidReady.bind(this)
		this.fullscreenImages = []
		this.players = []
		this.slideshows = []
	}
	render() {
		this.id = this.props.data.id
		var componentsCollection = this.props.data.components.map((component, index)=>{
			var item;
			switch(component.type) {
				case AppConstants.COMPONENT.FULLSCREEN_IMAGE:
					item = ProjectPageComponents.getFullscreenImage(this.id, component, index, this.imageDidLoad)
					this.fullscreenImages.push(item)
					break
				case AppConstants.COMPONENT.PARAGRAPH:
					item = ProjectPageComponents.getParagraph(component, index, component.type)
					break
				case AppConstants.COMPONENT.EXTRA_MARGIN:
					item = ProjectPageComponents.getMargin(component, index, component.type)
					break
				case AppConstants.COMPONENT.TITLE_PARAGRAPH:
					item = ProjectPageComponents.getTitleParagraph(component, index, component.type)
					break
				case AppConstants.COMPONENT.VIDEO:
					item = ProjectPageComponents.getVideo(component, index, component.type, this.videoDidReady)
					this.players.push(item)
					break
				case AppConstants.COMPONENT.SLIDESHOW:
					item = ProjectPageComponents.getSlideshow(this.id, component, index, component.type, this.imageDidLoad)
					this.slideshows.push(item)
					break
				case AppConstants.COMPONENT.LINK:
					item = ProjectPageComponents.getLink(component, index, component.type)
					break
			}
			return (item)
		})
		return (
			<div id='work-page'>
				<div ref='padder'></div>
				{componentsCollection}
			</div>
		)
	}
	componentDidMount() {
		this.parentWrapper = this.props.parentWrapper
		this.padder = React.findDOMNode(this.refs['padder'])
		this.viewSmoothScroll = new ViewSmoothScroll(this.props.parentWrapper, this.props.scrollbarWrapper, this.props.data)
		this.viewSmoothScroll.componentDidMount()
	}
	videoDidReady(){
		this.resize()
	}
	imageDidLoad() {
		this.updateViewHeight()
	}
	updateViewHeight() {
		var wrapperHeight = $(this.parentWrapper).outerHeight(true)
		this.viewSmoothScroll.setViewHeight(wrapperHeight)
	}
	onWorkPageScrollTriggered(item) {
		var content = AppStore.workDataById(this.id)
		var color = content['ambient-color']
		if(item.type == AppConstants.TOP) {
			this.viewSmoothScroll.changeColor(color)
		}else{
			this.viewSmoothScroll.changeColor('#000')
		}
	}
	getCurrentScrollPagePosition() {
		return this.viewSmoothScroll.lastScrollY
	}
	setPadder(val) {
		dom(this.padder).style('height', val + (AppConstants.WORK_HEADER_PADDING >> 1) + 'px')
	}
	close() {
		this.viewSmoothScroll.componentWillUnmount()
	}
	update() {
		this.viewSmoothScroll.update()
		var windowH = AppStore.Window.h
		var scrollYPos = this.getCurrentScrollPagePosition()
		for (var i = 0; i < this.players.length; i++) {
			var player = this.players[i].props.player
			if(scrollYPos + windowH > player.yPos && scrollYPos < player.yPos + player.height){
				player.play()
			}else{
				player.pause()
			}
		}
	}
	resize() {
		var scrollYPos = this.getCurrentScrollPagePosition()
		for (var i = 0; i < this.players.length; i++) {
			var player = this.players[i].props.player
			player.resize(scrollYPos)
		};
		for (var i = 0; i < this.slideshows.length; i++) {
			var slideshow = this.slideshows[i].props.slideshow
			slideshow.resize()
		};
		this.updateViewHeight()
	}
	componentWillUnmount() {
		this.viewSmoothScroll.componentWillUnmount()
	}
}
