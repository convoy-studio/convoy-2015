import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import Logo from 'Logo'
import Router from 'Router'
import Footer from 'Footer'
import ProjectsMenu from 'ProjectsMenu'
import AppActions from 'AppActions'

export default class FrontContainer extends BaseComponent {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		this.logoChangedFromMenu = false
		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
		AppStore.on(AppConstants.CHANGE_AMBIENT, this.willChangeAmbient)
		AppStore.on(AppConstants.WORK_PAGE_SCROLL_TRIGGERED, this.onWorkPageScrollTriggered)
		AppStore.on(AppConstants.WINDOW_RESIZE, this.resize)
		AppStore.on(AppConstants.OPEN_PROJECTS_MENU, this.openProjectsMenu)
		AppStore.on(AppConstants.CLOSE_PROJECTS_MENU, this.closeProjectsMenu)
	}
	componentDidMount() {
		this.update()
	}
	render() {
		var menuData = AppStore.menuContent()
		var menuItems = menuData.map((item, index)=>{
			var pathUrl = '#' + item.url
			return(
				<li key={index}><a href={pathUrl}>{item.name}</a></li>
			)
		})
		return (
			<div id='front-container' ref='front-container'>
				<Logo ref='logo' />
				<Footer ref='footer' />
				<ProjectsMenu ref='projects-menu' />
			</div>
		)
	}
	willChangeAmbient(item) {
		this.refs['logo'].changeColor(item.color)
		this.refs['footer'].changeColor(item.color)
	}
	onWorkPageScrollTriggered(item) {
		var hash = Router.getNewHash()
		var oldhash = Router.getOldHash()
		var id;
		if(hash.parts.length < 2) id = oldhash.targetId
		else id = hash.targetId
		var content = AppStore.workDataById(id)
		var color = content['ambient-color']
		if(item.type == AppConstants.TOP) {
			this.refs['logo'].changeColor(color)
			this.refs['footer'].changeColor(color)
		}else{
			this.refs['logo'].changeColor('#000')
			this.refs['footer'].changeColor('#000')
		}
	}
	openProjectsMenu() {
		if(this.refs['logo'].color == '#000' || this.refs['logo'].color == '#000000') {
			this.logoChangedFromMenu = true
			this.refs['logo'].changeColor('#fff')
		}
		this.refs['projects-menu'].open()
	}
	closeProjectsMenu() {
		if(this.logoChangedFromMenu) {
			this.refs['logo'].changeColor('#000')
			this.logoChangedFromMenu = false
		}
		this.refs['projects-menu'].close()	
	}
	didHasherChange() {
		var hash = Router.getNewHash()
		if (hash.hash == 'landing') {
			setTimeout(()=>{
				this.refs['logo'].changeColor('#000')
				this.refs['footer'].changeColor('#000')
			}, 500)
		}
	}
	update() {
		this.refs['projects-menu'].update()
		requestAnimationFrame(this.update)
	}
	resize() {
		this.refs['footer'].resize()
		this.refs['projects-menu'].resize()
	}
}
