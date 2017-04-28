import React from 'react'
import BaseComponent from 'BaseComponent'
import FullscreenImage from 'FullscreenImage'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import dom from 'domquery'
import size from 'element-size'
import WistiaPlayer from 'WistiaPlayer'
import SVGComponent from 'SVGComponent'

export default class Landing extends BaseComponent {
	render() {
		var content = AppStore.pageContentById('works')
		return (
			<div ref='landing' id='landing'>
				<div className="full-block">
					{/*<WistiaPlayer ref='fullscreen-top-video' videoId="cfkz2ynx3u"/>*/}
					<div className="bcp">
						<SVGComponent width="1922" viewBox="0 0 68.81 32.582">
							<path d="M3.469,0L4.77,1.166V3.24H2.988V1.611H1.781v5.256h1.207V4.834H4.77v2.473L3.469,8.473H1.266L0,7.307V1.166L1.266,0H3.469z M13.788,4.178l1.084,0.826v3.469h-1.781V5.004h-1.16v3.469h-1.775V0h3.381l1.201,1.119v2.215L13.788,4.178z M13.091,1.611h-1.16v1.811h1.16V1.611z M23.874,6.867h-1.98V4.775h1.652V3.17h-1.652V1.611h1.98V0h-3.756v8.473h3.756V6.867z M32.98,0l1.248,8.473h-1.799l-0.193-1.582h-1.477l-0.182,1.582h-1.74L30.132,0H32.98z M32.031,5.279l-0.434-3.697h-0.176l-0.457,3.697H32.031z M38.659,1.611h1.248v6.861h1.787V1.611h1.248V0h-4.283V1.611z M48.141,8.473h1.775V0h-1.775V8.473z M57.681,6.891h-0.205L56.854,0h-1.852l1.072,8.473h2.889L59.972,0h-1.822L57.681,6.891z M68.768,6.867h-1.98V4.775h1.652V3.17h-1.652V1.611h1.98V0h-3.756v8.473h3.756V6.867z M3.686,16.086l1.084,0.826v2.303l-1.248,1.166H0.053v-8.473h3.381l1.201,1.119v2.215L3.686,16.086z M2.988,16.913h-1.16v1.863h1.16V16.913z M2.988,13.52h-1.16v1.811h1.16V13.52z M12.625,18.776h-1.16v-6.867H9.689v7.307l1.248,1.166h2.221l1.248-1.166v-7.307h-1.781V18.776z M21.184,15.219V13.52h1.16v1.137h1.611v-1.582l-1.26-1.166h-2.039l-1.248,1.166v2.566l1.365,1.248l1.57,0.135v1.752h-1.16v-1.119h-1.775v1.559l1.248,1.166h2.221l1.248-1.166v-2.613l-1.371-1.248L21.184,15.219z M29.162,11.909v8.473h1.775v-8.473H29.162z M37.539,15.284l1.582,5.098h1.559v-8.473h-1.559v4.752l-1.465-4.752h-1.664v8.473h1.547V15.284z M49.443,18.776h-1.98v-2.092h1.652v-1.605h-1.652V13.52h1.98v-1.611h-3.756v8.473h3.756V18.776z M57.843,20.381l1.248-1.166v-2.613l-1.371-1.248l-1.57-0.135V13.52h1.16v1.137h1.611v-1.582l-1.26-1.166h-2.039l-1.248,1.166v2.566l1.365,1.248l1.57,0.135v1.752h-1.16v-1.119h-1.775v1.559l1.248,1.166H57.843z M67.439,15.354l-1.57-0.135V13.52h1.16v1.137h1.611v-1.582l-1.26-1.166h-2.039l-1.248,1.166v2.566l1.365,1.248l1.57,0.135v1.752h-1.16v-1.119h-1.775v1.559l1.248,1.166h2.221l1.248-1.166v-2.613L67.439,15.354z M3.27,24.109l1.365,1.166v3.275L3.27,29.729H1.828v2.854H0.053v-8.473H3.27z M2.859,25.721H1.828v2.385h1.031V25.721z M12.855,24.109l1.248,8.473h-1.799L12.111,31h-1.477l-0.182,1.582h-1.74l1.295-8.473H12.855z M11.906,29.389l-0.434-3.697h-0.176l-0.457,3.697H11.906z M22.247,28.287l1.084,0.826v3.469h-1.781v-3.469h-1.16v3.469h-1.775v-8.473h3.381l1.201,1.119v2.215L22.247,28.287z M21.549,25.721h-1.16v1.811h1.16V25.721z M27.771,25.721h1.248v6.861h1.787v-6.861h1.248v-1.611h-4.283V25.721z M39.771,28.861l-1.465-4.752h-1.664v8.473h1.547v-5.098l1.582,5.098h1.559v-8.473h-1.559V28.861z M46.145,32.582h3.756v-1.605h-1.98v-2.092h1.652v-1.605H47.92v-1.559h1.98v-1.611h-3.756V32.582z M58.273,28.287l1.084,0.826v3.469h-1.781v-3.469h-1.16v3.469h-1.775v-8.473h3.381l1.201,1.119v2.215L58.273,28.287z M57.576,25.721h-1.16v1.811h1.16V25.721z M65.802,27.42v-1.699h1.16v1.137h1.611v-1.582l-1.26-1.166h-2.039l-1.248,1.166v2.566l1.365,1.248l1.57,0.135v1.752h-1.16v-1.119h-1.775v1.559l1.248,1.166h2.221l1.248-1.166v-2.613l-1.371-1.248L65.802,27.42z"/>
						</SVGComponent>
					</div>
				</div>
				<div ref='block-list-wrapper' id='block-list-wrapper'>
					<div className='blocks-wrapper' ref="blocks-wrapper">
						<div id='block-part' className='full-block'>
							<div className="infos-wrapper global-transparent">
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.parent = React.findDOMNode(this.refs['landing'])
		this.infosWrapper = dom(this.parent).select('.infos-wrapper')[0]
		this.bcp = dom(this.parent).select('.bcp')[0]
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		var infosSize = size(this.infosWrapper)
		var bcpScale = (windowW / 1920) * 1
		var bcpY = (windowH >> 1) - ((910 * bcpScale) >> 1)

		dom(this.infosWrapper).style('top', (windowH * 0.45) - (infosSize[1] >> 1) + 'px')
		TweenLite.set(this.bcp, { scale: bcpScale, y:bcpY, transformOrigin: '0% 0%' })
	}
}