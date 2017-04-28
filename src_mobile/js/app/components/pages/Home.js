import React from 'react'
import Page from 'Page'
import ProjectsBlockList from 'ProjectsBlockList'
import AppStore from 'AppStore'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import Router from 'Router'
import inertia from 'wheel-inertia'
import AppActions from 'AppActions'

export default class Home extends Page {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		super.componentWillMount()
	}
	render() {
		return (
			<div id='home-page' ref='page-wrapper'>
				<div className="children-wrapper" ref="slides-main-wrapper">
					<div className="block-list-parent" ref='projects-slide-parent'>
						<ProjectsBlockList ref='projects-slide-wrapper' />
					</div>
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.slides = [
			this.getSlideObjectById('projects-slide-wrapper', 'projects-slide-parent', true)
		]
		this.slidesMainWrapper = React.findDOMNode(this.refs['slides-main-wrapper'])
		this.totalSlides = 0
		for (var i = 0; i < this.slides.length; i++) {
			var subSlidesNum = this.slides[i].subslides.length
			subSlidesNum = (subSlidesNum == 0) ? 1 : subSlidesNum
			this.totalSlides += subSlidesNum
		};
		super.componentDidMount()
	}
	getSlideObjectById(componentRef, parentRef, hasSubSlides) {
		var component = this.refs[componentRef]
		var parent = this.refs[parentRef]
		var el = React.findDOMNode(component)
		var parentEl = React.findDOMNode(parent)
		var subslides = (hasSubSlides) ? dom(el).select('.full-block') : []
		return {
			ref: componentRef,
			component: component,
			el: el,
			parentEl: parentEl,
			subslides: subslides
		}
	}
	didTransitionInComplete() {
		super.didTransitionInComplete()
	}
	didTransitionOutComplete() {
		super.didTransitionOutComplete()
	}
	positionSlides() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var indexPositions = 0
		for (var i = 0; i < this.slides.length; i++) {
			var slide = this.slides[i]
			var component = slide.component
			component.resize()
		}
	}
	resize() {
		this.positionSlides()
		super.resize()
	}
	componentWillUnmount() {
		super.componentWillUnmount()
	}
}

