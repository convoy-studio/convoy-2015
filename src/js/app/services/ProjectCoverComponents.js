import React from 'react'
import FullscreenImage from 'FullscreenImage'
import WistiaPlayer from 'WistiaPlayer'
import AppConstants from 'AppConstants'

class ProjectCoverComponents {
	static getVideo(id, videoDidReady) {
		return <WistiaPlayer ref='fullscreen-video' didReady={videoDidReady} type={AppConstants.HOME_COVER} videoId={id}/>
	}
	static getFullscreenImage(url, ref) {
		var emptyImg = 'image/empty.png'
		return <img data-src={url} ref={ref} src={emptyImg}/>
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
		return <div style={style} />
	}
}

export default ProjectCoverComponents