import React from 'react'
import BaseComponent from 'BaseComponent'
import dom from 'domquery'
import size from 'element-size'

export default class InstagramFeed extends BaseComponent {
	constructor(props) {
		super(props)
		this.onImgLoaded = this.onImgLoaded.bind(this)
		this.blockIndex = -1
		this.currentGroupIndex = 1
		this.panelSize = [0, 0]
	}
	render() {
		return (
			<div id='instagram-feed' ref='instagram-feed'>
				<div className="slide-effect">
					<div className="front-slide"></div>
					<div className="back-slide"></div>
				</div>
				<a target='_blank' href=''>
					<div className="image-wrapper dynamic-wrapper">
						<div className="image-inside"></div>
						<div className="image-inside"></div>
					</div>
					<div className="text-wrapper dynamic-wrapper">
						<div className="text-inside"></div>
						<div className="text-inside"></div>
					</div>
				</a>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['instagram-feed'])
		this.postButton = dom(this.parent).select('a')[0]
		var imagesIn = dom(this.parent).select('.image-inside')
		var textsIn = dom(this.parent).select('.text-inside')
		this.imageWrapper = dom(this.parent).select('.image-wrapper')[0]
		this.textWrapper = dom(this.parent).select('.text-wrapper')[0]
		this.slideEffectWrapper = dom(this.parent).select('.slide-effect')[0]
		this.slides = {
			front: dom(this.slideEffectWrapper).select('.front-slide')[0],
			back: dom(this.slideEffectWrapper).select('.back-slide')[0]
		}
		this.containers = [
			{
				image: imagesIn[0],
				text: textsIn[0]
			},{
				image: imagesIn[1],
				text: textsIn[1]
			}
		]

		// default position
		TweenLite.set(imagesIn, { x:500 })
		TweenLite.set(textsIn, { x:500 })

		$.ajax({
		    url: "php/instagram_feed.php",
		    dataType: "JSON",
		    success: (data)=>{
		    	this.data = data.data
		    	this.updatePost()
		    }
		})

	}
	updatePost() {
		this.increaseIndex()
		this.currentGroupIndex = this.currentGroupIndex == 0 ? 1 : 0

		this.oldGroup = this.currentGroup
		this.currentGroup = this.containers[this.currentGroupIndex]

		var data = this.data[this.blockIndex]
		var imgUrl = data.images.standard_resolution.url
		var imgH = data.images.standard_resolution.height
		var text = (data.caption == undefined) ? '' : data.caption.text
		var link = data.link

		dom(this.postButton).attr('href', link)
		dom(this.currentGroup.image).add('<img src="'+imgUrl+'"/>')
		dom(this.currentGroup.text).add('<p>'+text+'</p>')

		this.currentImg = new Image()
		this.currentImg.onload = this.onImgLoaded
		this.currentImg.src = imgUrl

	}
	onImgLoaded() {
		this.props.updateComponentSize()
		this.resizeImgAndTextWrapper()
		this.updatePanelSize()
		this.animateContainers()
	}
	resizeImgAndTextWrapper() {
		var imgSize = size(this.currentGroup.image)
		var paragraph = dom(this.currentGroup.text).select('p')[0]
		var textSize = size(paragraph)
		var data = this.data[this.blockIndex]
		var imgW = data.images.standard_resolution.width
		var scale = (imgSize[0] / imgW) * 1
		var imgH = data.images.standard_resolution.height * scale
		dom(this.imageWrapper).style({
			height: imgH + 'px'
		})
		dom(this.textWrapper).style({
			height: textSize[1] + 'px'
		})
		dom(this.slideEffectWrapper).style({
			width: this.panelSize[0] + 'px',
			height: imgH + textSize[1] + 80 + 'px'
		})
	}
	animateContainers() {
		TweenMax.fromTo(this.slides.front, 0.8, { x:this.panelSize[0], transformOrigin:'100% 0%', force3D:true }, { x:-this.panelSize[0]*2, transformOrigin:'100% 0%', force3D:true, ease:Expo.easeInOut })
		TweenMax.fromTo(this.slides.back, 0.8, { x:this.panelSize[0]*2, transformOrigin:'100% 0%', force3D:true }, { x:-this.panelSize[0], transformOrigin:'100% 0%', force3D:true, ease:Expo.easeInOut })
		TweenMax.fromTo(this.currentGroup.image, 1, { x:this.panelSize[0], transformOrigin:'0% 0%', force3D:true }, { x:0, transformOrigin:'0% 0%', force3D:true, ease:Expo.easeInOut })
		TweenMax.fromTo(this.currentGroup.text, 1, { x:this.panelSize[0], transformOrigin:'0% 0%', force3D:true }, { x:0, transformOrigin:'0% 0%', force3D:true, ease:Expo.easeInOut })
		if(this.oldGroup) {
			TweenMax.to(this.oldGroup.image, 1, { x:-this.panelSize[0], transformOrigin:'0% 0%', force3D:true, ease:Expo.easeInOut })
			TweenMax.to(this.oldGroup.text, 1, { x:-this.panelSize[0], transformOrigin:'0% 0%', force3D:true, ease:Expo.easeInOut })
			setTimeout(()=>{
				this.removeOldGroup()
			}, 1000)
		}
		this.updateTimeout = setTimeout(()=>{
			this.updatePost()
		}, 4000)
	}
	removeOldGroup() {
		dom(this.oldGroup.image).remove('img')
		dom(this.oldGroup.text).remove('p')
	}
	increaseIndex() {
		this.blockIndex++
		if(this.blockIndex > this.data.length - 1) this.blockIndex = 0
	}
	decreaseIndex() {
		this.blockIndex--
		if(this.blockIndex < 0) this.blockIndex = this.data.length - 1
	}
	updatePanelSize() {
		this.panelSize = size(this.parent)
	}
	resize() {
		this.updatePanelSize()
		if(this.currentGroup != undefined) this.resizeImgAndTextWrapper()
		this.props.updateComponentSize()
	}
	componentWillUnmount() {
		clearTimeout(this.updateTimeout)
	}
}
