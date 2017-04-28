import React from 'react'
import BaseComponent from 'BaseComponent'
import AppConstants from 'AppConstants'
import ProjectPageComponents from 'ProjectPageComponents'
import Page from 'Page'
import Router from 'Router'
import AppStore from 'AppStore'

export default class Work extends Page {
	constructor(props) {
		super(props)
		this.videoDidReady = this.videoDidReady.bind(this)
		this.fullscreenImages = []
		this.players = []
		this.id = Router.getNewHash().targetId
	}
	componentDidMount() {
		this.parentWrapper = this.props.parentWrapper
		super.componentDidMount()
	}
	render() {
		var data = AppStore.workDataById(this.id)
		var content = AppStore.globalContent()
		var coverComponent = {
			name: 'cover.jpg',
			type: "fullscreen-image"
		}
		var components = []
		for (var i = 0; i < data.components.length; i++) {
			var component = data.components[i]
			components[i] = component
		};
		components.unshift(coverComponent)
		var componentsCollection = components.map((component, index)=>{
			var item;
			switch(component.type) {
				case AppConstants.COMPONENT.FULLSCREEN_IMAGE:
					item = ProjectPageComponents.getFullscreenImage(this.id, component, index)
					this.fullscreenImages.push(item)
					break
				case AppConstants.COMPONENT.PARAGRAPH:
					item = ProjectPageComponents.getParagraph(component, index, component.type)
					break
				case AppConstants.COMPONENT.EXTRA_MARGIN:
					item = ProjectPageComponents.getMargin(index, component.type)
					break
				case AppConstants.COMPONENT.TITLE_PARAGRAPH:
					item = ProjectPageComponents.getTitleParagraph(component, index, component.type)
					break
				case AppConstants.COMPONENT.WISTIA_VIDEO:
					item = ProjectPageComponents.getWistiaVideo(component, index, component.type, this.videoDidReady)
					this.players.push(item)
					break
			}
			return (item)
		})
		var nextUrl = '/#!/works/' + AppStore.getNextPreviousProject().next.id
		return (
			<div id='work-page' ref='page-wrapper'>
				<div className="client-title">
					<span className="title">{content['client-txt']}</span> <span className="name">{data.client}</span>
				</div>
				{componentsCollection}
				<a href={nextUrl}>
					<div className="next-project-btn btn">{content['next-project-txt']}</div>
				</a>
			</div>
		)
	}
	videoDidReady(){
		this.resize()
	}
	resize() {
		for (var i = 0; i < this.players.length; i++) {
			var player = this.players[i].props.player
			player.resize()
		};
	}
	componentWillUnmount() {
		super.componentWillUnmount()
	}
}
