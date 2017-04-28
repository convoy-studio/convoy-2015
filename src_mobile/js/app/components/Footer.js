import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import TextBtn from 'TextBtn'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import size from 'element-size'
import Router from 'Router'
import AppActions from 'AppActions'

export default class Footer extends BaseComponent {
	constructor(props) {
		super(props)
		this.onWorkClicked = this.onWorkClicked.bind(this)
		this.onInfoClicked = this.onInfoClicked.bind(this)
		this.onSocialClicked = this.onSocialClicked.bind(this)
		this.links = [
			{
				id: 'work',
				title: 'work',
				clickCallback: this.onWorkClicked
			},
			{
				id: 'info',
				title: 'info',
				clickCallback: this.onInfoClicked
			}
		]
	}
	render() {
		var textBtns = this.links.map((link, index)=> {
			return <TextBtn key={index} ref={link.id} id={link.id} title={link.title} clickCallback={link.clickCallback} />
		})
		return (
			<div id='footer'>
				{textBtns}
			</div>
		)
	}
	componentDidMount() {
		this.work = React.findDOMNode(this.refs['work'])
		this.info = React.findDOMNode(this.refs['info'])
	}
	onWorkClicked(e) {
		e.preventDefault()
		// AppActions.openProjectsMenu()
		Router.setHash('works')	
	}
	onInfoClicked(e) {
		e.preventDefault()
		Router.setHash('about')	
	}
	onSocialClicked(e) {
		e.preventDefault()
	}
	changeColor(color) {
		for (var i = 0; i < this.links.length; i++) {
			var id = this.links[i].id
			this.refs[id].changeColor(color)
		};
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var workCss, infoCss;
		var infoSize = size(this.info)
		workCss = {
			left: AppConstants.OVERALL_MARGIN + 'px',
			top: AppConstants.OVERALL_MARGIN + 'px'
		}
		infoCss = {
			left: windowW - AppConstants.OVERALL_MARGIN - infoSize[0] + 'px',
			top: AppConstants.OVERALL_MARGIN + 'px'
		}
		dom(this.work).style(workCss)
		dom(this.info).style(infoCss)
	}
}
