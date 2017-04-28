import React from 'react'
import FullscreenImage from 'FullscreenImage'
import WistiaPlayer from 'WistiaPlayer'
import AppConstants from 'AppConstants'

class ProjectPageComponents {
	static getParagraph(data, index, type) {
		var markup = function() {
			return {__html: data.text} 
		}
		var clazzes = type
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <div key={index} className={clazzes} dangerouslySetInnerHTML={markup()}></div>
	}
	static getWistiaVideo(data, index, type, videoDidReady) {
		var clazzes = type
		var ref = 'fullscreen-video-' + index
		if(data['extra-class'] !=  undefined) clazzes += ' ' + data['extra-class']
		return <WistiaPlayer key={index} className={clazzes} didReady={videoDidReady} type={AppConstants.PROJECT} ref={ref} videoId={data.id}/>
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
		return <FullscreenImage key={index} didLoad={imageDidLoad} imgurl={url} />
	}
	static getMargin(index, type) {
		return (
			<div key={index} id="extra-margin" className={type} />
		)
	}
}

export default ProjectPageComponents