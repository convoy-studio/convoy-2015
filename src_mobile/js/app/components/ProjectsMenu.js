import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import dom from 'domquery'
import Img from 'Img'
import AppConstants from 'AppConstants'
import Utils from 'Utils'
import AppActions from 'AppActions'
import Router from 'Router'

export default class ProjectsMenu extends BaseComponent {
	constructor(props) {
		super(props)
		this.thumbnailDidLoad = this.thumbnailDidLoad.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onBackgroundClicked = this.onBackgroundClicked.bind(this)
		this.onProjectPartClicked = this.onProjectPartClicked.bind(this)
		this.didHasherChange = this.didHasherChange.bind(this)
		this.totalW = 0
		this.newPosX = 0
		this.ease = 0.1
		this.offset = 40
		this.mouse = [0, 0]
		this.isOpened = false

		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
	}
	render() {
		var menuItems = AppStore.pageContentById('works').slides
		var projects = menuItems.map((project, index)=>{
			var id = project.id
			var data = AppStore.workDataById(id)
			var imgurl = 'image/projects/' + id + '/thumbnail.jpg'
			return (
				<div key={index} className="project-part btn" onClick={this.onProjectPartClicked.bind(this, id)}>
					<div className="media-wrapper">
						<Img src={imgurl} id={id} didLoad={this.thumbnailDidLoad} />
					</div>
					<div className="title">{data.title.txt.toLowerCase()}</div>
				</div>
			)
		})
		return (
			<div ref='projects-menu' id='projects-menu'>
				<div className="projects-parts-wrapper">{projects}</div>
				<div className="background" onClick={this.onBackgroundClicked}></div>
			</div>
		)
	}
	componentDidMount() {
		var menuItems = AppStore.pageContentById('works').slides
		this.parent = React.findDOMNode(this.refs['projects-menu'])
		this.wrapper = dom(this.parent).select('.projects-parts-wrapper')[0]
		this.background = dom(this.parent).select('.background')[0]
		var projectsParts = dom(this.parent).select('.project-part')
		this.projects = []
		for (var i = 0; i < projectsParts.length; i++) {
			var id = menuItems[i].id
			var part = projectsParts[i]
			var mediaImg = dom(part).select('img')[0]
			this.projects[i] = {
				id: id,
				parent: part,
				mediaWrapper: dom(part).select('.media-wrapper')[0],
				mediaImg: mediaImg,
				mediaOrientation: undefined,
				title: dom(part).select('.title')[0],
				mediaImgOriginalSize: [0, 0],
				blockSize: [0, 0]
			}
		}
	}
	onMouseMove(e) {
		e.preventDefault()
		this.mouse[0] = e.pageX - this.offset
		this.mouse[1] = e.pageY
	}
	onBackgroundClicked(e) {
		e.preventDefault()
		this.callCloseMenuAction()
	}
	thumbnailDidLoad(props) {
		this.updateMediaImgSize(props)
	}
	didHasherChange() {
		if(this.isOpened) {
			this.callCloseMenuAction()
		}
	}
	updateMediaImgSize(props) {
		var project = this.getProjectById(props.id)
		var imgW = props.size[0]
		var imgH = props.size[1]
		project.mediaImgOriginalSize[0] = imgW
		project.mediaImgOriginalSize[1] = imgH
		if(imgW > imgH) project.mediaOrientation = AppConstants.LANDSCAPE
		else project.mediaOrientation = AppConstants.PORTRAIT
		this.resizeProjects()
	}
	onProjectPartClicked(id, e) {
		e.preventDefault()
		Router.setHash('/works/' + id)
	}
	callCloseMenuAction() {
		setTimeout(()=>{ AppActions.closeProjectsMenu() }, 0)
	}
	open() {
		if(this.isOpened) {
			this.callCloseMenuAction()
		}else{
			dom(window).on("mousemove", this.onMouseMove)
			this.tl.timeScale(1.2).play(0)
			this.isOpened = true
			this.addEvents()
			dom(this.background).style('visibility', 'visible');
		}
	}
	close() {
		this.isOpened = false
		this.tl.timeScale(1.4).reverse()
		this.removeEvents()
		dom(this.background).style('visibility', 'hidden');
	}
	addEvents() {
		dom(window).on("mousemove", this.onMouseMove)
	}
	removeEvents() {
		dom(window).off("mousemove", this.onMouseMove)	
	}
	getProjectById(id) {
		for (var i = 0; i < this.projects.length; i++) {
			var project = this.projects[i]
			if(project.id == id) {
				return project
			}
		}
	}
	resizeProjects() {
		if(AppStore.Detector.type == AppConstants.PHONE) return

		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var maxW = windowW * 0.28
		var maxH = windowH * 0.4
		this.parentH = maxH
		var projects = this.projects
		var totalX = 0
		var currentBlockX;
		var biggestH = 0

		if(this.tl != undefined) this.tl.clear()
		else this.tl = new TimelineMax()

		for (var i = 0; i < projects.length; i++) {
			var project = projects[i]
			var blockSize = this.getBlockSizeByOrientation(maxW, maxH, project)
			project.blockSize[0] = blockSize[0]
			project.blockSize[1] = blockSize[1]
			biggestH = (biggestH < blockSize[1]) ? blockSize[1] : biggestH
			dom(project.parent).style({
				left: totalX + 'px',
				width: blockSize[0] + 'px',
				height: blockSize[1] + 'px'
			})
			dom(project.mediaWrapper).style({
				top: -blockSize[1] + 'px',
			})
			dom(project.title).style({
				top: -biggestH- windowH*0.1 + 'px'
			})
			totalX += blockSize[0]
			currentBlockX = blockSize[0]
			this.tl.fromTo(project.parent, 1, { y:blockSize[1] }, { y:0, force3D:true, ease:Expo.easeInOut }, 0.05*i)
			this.tl.fromTo(project.parent, 1, { x:windowW >> 1 }, { x:0, force3D:true, ease:Expo.easeInOut }, 0)
			this.tl.fromTo(project.title, 1, { y:20, opacity:0 }, { y:0, opacity:1, force3D:true, ease:Expo.easeInOut }, 0.1 + (0.05*i))
		};

		this.tl.pause(0)
		this.totalW = totalX - windowW + this.offset
	}
	getBlockSizeByOrientation(maxW, maxH, project) {
		var scale, w, h;
		if(project.mediaOrientation == AppConstants.LANDSCAPE) {
			scale = (maxW / project.mediaImgOriginalSize[0]) * 1
			w = maxW
			h = project.mediaImgOriginalSize[1] * scale
		}else{
			scale = (maxH / project.mediaImgOriginalSize[1]) * 1
			w = project.mediaImgOriginalSize[0] * scale
			h = maxH
		}
		return [ w, h ]
	}
	update() {
		var windowW = AppStore.Window.w
		var posX = (this.mouse[0] / windowW) * (this.totalW)
		if(isNaN(posX)) return
		this.newPosX += (posX - this.newPosX) * this.ease
        Utils.Translate(this.wrapper, -this.newPosX, 0, 0)
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		this.resizeProjects()

		dom(this.wrapper).style('top', windowH+'px')
		dom(this.background).style({
			width: windowW + 'px',
			height: windowH + 'px'
		})
	}
	componentWillUnmount() {
		AppStore.off(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
	}
}
