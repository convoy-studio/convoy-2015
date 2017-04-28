import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import Logo from 'Logo'
import Router from 'Router'
import Footer from 'Footer'
import About from 'About'

export default class FrontContainer extends BaseComponent {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
		AppStore.on(AppConstants.CHANGE_AMBIENT, this.willChangeAmbient)
		AppStore.on(AppConstants.WINDOW_RESIZE, this.resize)
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
			</div>
		)
	}
	willChangeAmbient(item) {
		this.refs['logo'].changeColor(item.color)
		this.refs['footer'].changeColor(item.color)
	}
	didHasherChange() {
		// Update or highlight parts of interface depends the route
	}
	update() {
		requestAnimationFrame(this.update)
	}
	resize() {
		this.refs['footer'].resize()
	}
}
