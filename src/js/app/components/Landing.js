import React from 'react'
import BaseComponent from 'BaseComponent'
import FullscreenImage from 'FullscreenImage'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import dom from 'domquery'
import size from 'element-size'
import WistiaPlayer from 'WistiaPlayer'
import SVGComponent from 'SVGComponent'
import Utils from 'Utils'
import ScrollDownBtn from 'ScrollDownBtn'

export default class Landing extends BaseComponent {
	constructor() {
		super()
		this.onVideosLoaded = this.onVideosLoaded.bind(this)
		this.textures = []
		this.videos = []
		this.durations = []
		this.activeSprites = []
		this.totalDuration = 0
		this.currentTexture = null
		this.counter = 0
		this.currentCounter = 0
		this.addVideoIsActive = true
		this.shape = null
		this.widthMargin = AppStore.Window.w * 0.2
		this.heightMargin = AppStore.Window.h * 0.1
		var content = AppStore.pageContentById('works')
		this.videosSrcs = content.landing.videos
	}
	render() {
		return (
			<div ref='landing' id='landing'>
				<div className="xp-holder" ref='xp-holder'></div>
				<div className="bottom-text">
					<div className="cbp">CREATIVE BUSINESS PARTNERS</div>
					Brand Strategy + Creative Content + Innovation<br/>
					All necessities provided, all boredom amused.
				</div>
				<ScrollDownBtn clickBtn={this.props.onArrowClicked} ref='scroll-down-btn' />
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['landing'])
		this.xpHolder = React.findDOMNode(this.refs['xp-holder'])
		this.scrollDownBtn = React.findDOMNode(this.refs['scroll-down-btn'])
		this.renderer = new PIXI.WebGLRenderer(1, 1, {antialias: true, roundPixels: true})
		this.renderer.backgroundColor = 0xffffff
		dom(this.xpHolder).add(this.renderer.view)
		this.stage = new PIXI.Container()
		this.container = new PIXI.Container()
		this.counterContainer = new PIXI.Container()

		this.stage.addChild(this.container)
		this.stage.addChild(this.counterContainer)

		this.loadVideos()
		this.update()
		this.addNavigation()
	}
	componentOnViewport() {
	}
	transitionInSlide() {
		// add events etc
	}
	transitionOutSlide() {
		// remove events etc
	}
	goToProject() {
		let slug = this.videos[this.currentCounter].substr(this.videos[this.currentCounter].lastIndexOf('/') + 1).slice(0, -3)
		console.log('Go to project : ' + slug)
	}
	loadVideos() {
		var loader = new PIXI.loaders.Loader();
		for (var i = 0; i < this.videosSrcs.length; i++) {
			var videosrc = 'videos/landing/' + this.videosSrcs[i]
			loader.add('video-'+i,videosrc)
		};
		loader.on('progress',this.onVideosLoaded)
		loader.load()
	}
	onVideosLoaded(loader, resources) {
		setTimeout(()=>{
			this.videos.push(resources.url)
			this.addVideoTexture()
		}, 100)
	}
	addVideoTexture() {
		let texture = new PIXI.Texture.fromVideo(this.videos[this.counter])
		this.textures.push(texture)
		let durationInt = setInterval(() => {
			if(!isNaN(texture.baseTexture.source.duration)) {
				this.totalDuration += texture.baseTexture.source.duration
				this.durations.push(texture.baseTexture.source.duration)
				console.log(this.totalDuration)
				clearInterval(durationInt)
			}
		}, 100)

		if(this.counter === 0) {
			console.log('active');
			this.addVideo(texture)
			this.addCounter()
		}
		this.counter++
	}
	addVideo(texture) {
		texture.baseTexture.source.currentTime = 0
		texture.baseTexture.source.pause()
		let sprite = new PIXI.Sprite(texture)
		sprite.interactive = true
		sprite.on('mousedown', () =>  {
			this.goToProject()
		})
		this.currentTexture = texture
		let resizeVals = Utils.ResizePositionProportionally(AppStore.Window.w, AppStore.Window.h, 1920, 1080)
		console.log(resizeVals);
		sprite.position.x = resizeVals.left
		sprite.position.y = resizeVals.top
		sprite.width = resizeVals.width
		sprite.height = resizeVals.height
		this.activeSprites.push({
			sprite: sprite
		})
		this.container.addChild(sprite)
		this.currentTexture.baseTexture.source.play()
	}
	addNavigation() {
		let leftSide = new PIXI.Sprite()
		leftSide.position.x = 0
		leftSide.position.y = this.heightMargin
		leftSide.width = this.widthMargin
		leftSide.height = AppStore.Window.h - (2 * this.heightMargin)
		leftSide.interactive = true
		leftSide.on('mousedown', () =>  {
			this.changeSlide('prev')
		})

		let rightSide = new PIXI.Sprite()
		rightSide.position.x = AppStore.Window.w - (this.widthMargin)
		rightSide.position.y = this.heightMargin
		rightSide.width = this.widthMargin
		rightSide.height = AppStore.Window.h - (2 * this.heightMargin)
		rightSide.interactive = true
		rightSide.on('mousedown', () =>  {
			this.changeSlide('next')
		})

		this.stage.addChild(leftSide)
		this.stage.addChild(rightSide)
	}
	changeSlide(direction) {
		this.removeSprite()
		if(direction == 'next') {
			this.currentCounter = this.currentCounter === this.counter - 1 ? 0 : this.currentCounter + 1
		}
		else if(direction == 'prev') {
			this.currentCounter = this.currentCounter === 0 ? this.counter - 1 : this.currentCounter - 1
		}
		this.addVideo(this.textures[this.currentCounter])
	}
	addCounter() {
		let shape = new PIXI.Graphics()
		shape.lineStyle(5, 0xffffff, 1)
		let radius = 10
		let posX = AppStore.Window.w - ((this.widthMargin) + radius + 10)
		let posY = (this.heightMargin) + radius + 10
		shape.arc(posX, posY, radius, -Math.PI/2, -Math.PI/2 )
		this.counterContainer.addChild(shape)
	}
	updateCounter() {
		if(this.shape !== null) {
			this.shape.clear()
		}
		this.shape = new PIXI.Graphics()
		this.shape.lineStyle(5, 0xffffff, 1)
		let radius = 10
		let posX = AppStore.Window.w - ((this.widthMargin) + radius + 10)
		let posY = (this.heightMargin) + radius + 10
		let endAngle = Utils.ToRadians((this.currentTexture.baseTexture.source.currentTime * 360) / this.currentTexture.baseTexture.source.duration)
		this.shape.arc(posX, posY, radius, -Math.PI/2, endAngle - Math.PI/2 )
		this.counterContainer.addChild(this.shape)
	}

	removeSprite() {
		var spriteToRemove = this.activeSprites.shift()
		// TweenMax.to(spriteToRemove.sprite.position, 1, {
		// 	x: -100,
		// 	ease: Sine.easeInOut
		// })
		this.container.removeChild(spriteToRemove.sprite)
	}
	update() {
		if(this.currentTexture && this.currentTexture !== null && this.currentTexture.baseTexture.source.ended) {
			this.currentTexture = null
			this.removeSprite()
			this.currentCounter++
			if(this.currentCounter > this.counter - 1) this.currentCounter = 0
			this.addVideo(this.textures[this.currentCounter])
		}
		else if(this.currentTexture !== null && !isNaN(this.currentTexture.baseTexture.source.duration)) {
			this.updateCounter()
		}
		this.renderer.render(this.stage)
		this.rafId = requestAnimationFrame(this.update)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		this.widthMargin = AppStore.Window.w * 0.2
		this.heightMargin = AppStore.Window.h * 0.1
		let resizeVals = Utils.ResizePositionProportionally(AppStore.Window.w, AppStore.Window.h, 1920, 1080)

    this.renderer.view.style.width = windowW + "px"
    this.renderer.view.style.height = windowH + "px"
    this.renderer.resize(windowW, windowH)
		if(this.container.children.length > 0) {
			this.container.getChildAt(0).position.x = resizeVals.left
			this.container.getChildAt(0).position.y = resizeVals.top
			this.container.getChildAt(0).width = resizeVals.width
			this.container.getChildAt(0).height = resizeVals.height
		}

		if(this.stage.children.length === 4) {
			this.stage.getChildAt(2).position.y = this.heightMargin
			this.stage.getChildAt(2).width = this.widthMargin
			this.stage.getChildAt(2).height = AppStore.Window.h - (2 * this.heightMargin)
			this.stage.getChildAt(3).position.x = AppStore.Window.w - (this.widthMargin)
			this.stage.getChildAt(3).position.y = this.heightMargin
			this.stage.getChildAt(3).width = this.widthMargin
			this.stage.getChildAt(3).height = AppStore.Window.h - (2 * this.heightMargin)
		}

    var scrollDownBtnCss = {
    	left: (windowW >> 1) - (this.refs['scroll-down-btn'].width >> 1) + 'px',
    	top: windowH - this.refs['scroll-down-btn'].height - AppConstants.OVERALL_MARGIN + 10 + 'px'
    }
    dom(this.scrollDownBtn).style(scrollDownBtnCss)
	}
	componentWillUnmount() {
		cancelAnimationFrame(this.rafId)
		clearInterval(this.intervalId)
	}
}
