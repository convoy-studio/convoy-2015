import React from 'react'
import Page from 'Page'
import Landing from 'Landing'
import ProjectsBlockList from 'ProjectsBlockList'
import AppStore from 'AppStore'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import Router from 'Router'
import inertia from 'wheel-inertia'
import AppActions from 'AppActions'
import Utils from 'Utils'

export default class Home extends Page {
	constructor(props) {
		super(props)
		this.toTriggerBlockMove = this.toTriggerBlockMove.bind(this)
		this.onLandingArrowClicked = this.onLandingArrowClicked.bind(this)
		this.willChangeAmbient = this.willChangeAmbient.bind(this)
		this.onWorkPageScrollTriggered = this.onWorkPageScrollTriggered.bind(this)
		this.blockIndex = 0
		this.oldBlockIndex = 0
		this.isAnimate = false
		this.oldSlide = {ref:'', positionY:0, component: {}}
		this.newSlide = {ref:'', positionY:0, component: {}}
		this.firstTimePass = true
		AppStore.on(AppConstants.CHANGE_AMBIENT, this.willChangeAmbient)
		AppStore.on(AppConstants.WORK_PAGE_SCROLL_TRIGGERED, this.onWorkPageScrollTriggered)
	}
	componentWillMount() {
		this.onWheelInertia = this.onWheelInertia.bind(this)
		this.onWheel = this.onWheel.bind(this)
		this.onKeyPressed = this.onKeyPressed.bind(this)
		super.componentWillMount()
	}
	render() {
		return (
			<div id='home-page' ref='page-wrapper'>
				<div className="children-wrapper" ref="slides-main-wrapper">
					{/* Landing */}
					{ (AppStore.Detector.type != AppConstants.PHONE) ? <Landing ref='landing-slide' onArrowClicked={this.onLandingArrowClicked} /> : '' }

					{/* Projects */}
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
		if(AppStore.Detector.type != AppConstants.PHONE) {
			this.slides.unshift(
				this.getSlideObjectById('landing-slide', 'landing-slide', false)
			)
		}
		this.slidesMainWrapper = React.findDOMNode(this.refs['slides-main-wrapper'])
		this.totalSlides = 0
		for (var i = 0; i < this.slides.length; i++) {
			var subSlidesNum = this.slides[i].subslides.length
			subSlidesNum = (subSlidesNum == 0) ? 1 : subSlidesNum
			this.totalSlides += subSlidesNum
		};
		this.positionSlides()
		inertia.addCallback(this.onWheelInertia)
		this.addEvents()
		super.componentDidMount()
		this.internalHomeSlideRouteChanged()
		this.dispatchAmbientChange()
	}
	addEvents() {
		$(window).on('mousewheel', this.onWheel)
		dom(document.body).on('keydown', this.onKeyPressed)
	}
	removeEvents() {
		$(window).off('mousewheel', this.onWheel)
		dom(document.body).off('keydown', this.onKeyPressed)
	}
	internalHomeSlideRouteChanged() {
		var hash = Router.getNewHash()
		switch(hash.targetId) {
			case 'landing':
				this.setBlockIndex(0)
				break
			case 'works':
				this.setBlockIndex(1)
				break
		}
		this.assignBlockIndexByWorkId()
		this.moveBlock()
		this.toTriggerBlockMove()
		if(this.firstTimePass && hash.parts.length > 1) this.openSlideWorkPage()
		this.firstTimePass = false
	}
	internalWorkToWorkRouteChanged() {
		this.newSlide.component.closePage()
		this.addEvents()
		this.assignBlockIndexByWorkId()
		this.moveBlock()
		this.toTriggerBlockMove()
		this.dispatchAmbientChange()
		this.openSlideWorkPage()
	}
	internalHomeToWorkRouteChanged() {
		this.assignBlockIndexByWorkId()
		this.moveBlock()
		this.toTriggerBlockMove()
		this.dispatchAmbientChange()
		this.openSlideWorkPage()
	}
	internalWorkToHomeRouteChanged() {
		this.newSlide.component.closePage()
		this.addEvents()
	}
	internalWorkToLandingRouteChanged() {
		this.newSlide.component.closePage()
		this.addEvents()
		this.setBlockIndex(0)
		this.assignBlockIndexByWorkId()
		this.moveBlock()
		this.toTriggerBlockMove()
	}
	assignBlockIndexByWorkId() {
		var hash = Router.getNewHash()
		if(hash.parts.length > 1) {
			var hashId = hash.parts[1] 
			var blockParts = this.slides[1].component.blockParts
			for (var i = 0; i < blockParts.length; i++) {
				var blockPart = blockParts[i]
				if(blockPart.id == hashId) {
					this.setBlockIndex(i + 1)
				}
			}
		}
	}
	openSlideWorkPage() {
		this.removeEvents()
		this.newSlide.component.openPage()
	}
	dispatchAmbientChange() {
		if(this.newSlide.ref == "projects-slide-wrapper") {
			var index = this.newSlide.component.blockIndex
			var id = this.newSlide.component.blockParts[index].id
			var data = AppStore.workDataById(id)
			var color = data['ambient-color']
		}else{
			var color = '#000000'
		}
		setTimeout(()=>{
			AppActions.changeAmbient(color)
		}, 0)
	}
	willChangeAmbient(color) {
		if(this.newSlide.component.willChangeAmbient != undefined) {
			this.newSlide.component.willChangeAmbient(color)
		}
	}
	onWorkPageScrollTriggered(item) {
		if(this.newSlide.component.onWorkPageScrollTriggered != undefined) {
			this.newSlide.component.onWorkPageScrollTriggered(item)
		}
	}
	onWheel(e) {
		e.preventDefault()
		var delta = e.deltaY
		inertia.update(delta)
	}
	onKeyPressed(e) {
		e.preventDefault()
		var up = 38
		var down = 40
		var space = 32
		var pageup = 36
		var pagedown = 35
		switch(e.keyCode) {
			case up:
				this.triggerBlockMove(1)
				break
			case down:
				this.triggerBlockMove(-1)
				break
			case pageup:
				this.triggerBlockMove(1)
				break
			case pagedown:
				this.triggerBlockMove(-1)
				break
			case space:
				this.triggerBlockMove(-1)
				break
		}
	}
	onWheelInertia(direction) {
		this.triggerBlockMove(direction)
	}
	triggerBlockMove(direction) {
		if(AppStore.MenuIsOpened) return
		if(this.isAnimate) return

		if(direction > 0) this.decreaseIndex()
		else this.increaseIndex()

		this.currentDirection = direction

		this.moveBlock()
		if(this.oldSlide.ref != this.newSlide.ref) {
			switch(this.newSlide.ref) {
				case 'projects-slide-wrapper':
					Router.setHash('works')
					this.dispatchAmbientChange()
					break
				case 'landing-slide':
					Router.setHash('landing')
					this.dispatchAmbientChange()
					break
			}
		}
		else{
			this.toTriggerBlockMove()
			this.dispatchAmbientChange()
		}
	}
	moveBlock() {
		for (var i = 0; i < this.slides.length; i++) {
			var slide = this.slides[i]
			var startIndex = slide.indexPositions
			var itemsNum = slide.itemsNum
			if(this.blockIndex >= startIndex && this.blockIndex < startIndex + itemsNum) {
				this.oldSlide = this.newSlide
				this.newSlide = slide
			}
		}
		this.newSlide.component.blockIndex = this.blockIndex - 1
		this.newSlide.component.oldBlockIndex = this.oldBlockIndex - 1
		if(this.oldSlide.component.transitionOutSlide != undefined) this.oldSlide.component.transitionOutSlide()
		if(this.newSlide.component.transitionInSlide != undefined) this.newSlide.component.transitionInSlide(this.currentDirection)
		this.updateCurrentViewport()
	}
	updateCurrentViewport() {
		var previousSlide = this.getSlideByIndex(this.blockIndex - 1)
		var currentSlide = this.getSlideByIndex(this.blockIndex)
		var nextSlide = this.getSlideByIndex(this.blockIndex + 1)

		if(previousSlide != undefined) previousSlide.componentOnViewport()
		if(currentSlide != undefined) currentSlide.componentOnViewport()
		if(nextSlide != undefined) nextSlide.componentOnViewport()
	}
	increaseIndex() {
		this.setBlockIndex(this.blockIndex+1)
	}
	decreaseIndex() {
		this.setBlockIndex(this.blockIndex-1)
	}
	setBlockIndex(index) {
		this.oldBlockIndex = this.blockIndex
		this.blockIndex = index
		if(this.blockIndex > this.totalSlides - 1) this.setBlockIndex(0)
		if(this.blockIndex < 0) this.setBlockIndex(this.totalSlides - 1)
	}
	getSlideByIndex(index) {
		if(index == 0) return this.refs['landing-slide']
		return this.refs['projects-slide-wrapper'].getBlockByIndex(index-1)
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
	onLandingArrowClicked(e) {
		e.preventDefault()
		this.triggerBlockMove(-1)
	}
	toTriggerBlockMove() {
		var windowH = AppStore.Window.h
		Utils.Translate(this.slidesMainWrapper, 0, -this.blockIndex * windowH, 0)
		this.isAnimate = true
		setTimeout(()=>{ this.isAnimate = false }, 600)
	}
	positionSlides() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var indexPositions = 0
		for (var i = 0; i < this.slides.length; i++) {
			var slide = this.slides[i]
			var component = slide.component
			var subslides = slide.subslides
			var parentEl = slide.parentEl
			var slideTotalH = windowH
			for (var j = 0; j < subslides.length; j++) {
				var subSlide = subslides[j]
				dom(subSlide).style({
					top: j * windowH + 'px',
					width: windowW + 'px',
					height: windowH + 'px',			
				})
				slideTotalH += windowH
			}
			if(i > 0) {
				dom(parentEl).style({
					top: windowH * i + 'px',
					height: (windowH * subslides.length) + 'px'
				})
			}
			slide.positionY = windowH * i
			slide.indexPositions = indexPositions
			slide.itemsNum = (subslides.length > 0) ? subslides.length : 1
			indexPositions += slide.itemsNum
			slide.totalH = slideTotalH
			component.resize()
		}
	}
	resize() {
		this.positionSlides()
		this.refs['landing-slide'].resize()
		this.toTriggerBlockMove()
		super.resize()
	}
	componentWillUnmount() {
		this.removeEvents()
		AppStore.off(AppConstants.CHANGE_AMBIENT, this.willChangeAmbient)
		AppStore.off(AppConstants.WORK_PAGE_SCROLL_TRIGGERED, this.onWorkPageScrollTriggered)
		super.componentWillUnmount()
	}
}

