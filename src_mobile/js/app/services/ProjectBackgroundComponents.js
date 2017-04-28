import React from 'react'
import FullscreenImage from 'FullscreenImage'
import WistiaPlayer from 'WistiaPlayer'

class ProjectBackgroundComponents {
	static getWistiaVideo(id) {
		return <WistiaPlayer ref='fullscreen-video' videoId={id}/>
	}
	static getFullscreenImage(url) {
		return <FullscreenImage ref='fullscreen-img' imgurl={url} />
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

export default ProjectBackgroundComponents