import React from 'react'
import BasePager from 'BasePager'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import Router from 'Router'
import Home from 'Home'
import About from 'About'
import dom from 'domquery'
import Work from 'Work'

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
		var type = undefined
		switch(hash.parent) {
			case 'about':
				type = About
				break
			case 'works':
				if(hash.parts.length > 1) type = Work
				else type = Home	
				break
			default:
				type = Home
		}

		this.setupNewComponent(hash.parent, type)
	}
	onOpenProjectsMenu() {
		dom(this.parent).addClass('menu-open-state')
	}
	onCloseProjectsMenu() {
		dom(this.parent).removeClass('menu-open-state')
	}
}


