import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import TextBtn from 'TextBtn'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import size from 'element-size'
import Router from 'Router'
import AppActions from 'AppActions'
import ConnectBtns from 'ConnectBtns'

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
				clickCallback: this.onWorkClicked,
				mouseEnterCallback: undefined
			},
			{
				id: 'info',
				title: 'info',
				clickCallback: this.onInfoClicked,
				mouseEnterCallback: undefined
			}
		]
	}
	render() {
		var textBtns = this.links.map((link, index)=> {
			return <TextBtn key={index} ref={link.id} id={link.id} title={link.title} mouseEnterCallback={link.mouseEnterCallback} clickCallback={link.clickCallback} />
		})
		return (
			<div id='footer'>
				{textBtns}
				<ConnectBtns ref='social' />
			</div>
		)
	}
	componentDidMount() {
		this.work = React.findDOMNode(this.refs['work'])
		this.info = React.findDOMNode(this.refs['info'])
		this.social = React.findDOMNode(this.refs['social'])
	}
	onWorkClicked(e) {
		e.preventDefault()
		AppActions.openProjectsMenu()
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
		this.refs['social'].changeColor(color)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var workCss, infoCss, socialCss;
		var workSize = size(this.work)
		var socialSize = size(this.social)
		workCss = {
			left: AppConstants.OVERALL_MARGIN + 'px',
			top: windowH - AppConstants.SMALL_TITLE_SIZE - AppConstants.OVERALL_MARGIN + 'px'
		}
		infoCss = {
			left: AppConstants.OVERALL_MARGIN + workSize[0] + (AppConstants.OVERALL_MARGIN * 1.6) + 'px',
			top: windowH - AppConstants.SMALL_TITLE_SIZE - AppConstants.OVERALL_MARGIN + 'px'
		}
		socialCss = {
			left: windowW - AppConstants.OVERALL_MARGIN - socialSize[0] + 'px',
			top: windowH - AppConstants.OVERALL_MARGIN - socialSize[1] + 'px'
		}

		dom(this.work).style(workCss)
		dom(this.info).style(infoCss)
		dom(this.social).style(socialCss)
	}
}
