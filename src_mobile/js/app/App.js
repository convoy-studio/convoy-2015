import AppStore from 'AppStore'
import AppConstants from 'AppConstants'
import AppActions from 'AppActions'
import AppTemplate from 'AppTemplate'
import React from 'react'
import Router from 'Router'
import Preload from 'Preloader'
import GEvents from 'GlobalEvents'
import dom from 'domquery'

class App {
	constructor() {
		this.onMainDataLoaded = this.onMainDataLoaded.bind(this)
	}
	init() {
		AppStore.Detector.type = DeviceType
		dom('html').addClass(DeviceType)

		// Init global events
		window.GlobalEvents = new GEvents()
		GlobalEvents.init()

		window.Preloader = new Preload()
		Preloader.load({id:'main-data', src: 'data/data.json'}, this.onMainDataLoaded)
	}
	onMainDataLoaded() {
		AppStore.Data = Preloader.getContentById('main-data')
		
		// Init router
		var router = new Router()
		router.init()

		// Render react
		React.render(
			<AppTemplate />,
			document.getElementById('app-container')
		)

		// Start routing
		router.beginRouting()
	}
}

export default App
    	
