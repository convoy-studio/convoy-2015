import React from 'react'
import FullscreenImage from 'FullscreenImage'
import WistiaPlayer from 'WistiaPlayer'
import AppConstants from 'AppConstants'
import Slideshow from 'Slideshow'
import DiscoverBtn from 'DiscoverBtn'

class ProjectPageComponents {
	static getParagraph(data, index, type) {
		var markup = function() {
			return {__html: data.text} 
		}
		var clazzes = type
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <div key={index} className={clazzes} dangerouslySetInnerHTML={markup()}></div>
	}
	static getVideo(data, index, type, videoDidReady) {
		var clazzes = type
		var ref = 'fullscreen-video-' + index
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <WistiaPlayer key={index} className={clazzes} didReady={videoDidReady} type={AppConstants.PROJECT} ref={ref} videoId={data.id}/>
	}
	static getSlideshow(workId, data, index, type, didLoad) {
		var clazzes = type
		var ref = 'slideshow-' + index
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <Slideshow key={index} className={clazzes} didReady={didLoad} ref={ref} images={data.assets} workId={workId}/>
	}
	static getTitleParagraph(data, index, type) {
		var markup = function() {
			return {__html: data.text} 
		}
		var clazzes = type
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return (
			<div key={index} className={clazzes} >
				<div className="title">{data.title}</div>
				<div className="paragraph" dangerouslySetInnerHTML={markup()}></div>
			</div>
		)
	}
	static getFullscreenImage(workId, data, index, imageDidLoad) {
		var url = 'image/projects/' + workId + '/' + data.name
		var clazzes = data.type
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <FullscreenImage key={index} className={clazzes} didLoad={imageDidLoad} imgurl={url} />
	}
	static getMargin(data, index, type) {
		var clazzes = data.type
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return (
			<div key={index} id="extra-margin" className={clazzes} />
		)
	}
	static getLink(data, index, type) {
		var clazzes = type
		return (
			<DiscoverBtn vars={data.vars} key={index} className={clazzes} />	
		)
	}
}

export default ProjectPageComponents