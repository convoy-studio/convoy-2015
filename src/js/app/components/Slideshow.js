import React from 'react'
import FullscreenImage from 'FullscreenImage'
import dom from 'domquery'
import size from 'element-size'
import AppStore from 'AppStore'
import Utils from 'Utils'
import AppConstants from 'AppConstants'
import SVGComponent from 'SVGComponent'

export default class Slideshow extends React.Component {
	constructor(props) {
		super()
		this.imageDidLoad = this.imageDidLoad.bind(this)
		this.onClick = this.onClick.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)
		this.update = this.update.bind(this)
		this.blockIndex = 0
		this.size = [1400, 945]
		this.mouse = {x:0, y:0}
	}
	render() {
		var images = this.props.images.map((item, index)=>{
			var imgurl = 'image/projects/' + this.props.workId + '/slideshow/' + item
			return (
				<FullscreenImage key={index} className='' didLoad={this.imageDidLoad} imgurl={imgurl} />
			)
		})
		return (
			<div id='slideshow' ref='slideshow'>
				<div className="top-container-wrapper"></div>
				<div className="arrow-container">
					<div className="arrow left">
						<SVGComponent width="100%" viewBox="0 0 28.347 28.346">
							<polyline fill="none" stroke="blue" strokeWidth="1.3" strokeMiterlimit="10" points="18.455,25.328 7.262,14.134 18.455,2.941 "/>
						</SVGComponent>
					</div>
					<div className="arrow right">
						<SVGComponent width="100%" viewBox="0 0 28.347 28.346">
							<polyline fill="none" stroke="blue" strokeWidth="1.3" strokeMiterlimit="10" points="8.454,2.941 19.647,14.134 8.454,25.327 "/>
						</SVGComponent>
					</div>
				</div>
				<div className="images-wrapper">
					{images}
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.props.slideshow = this
		this.parent = React.findDOMNode(this.refs['slideshow'])
		this.imgWrappers = dom(this.parent).select('#fullscreen-content-wrapper')
		this.imagesWrapper = dom(this.parent).select('.images-wrapper')[0]
		this.totalSlides = this.imgWrappers.length
		this.arrowContainer = dom(this.parent).select('.arrow-container')[0]
		this.arrows = {
			left: dom(this.arrowContainer).select('.left')[0],
			right: dom(this.arrowContainer).select('.right')[0],
		}
		dom(this.parent).on("mousemove", this.onMouseMove)
		dom(this.parent).on("click", this.onClick)
		dom(this.parent).on("mouseleave", this.onMouseLeave)

		this.addInterval()
	}
	addInterval() {
		clearInterval(this.intervalId)
		this.intervalId = setInterval(()=>{
			this.increaseIndex()
			this.moveBlock()
		}, 3000)
	}
	onClick(e) {
		e.preventDefault()
		if(this.mouse.x > this.resizeVals.width >> 1) this.increaseIndex()
		else this.decreaseIndex()
		this.moveBlock()
		this.addInterval()
	}
	onMouseLeave(e) {
		e.preventDefault()
		this.arrows.right.style.opacity = 0
		this.arrows.left.style.opacity = 0
	}
	moveBlock() {
		var windowW = AppStore.Window.w
		var posX = -(this.resizeVals.width*this.blockIndex)
		Utils.Translate(this.imagesWrapper, posX, 0, 0)
	}
	onMouseMove(e) {
		e.preventDefault()
		this.mouse.x = e.offsetX
		this.mouse.y = e.offsetY
		requestAnimationFrame(this.update)
	}
	update() {
		if(this.mouse.x > this.resizeVals.width >> 1) {
			this.arrows.right.style.opacity = 1
			this.arrows.left.style.opacity = 0
		}else{
			this.arrows.left.style.opacity = 1
			this.arrows.right.style.opacity = 0
		}
		Utils.Translate(this.arrowContainer, this.mouse.x-10, this.mouse.y-18, 0)
	}
	imageDidLoad(item) {
		this.imgSize = item.size
		this.resize()
	}
	increaseIndex() {
		this.setBlockIndex(this.blockIndex+1)
	}
	decreaseIndex() {
		this.setBlockIndex(this.blockIndex-1)
	}
	setBlockIndex(index) {
		this.blockIndex = index
		if(this.blockIndex > this.totalSlides - 1) this.setBlockIndex(0)
		if(this.blockIndex < 0) this.setBlockIndex(this.totalSlides - 1)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		windowW *= 0.8
		this.resizeVals = Utils.ResizePositionProportionally(windowW, windowH, this.size[0], this.size[1], AppConstants.LANDSCAPE)

		this.offsetParent = $(this.parent).offset()

		this.parent.style.width = this.resizeVals.width + 'px'
		this.parent.style.height = this.resizeVals.height + 'px'
		this.imagesWrapper.style.width = this.resizeVals.width + 'px'
		this.imagesWrapper.style.height = this.resizeVals.height + 'px'
		this.parent.style.left = (AppStore.Window.w >> 1) - (this.resizeVals.width >> 1) + 'px'

		for (var i = 0; i < this.imgWrappers.length; i++) {
			var imgWrapper = this.imgWrappers[i]
			imgWrapper.style.left = (this.resizeVals.width * i) + 'px'
		}
	}
	componentWillUnmount() {
		clearInterval(this.intervalId)
		dom(this.parent).off("mousemove", this.onMouseMove)
		dom(this.parent).off("click", this.onClick)
		dom(this.parent).off("mouseleave", this.onMouseLeave)
	}
}
