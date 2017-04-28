
import React from 'react'
import BaseComponent from 'BaseComponent'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import dom from 'domquery'
import size from 'element-size'
import WistiaPlayer from 'WistiaPlayer'
import FullscreenImage from 'FullscreenImage'
import ProjectBackgroundComponents from 'ProjectBackgroundComponents'
import ProjectCoverComponents from 'ProjectCoverComponents'
import TextWithLineBtn from 'TextWithLineBtn'
import Work from 'Work'
import Router from 'Router'
import Utils from 'Utils'
import SplitTitle from 'SplitTitle'
import TextBtn from 'TextBtn'
import AppActions from 'AppActions'

export default class BlockPart extends BaseComponent {
	constructor(props) {
		super(props)
		this.isActive = false
		this.workPageOpened = false
		this.data = AppStore.workDataById(props.scope.id)
		this.closeBtnDidClick = this.closeBtnDidClick.bind(this)
		this.backgroundVideoDidReady = this.backgroundVideoDidReady.bind(this)
		this.onBlockMouseEnter = this.onBlockMouseEnter.bind(this)
		this.onBlockMouseLeave = this.onBlockMouseLeave.bind(this)
		this.update = this.update.bind(this)
	}
	render() {
		var globalContent = AppStore.globalContent()
		var titleStyle = {
			color: this.data['ambient-color']
		}
		this.backgroundComponent = this.getBackgroundComponent()
		this.coverComponent = this.getCoverComponent()
		return (
			<div id='block-part' ref='block-part' className='full-block'>
				<div className="infos-wrapper">
					<div className="title-wrapper btn" onClick={this.props.onBlockSelected.bind(null, this.props.scope.id)}>
						<SplitTitle ref='split-text' title={this.data.title.txt}/>
					</div>
					<div className="subtitle">{this.data.subtitle}</div>
					<div id='explore-btn' onClick={this.props.onBlockSelected.bind(null, this.props.scope.id)} className="bottom-line-btn btn">
						<TextWithLineBtn ref='explore-btn' ambientColor={this.data['ambient-color']} text={globalContent['explore-txt']} />
					</div>
				</div>
				<div id="main-internal-page-container">
					<div className="scrollbar-wrapper"></div>
					<TextBtn ref='close-btn' id='close-btn' title={'close'} clickCallback={this.closeBtnDidClick} />
					<div className="internal-page-wrapper">
						<div className="work-title" style={titleStyle}>CLIENT <span className="title">{this.data.client}</span></div>
						<div className="paragraph headline header" style={titleStyle}>{this.data.header}</div>
						<div onClick={this.props.onBlockSelected.bind(null, this.props.scope.id)} className="main-cover-wrapper btn">
							<div className="cover-top-inside"></div>
							<div className="cover-bottom-inside">{this.coverComponent}</div>
						</div>
						<div className="page-holder"></div>
						<div className="background"></div>
					</div>
				</div>
				{this.backgroundComponent}
			</div>
		)
	}
	componentDidMount() {
		this.blockPart = React.findDOMNode(this.refs['block-part'])
		this.closeBtn = React.findDOMNode(this.refs['close-btn'])
		this.mainInternalPageContainer = dom(this.blockPart).select('#main-internal-page-container')[0]
		this.infosWrapper = dom(this.blockPart).select('.infos-wrapper')[0]
		this.mainTitle = dom(this.infosWrapper).select('.title')[0]
		this.mainTitleWrapper = dom(this.infosWrapper).select('.title-wrapper')[0]
		this.mainSubtitle = dom(this.infosWrapper).select('.subtitle')[0]
		this.exploreBtn = dom(this.infosWrapper).select('#explore-btn')[0]
		this.pageHolder = dom(this.mainInternalPageContainer).select('.page-holder')[0]
		this.background = dom(this.mainInternalPageContainer).select('.internal-page-wrapper .background')[0]
		this.internalPageWrapper = dom(this.mainInternalPageContainer).select('.internal-page-wrapper')[0]
		this.headerParagraph = dom(this.mainInternalPageContainer).select('.paragraph.headline.header')[0]
		this.coverWrapper = dom(this.blockPart).select('.main-cover-wrapper')[0]
		this.workTitle = dom(this.blockPart).select('.work-title')[0]
		this.scrollbarWrapper = dom(this.mainInternalPageContainer).select('.scrollbar-wrapper')[0]
		dom(this.mainTitle).style({
			'font-size': this.data.title['font-size'] + 'px',
			'letter-spacing': this.data.title['letter-spacing'] + 'px',
			'left': this.data.title['offset'][0] + 'px',
			'top': this.data.title['offset'][1] + 'px',
			'text-align': 'center',
			'color': this.data['ambient-color']
		})
		dom(this.exploreBtn).style('color', this.data['ambient-color'])
		dom(this.mainSubtitle).style('color', this.data['ambient-color'])
		
		var titleScale = this.getTitleScale()
		this.coverImgScale = 0.8
		this.openPageTl = new TimelineMax({ onComplete:this.onTransitionInWorkPageCompleted })
		this.openPageTl.add(this.refs['split-text'].tweenIn, 0)
		this.openPageTl.to(this.mainSubtitle, 1, { opacity:0, ease:Expo.easeInOut }, 0)
		this.openPageTl.to(this.exploreBtn, 1, { opacity:0, ease:Expo.easeInOut }, 0)
		this.openPageTl.fromTo(this.headerParagraph, 1, { y:0, opacity:0, transformOrigin:'50% 50%', ease:Expo.easeInOut }, { y:(AppConstants.WORK_HEADER_PADDING >> 1) + 60, opacity:1, force3D:true, transformOrigin:'50% 50%', ease:Expo.easeInOut }, 0.6)
		this.openPageTl.fromTo(this.workTitle, 1, { y:-AppConstants.WORK_PAGE_TOP_MARGIN*1.4, opacity:0, transformOrigin:'50% 50%', ease:Expo.easeInOut }, { y:0, opacity:1, transformOrigin:'50% 50%', force3D:true, ease:Expo.easeInOut }, 0.6)
		this.openPageTl.fromTo(this.closeBtn, 1, { x:AppConstants.WORK_PAGE_TOP_MARGIN*2, transformOrigin:'0% 50%', ease:Expo.easeInOut }, { x:0, transformOrigin:'0% 50%', force3D:true, ease:Expo.easeInOut }, 0.8)
		this.openPageTl.pause(0)

		this.closePageTl = new TimelineMax({ onComplete:this.onTransitionOutWorkPageCompleted })
		this.closePageTl.to(this.closeBtn, 1, { x:AppConstants.WORK_PAGE_TOP_MARGIN*2, transformOrigin:'0% 50%', force3D:true, ease:Expo.easeInOut }, 0)
		this.closePageTl.to(this.workTitle, 1, { opacity:0, transformOrigin:'50% 50%', force3D:true, ease:Expo.easeInOut }, 0.1)
		this.closePageTl.to(this.headerParagraph, 1, { opacity:0, transformOrigin:'50% 50%', ease:Expo.easeInOut }, 0)
		this.closePageTl.to(this.exploreBtn, 1, { opacity:1, ease:Expo.easeInOut }, 1.4)
		this.closePageTl.to(this.mainSubtitle, 1, { opacity:1, ease:Expo.easeInOut }, 1.4)
		this.closePageTl.add(this.refs['split-text'].tweenOut, 0.6)
		this.closePageTl.pause(0)

		Utils.Set(this.coverWrapper, { scale:this.coverImgScale })
	}
	addHomeEvents() {
		dom(this.mainTitleWrapper, this.coverWrapper, this.exploreBtn).on('mouseenter', this.onBlockMouseEnter)
		dom(this.mainTitleWrapper, this.coverWrapper, this.exploreBtn).on('mouseleave', this.onBlockMouseLeave)
	}
	removeHomeEvents() {
		dom(this.mainTitleWrapper, this.coverWrapper, this.exploreBtn).off('mouseenter', this.onBlockMouseEnter)
		dom(this.mainTitleWrapper, this.coverWrapper, this.exploreBtn).off('mouseleave', this.onBlockMouseLeave)
	}
	onBlockMouseEnter(e) {
		e.preventDefault()
		this.eventColorIn()
	}
	onBlockMouseLeave(e) {
		e.preventDefault()
		this.eventColorOut()
	}
	eventColorIn() {
		var event = this.data['home-event']
		var type = event.type
		switch(type) {
			case AppConstants.EVENTS.TITLE_CHANGE_COLOR:
				var color = event.vars.color
				dom(this.mainTitle).style('color', color)
				break
			case AppConstants.EVENTS.BACKGROUND_CHANGE_COLOR:
				var color = event.vars.color
				var bg = dom(this.blockPart).select('.block-background')
				dom(bg).style('background-color', color)
				break
		}
	}
	eventColorOut() {
		var event = this.data['home-event']
		var type = event.type
		switch(type) {
			case AppConstants.EVENTS.TITLE_CHANGE_COLOR:
				var color = event.vars.color
				dom(this.mainTitle).style('color', this.data['ambient-color'])
				break
			case AppConstants.EVENTS.BACKGROUND_CHANGE_COLOR:
				var color = event.vars.color
				var bg = dom(this.blockPart).select('.block-background')
				dom(bg).style('background-color', this.data['background-visual'].vars.color)
				break
		}
	}
	closeBtnDidClick(e) {
		e.preventDefault()
		Router.setHash('works')
	}
	openPage() {
		AppStore.Parent.style.cursor = 'wait'
		this.workPageOpened = true
		this.transitionInWorkPage()
		setTimeout(()=>{
			this.renderWorkPage()
			this.currentWorkPage.setPadder(this.headerParagraphSize[1])
			AppStore.Parent.style.cursor = 'auto'
		}, 1800)
		this.coverWrapper.style.cursor = 'auto'
	}
	closePage() {
		this.workPageOpened = false
		setTimeout(()=>{ AppActions.workPageScrollTriggered(AppConstants.TOP) }, 0)
		setTimeout(()=>{
			dom(this.mainInternalPageContainer).style('z-index', 5)
			this.currentWorkPage.close()
			this.animatePageToTop()
			this.transitionOutWorkPage()
		}, 10)
		this.coverWrapper.style.cursor = 'pointer'
	}
	animatePageToTop() {
		cancelAnimationFrame(this.rafId)
		var yPos = this.currentWorkPage.getCurrentScrollPagePosition()
		var tween = {val:yPos}
		TweenLite.to(tween, 0.5, { val:0, ease:Expo.easeInOut, onUpdate:()=>{
			Utils.Translate(this.internalPageWrapper, 0, -tween.val, 0)
		}})
	}
	renderWorkPage() {
		var page = <Work parentWrapper={this.internalPageWrapper} scrollbarWrapper={this.scrollbarWrapper} data={this.data} />
		this.currentWorkPage = React.render(page, this.pageHolder)
		this.update()
	}
	destroyWorkPage() {
		this.background.classList.remove('show')
		cancelAnimationFrame(this.rafId)
		var workPage = this.pageHolder
		React.unmountComponentAtNode(workPage)
	}
	transitionInWorkPage() {
		this.openPageTl.play(0)
		setTimeout(()=>{
			Utils.Animate(this.coverWrapper, { scale:1 }, 'scale-y-animation')
		}, 300)
		setTimeout(()=>{
			Utils.Animate(this.coverWrapper, { y:this.headerParagraphSize[1] + AppConstants.WORK_HEADER_PADDING }, 'scale-y-animation')
		}, 800)
		if(this.data['home-event'] != undefined) this.removeHomeEvents()
	}
	transitionOutWorkPage() {
		dom(this.infosWrapper).style('visibility', 'visible')
		this.closePageTl.play(0)
		setTimeout(()=>{
			Utils.Animate(this.coverWrapper, { scale:0.8 }, 'scale-y-animation')
		}, 400)
		setTimeout(()=>{
			Utils.Animate(this.coverWrapper, { y:0 }, 'scale-y-animation')
		}, 800)
		if(this.data['home-event'] != undefined) this.addHomeEvents()
	}
	onTransitionInWorkPageCompleted() {
		dom(this.mainInternalPageContainer).style('z-index', 11)
		dom(this.infosWrapper).style('visibility', 'hidden')
	}
	onTransitionOutWorkPageCompleted() {
		this.destroyWorkPage()
	}
	componentOnViewport() {
		var imgElement = React.findDOMNode(this.refs[this.coverComponent.ref])
		var imgSrc = imgElement.getAttribute('data-src')
		imgElement.setAttribute('src', imgSrc)
	}
	transitionInSlide(currentDirection) {
		var newHash = Router.getNewHash()
		var windowH = AppStore.Window.h
		if(newHash.parts.length != 2) {
			var yPos, skewX, skewY;
			var skewVal = Utils.Rand(20, 30, 0)
			skewVal *= (Utils.Rand(0, 1, 1) > 0.5) ? 1 : -1
			if(currentDirection == -1) {
				yPos = windowH*2
				skewX = skewVal
			} else {
				yPos = -windowH*2
				skewX = skewVal
			} 
			Utils.Set(this.coverWrapper, { y:yPos, scaleY:3, skewY:skewX }, 'y-animation')
			setTimeout(()=>{
				Utils.Animate(this.coverWrapper, { y:0, scaleY:this.coverImgScale, skewY:0 }, 'y-animation')
			}, 300)
		}
		if(this.backgroundComponent.ref == 'fullscreen-video') {
			this.backgroundComponent.props.player.play()
		}
		if(this.coverComponent.ref == 'fullscreen-video') {
			this.coverComponent.props.player.play()
		}
		if(this.data['home-event'] != undefined) this.addHomeEvents()
	}
	transitionOutSlide() {
		var newHash = Router.getNewHash()
		if(newHash.parts.length <= 1) {
			if(this.backgroundComponent.ref == 'fullscreen-video') {
				this.backgroundComponent.props.player.pause()
			}
		}
		if(newHash.parts.length <= 1) {
			if(this.coverComponent.ref == 'fullscreen-video') {
				this.coverComponent.props.player.pause()
			}
		}
		if(this.data['home-event'] != undefined) this.removeHomeEvents()
	}
	getBackgroundComponent() {
		var data = this.data['background-visual']
		var type = data.type
		switch(type) {
			case AppConstants.BACKGROUND.COLOR:
				return ProjectBackgroundComponents.getBackgroundColor(data.vars.color)
			case AppConstants.BACKGROUND.VIDEO:
				return ProjectBackgroundComponents.getVideo(data.vars.id, this.backgroundVideoDidReady)
			case AppConstants.BACKGROUND.FULLSCREEN_IMAGE:
				var imgurl = 'image/projects/' + this.props.scope.id + '/' + data.vars.url
				return ProjectBackgroundComponents.getFullscreenImage(imgurl)
			case AppConstants.BACKGROUND.FULLSCREEN_PATTERN:
				var imgurl = 'image/projects/' + this.props.scope.id + '/' + data.vars.name
				return ProjectBackgroundComponents.getFullscreenPattern(imgurl)
		}
	}
	getCoverComponent() {
		var data = this.data['cover-visual']
		var type = data.type
		switch(type) {
			case AppConstants.COVER.COLOR:
				return ProjectCoverComponents.getBackgroundColor(data.vars.color)
			case AppConstants.COVER.VIDEO:
				return ProjectCoverComponents.getVideo(data.vars.id, this.backgroundVideoDidReady)
			case AppConstants.COVER.FULLSCREEN_IMAGE:
				var coverVisualUrl = 'image/projects/' + this.props.scope.id + '/' + data.vars.name
				return ProjectCoverComponents.getFullscreenImage(coverVisualUrl, this.data.id + '_cover')
		}	
	}
	backgroundVideoDidReady(player) {
		this.resizeBackgroundVideo()
	}
	willChangeAmbient(color) {
		this.refs['explore-btn'].willChangeAmbient(color.color)
		this.refs['close-btn'].changeColor(color.color)
	}
	onWorkPageScrollTriggered(item) {
		var color = this.data['ambient-color']
		if(item.type == AppConstants.TOP) {
			this.background.classList.remove('show')
			this.refs['explore-btn'].willChangeAmbient(color)
			this.refs['close-btn'].changeColor(color)
			if(this.currentWorkPage != undefined) this.currentWorkPage.onWorkPageScrollTriggered(item)
		}else{
			this.background.classList.add('show')
			this.refs['explore-btn'].willChangeAmbient('#000')
			this.refs['close-btn'].changeColor('#000')
			if(this.currentWorkPage != undefined) this.currentWorkPage.onWorkPageScrollTriggered(item)
		}
	}
	getTitleScale() {
		var windowW = AppStore.Window.w
		return (windowW / AppConstants.MEDIA_GLOBAL_W) * 1
	}
	update() {
		this.currentWorkPage.update()
		var windowH = AppStore.Window.h
		var scrollYPos = this.currentWorkPage.getCurrentScrollPagePosition()
		if(this.coverComponent.ref == 'fullscreen-video') {
			if(scrollYPos > windowH + this.headerParagraphSize[1] + AppConstants.WORK_HEADER_PADDING) this.coverComponent.props.player.pause()
			else this.coverComponent.props.player.play()
		}
		this.rafId = requestAnimationFrame(this.update)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		this.headerParagraphSize = size(this.headerParagraph)
		var middleCoverScale = (windowH / AppConstants.MEDIA_COVER_H) * 1
		var middleCoverCss = { 
			width: AppConstants.MEDIA_COVER_W * middleCoverScale + 'px',
			height: AppConstants.MEDIA_COVER_H * middleCoverScale + 'px',
			left:(windowW >> 1) - (AppConstants.MEDIA_COVER_W * middleCoverScale >> 1) + 'px',
			top:(windowH >> 1) - (AppConstants.MEDIA_COVER_H * middleCoverScale >> 1) - this.headerParagraphSize[1] + 'px', 
		}
		var workTitleCss = {
			left: (windowW >> 1) - (size(this.workTitle)[0] >> 1) + 'px',
			top: (AppConstants.WORK_HEADER_PADDING >> 1) + 10 + 'px'
		}
		
		// When work page is opened
		if(this.workPageOpened) {

			this.currentWorkPage.resize()

		}else{

			var titleScale = this.getTitleScale()
			var titleY = windowH*0.12
			var infoWrapperSize = size(this.infosWrapper)
			var infoWrapperCss = {
				left: 0 + 'px',
				top: 0 + 'px',
			}
			var subtitleY = (titleY + (this.data.title['font-size'] * titleScale) + 20)
			var subtitleCss = {
				top: subtitleY + 'px'
			}
			var subtitleSize = size(this.mainSubtitle)
			var exploreCss;
			exploreCss = {
				top: subtitleY + subtitleSize[1] + 'px'
			}
			var mainTitleCss = {
				scale:titleScale,
				top:titleY,
				transformOrigin: '0% 0%',
			}
			setTimeout(()=>{
				var exploreTitle = dom(this.exploreBtn).select('.text-btn')[0]
				var exploreTitleSize = size(exploreTitle)
				dom(this.exploreBtn).style({
					width: exploreTitleSize[0] + 'px',
					height: exploreTitleSize[1] + 'px',
					top: subtitleY + subtitleSize[1] + 'px'
				})
			}, 10)
			dom(this.infosWrapper).style(infoWrapperCss)
			dom(this.mainSubtitle).style(subtitleCss)
			dom(this.exploreBtn).style(exploreCss)
			TweenLite.set(this.mainTitle, mainTitleCss)
			this.resizeBackgroundImage()
			this.resizeBackgroundVideo()		
		}
		dom(this.workTitle).style(workTitleCss)
		dom(this.coverWrapper).style(middleCoverCss)
	}
	resizeBackgroundVideo() {
		if(this.refs['fullscreen-video'] != undefined) this.refs['fullscreen-video'].resize()
	}
	resizeBackgroundImage() {
		if(this.refs['fullscreen-img'] != undefined) this.refs['fullscreen-img'].resize()
	}
	componentWillUnmount() {
		if(this.data['home-event'] != undefined) this.removeHomeEvents()
		cancelAnimationFrame(this.rafId)
		this.openPageTl.clear()
		this.closePageTl.clear()
		this.destroyWorkPage()
	}
}
