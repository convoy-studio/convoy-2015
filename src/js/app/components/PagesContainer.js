import React from 'react'
import BasePager from 'BasePager'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import Router from 'Router'
import Home from 'Home'
import About from 'About'
import dom from 'domquery'

export default class PagesContainer extends BasePager {
	constructor(props) {
		super(props)
		this.didHasherChange = this.didHasherChange.bind(this)
		this.onOpenProjectsMenu = this.onOpenProjectsMenu.bind(this)
		this.onCloseProjectsMenu = this.onCloseProjectsMenu.bind(this)
	}
	componentWillMount() {
		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
		AppStore.on(AppConstants.OPEN_PROJECTS_MENU, this.onOpenProjectsMenu)
		AppStore.on(AppConstants.CLOSE_PROJECTS_MENU, this.onCloseProjectsMenu)
		super.componentWillMount()
	}
	didHasherChange() {
		var hash = Router.getNewHash()
		var oldHash = Router.getOldHash()

		// Check if it's an internal change in the homepage
		if(oldHash != undefined) {
			// if we stay to the same parentPage
			if(hash.parentPage == oldHash.parentPage) {

				// if we change from a work to another
				if(hash.parts.length == 2 && oldHash.parts.length == 2) {
					this.internalWorkToWorkRouteChanged()
				}else if(hash.parts.length == 2){
					this.internalHomeToWorkRouteChanged()
				}else if(hash.targetId == 'works' && oldHash.parts.length == 2){
					this.internalWorkToHomeRouteChanged()
				}else if(hash.targetId == 'landing' && oldHash.parts.length == 2){
					this.internalWorkToLandingRouteChanged()
				}else{
					this.internalHomeSlideChange()
				}
				return 
			}
		}

		var type = undefined
		switch(hash.parent) {
			case 'about':
				type = About
				break
			case 'works':
				type = Home
				break
			default:
				type = Home
		}

		this.setupNewComponent(hash.parent, type)
	}
	onOpenProjectsMenu() {
		// dom(this.parent).addClass('menu-open-state')
	}
	onCloseProjectsMenu() {
		// dom(this.parent).removeClass('menu-open-state')
	}
	internalHomeSlideChange() {
		this.components['new-component'].internalHomeSlideRouteChanged()
	}
	internalWorkToWorkRouteChanged() {
		this.components['new-component'].internalWorkToWorkRouteChanged()
	}
	internalWorkToHomeRouteChanged() {
		this.components['new-component'].internalWorkToHomeRouteChanged()
	}
	internalWorkToLandingRouteChanged() {
		this.components['new-component'].internalWorkToLandingRouteChanged()
	}
	internalHomeToWorkRouteChanged() {
		this.components['new-component'].internalHomeToWorkRouteChanged()
	}
}


