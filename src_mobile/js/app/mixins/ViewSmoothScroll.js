import React from 'react'
import AppStore from 'AppStore'
import Utils from 'Utils'
import ViewSmoothScrollbar from 'ViewSmoothScrollbar'
import dom from 'domquery'

export default class ViewSmoothScroll {
	constructor(view, scrollbarView, props) {
		this.props = props
		this.view = view
		this.scrollbarView = scrollbarView
	}
	componentDidMount() {
		this.onWheel = this.onWheel.bind(this)
		this.update = this.update.bind(this)
		this.onKeyPressed = this.onKeyPressed.bind(this)
		this.onScrollTarget = this.onScrollTarget.bind(this)

		$(window).on("mousewheel", this.onWheel)
		dom(document.body).on('keydown', this.onKeyPressed)

		var barColor = (this.props == undefined) ? '#000000' : this.props['ambient-color']
		var scrollbarView = <ViewSmoothScrollbar color={barColor} scrollTargetHandler={this.onScrollTarget} />
		this.scrollbar = React.render(scrollbarView, this.scrollbarView)
		
		this.scrollTarget = 0
		this.lastScrollY = 0
		this.scrollEase = 0.1
		this.viewHeight = AppStore.Window.h
		this.update()
	}
	onWheel(e) {
		e.preventDefault()
		var delta = e.wheelDelta
		var val = -(e.deltaY * e.deltaFactor)
        this.updateScrollTarget(val)
	}
	onKeyPressed(e) {
		e.preventDefault()
		var windowH = AppStore.Window.h
		var up = 38
		var down = 40
		var space = 32
		var pageup = 36
		var pagedown = 35
		var pageup2 = 33
		var pagedown2 = 34
		switch(e.keyCode) {
			case up:
				this.setScrollPosition(this.scrollTarget - windowH)
				break
			case down:
				this.setScrollPosition(this.scrollTarget + windowH)
				break
			case pageup:
				this.setScrollPosition(this.scrollTarget - windowH)
				break
			case pagedown:
				this.setScrollPosition(this.scrollTarget + windowH)
				break
			case pageup2:
				this.setScrollPosition(this.scrollTarget - windowH)
				break
			case pagedown2:
				this.setScrollPosition(this.scrollTarget + windowH)
				break
			case space:
				this.setScrollPosition(this.scrollTarget + windowH)
				break
		}
	}
	onScrollTarget(val) {
		this.scrollTargetChanged(val)
	}
	scrollTargetChanged(val) {
		var windowH = AppStore.Window.h
		this.scrollTarget = val
        this.applyScrollBounds()
        this.scrollbar.setScrollTarget(this.scrollTarget)
	}
	updateScrollTarget(val) {
		var windowH = AppStore.Window.h
		this.scrollTarget += val
        this.applyScrollBounds()
        this.scrollbar.setScrollTarget(this.scrollTarget)
	}
	applyScrollBounds() {
		var windowH = AppStore.Window.h
		this.scrollTarget = (this.scrollTarget < 0) ? 0 : this.scrollTarget
        this.scrollTarget = (this.scrollTarget + windowH > this.viewHeight) ? (this.viewHeight - windowH) : this.scrollTarget
	}
	setViewHeight(height) {
		this.viewHeight = height
		this.scrollbar.setPageHeight(this.viewHeight)
	}
	setScrollPosition(val) {
		this.scrollTarget = val
		this.applyScrollBounds()
        this.scrollbar.setScrollTarget(this.scrollTarget)
	}
	update() {
		this.lastScrollY += (this.scrollTarget - this.lastScrollY) * this.scrollEase
		Utils.Translate(this.view, 0, -this.lastScrollY, 0)
		this.scrollbar.update()
		this.rafId = requestAnimationFrame(this.update)
	}
	componentWillUnmount() {
		React.unmountComponentAtNode(this.scrollbarView)
		$(window).off("mousewheel", this.onWheel)
		dom(document.body).on('keydown', this.onKeyPressed)
		cancelAnimationFrame(this.rafId)
	}
}
