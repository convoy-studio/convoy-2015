import React from 'react'
import FullscreenImage from 'FullscreenImage'
import WistiaPlayer from 'WistiaPlayer'
import AppConstants from 'AppConstants'

class ProjectBackgroundComponents {
	static getVideo(id, videoDidReady) {
		return <WistiaPlayer ref='fullscreen-video' didReady={videoDidReady} type={AppConstants.HOMEPAGE} videoId={id}/>
	}
	static getFullscreenImage(url) {
		return <FullscreenImage ref='fullscreen-img' imgurl={url} />
	}
	static getFullscreenPattern(url) {
		var style = {
			backgroundImage: 'url('+url+')',
			width: '100%',
			height: '100%',
			zIndex: 3,
			position: 'absolute',
			top: 0,
			left: 0,
		}
		return <div style={style} />
	}
	static getBackgroundColor(color) {
		var style = {
			backgroundColor: color,
			width: '100%',
			height: '100%',
			zIndex: 3,
			position: 'absolute',
			top: 0,
			left: 0,
		}
		return <div className='block-background' style={style} />
	}
}

export default ProjectBackgroundComponents