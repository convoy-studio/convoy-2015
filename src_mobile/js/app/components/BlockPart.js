
import React from 'react'
import BaseComponent from 'BaseComponent'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import dom from 'domquery'
import size from 'element-size'
import WistiaPlayer from 'WistiaPlayer'
import FullscreenImage from 'FullscreenImage'
import ProjectBackgroundComponents from 'ProjectBackgroundComponents'
import TextWithLineBtn from 'TextWithLineBtn'
import Work from 'Work'
import Router from 'Router'
import Utils from 'Utils'
import SplitTitle from 'SplitTitle'
import TextBtn from 'TextBtn'

export default class BlockPart extends BaseComponent {
	constructor(props) {
		super(props)
		this.isActive = false
		this.data = AppStore.workDataById(props.scope.id)
	}
	render() {
		var globalContent = AppStore.globalContent()
		var coverVisualUrl = 'image/projects/' + this.props.scope.id + '/' + 'cover.jpg'
		return (
			<div id='block-part' ref='block-part' onClick={this.props.onBlockSelected.bind(null, this.props.scope.id)} className=''>
				<div className="infos-wrapper" onClick={this.props.onBlockSelected.bind(null, this.props.scope.id)}>
					<div className="title-wrapper btn">
						<SplitTitle ref='split-text' title={this.data.title.txt}/><br/>
					</div>
					<div id='explore-btn' className="bottom-line-btn btn">
						<TextWithLineBtn ref='explore-btn' ambientColor={'#000000'} text={globalContent['explore-txt']} />
					</div>
				</div>
				<div className="main-cover-wrapper btn">
					<img src={coverVisualUrl}/>
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['block-part'])
		this.closeBtn = React.findDOMNode(this.refs['close-btn'])
		this.mainInternalPageContainer = dom(this.parent).select('#main-internal-page-container')[0]
		this.infosWrapper = dom(this.parent).select('.infos-wrapper')[0]
		this.mainTitle = dom(this.infosWrapper).select('.title')[0]
		this.mainTitleWrapper = dom(this.infosWrapper).select('.title-wrapper')[0]
		this.mainSubtitle = dom(this.infosWrapper).select('.subtitle')[0]
		this.exploreBtn = dom(this.infosWrapper).select('#explore-btn')[0]
		this.pageHolder = dom(this.mainInternalPageContainer).select('.page-holder')[0]
		this.internalPageWrapper = dom(this.mainInternalPageContainer).select('.internal-page-wrapper')[0]
		this.coverWrapper = dom(this.parent).select('.main-cover-wrapper')[0]
		this.scrollbarWrapper = dom(this.mainInternalPageContainer).select('.scrollbar-wrapper')[0]
		dom(this.mainTitle).style({
			'font-size': this.data.title['font-size'] + 'px',
			'letter-spacing': this.data.title['letter-spacing'] + 'px',
			'left': this.data.title['offset'][0] + 'px',
			'top': this.data.title['offset'][1] + 'px',
			'text-align': 'center',
			'color': '#000000'
		})
	}
	animatePageToTop() {
		var yPos = this.currentWorkPage.getCurrentScrollPagePosition()
		var tween = {val:yPos}
		TweenLite.to(tween, 0.5, { val:0, ease:Expo.easeInOut, onUpdate:()=>{
			Utils.Translate(this.internalPageWrapper, 0, -tween.val, 0)
		}})
	}
	componentOnViewport() {
	}
	getTitleScale() {
		var windowW = AppStore.Window.w
		return (windowW / AppConstants.MEDIA_GLOBAL_W) * 1
	}
	resizeElements() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var titleScale = this.getTitleScale()
		var infoWrapperSize = size(this.infosWrapper)
		var parentCss = {
			width: windowW + 'px',
			height: windowH + 'px'
		}
		var middleCoverScale = ((windowH*0.6) / AppConstants.MEDIA_COVER_H) * 1
		var coverH = AppConstants.MEDIA_COVER_H * middleCoverScale
		var coverY = (windowH >> 1) - (AppConstants.MEDIA_COVER_H * middleCoverScale >> 1)
		var middleCoverCss = { 
			width: AppConstants.MEDIA_COVER_W * middleCoverScale + 'px',
			height: coverH + 'px',
			left:(windowW >> 1) - (AppConstants.MEDIA_COVER_W * middleCoverScale >> 1) + 'px',
			top: coverY + 'px', 
		}
		var mainTitleCss = {
			scale:titleScale,
			top:coverY - (150*titleScale),
			transformOrigin: '0% 0%',
		}
		var mainTitleWrapperCss = {
			width: windowW + 'px',
			height: windowH + 'px'
		}
		var exploreTitle = dom(this.exploreBtn).select('.text-btn')[0]
		var exploreTitleSize = size(exploreTitle)
		dom(this.mainTitleWrapper).style(mainTitleWrapperCss)
		dom(this.exploreBtn).style('top', (coverH + coverY) + ((windowH-(coverH + coverY)) >> 1) - (AppConstants.GLOBAL_FONT_SIZE * 0.3) + 'px')
		dom(this.coverWrapper).style(middleCoverCss)
		dom(this.parent).style(parentCss)
		TweenLite.set(this.mainTitle, mainTitleCss)
	}
	resize() {
		if(this.currentOrientation != AppStore.Orientation) {
			this.resizeElements()
			this.currentOrientation = AppStore.Orientation
		}
	}
}
