import hasher from 'hasher'
import AppActions from 'AppActions'
import crossroads from 'crossroads'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'

class Router {
	init() {
		this.routing = AppStore.Data.routing
		this.defaultRoute = this.routing['/']
		this.newHashFounded = false
		hasher.newHash = undefined
		hasher.oldHash = undefined
		hasher.prependHash = '!/'
		hasher.initialized.add(this._didHasherChange.bind(this))
		hasher.changed.add(this._didHasherChange.bind(this))
		this._setupCrossroads()
	}
	beginRouting() {
		hasher.init()
	}
	_setupCrossroads() {

		var allSlides = []
		var slides = AppStore.pageContentById('works').slides
		for (var i = 0; i < slides.length; i++) {
			var slide = slides[i]
			allSlides[i] = slide.id
		};

	    var workPages = crossroads.addRoute('works/{id}', this._onWorksURLHandler.bind(this))
	    workPages.rules = {
	    	id: allSlides
	    }

		var homeSection = crossroads.addRoute('{page}', this._onHomeURLHandler.bind(this))
		var validSects = ['works']
		homeSection.rules = {
	        page : validSects //valid sections
	    }

	    var aboutSection = crossroads.addRoute('{page}', this._onAboutURLHandler.bind(this))
		aboutSection.rules = {
	        page : ['about'] //valid sections
	    }
	}
	_onHomeURLHandler(pageId) {
		this._assignRoute(pageId, 'home')
	}
	_onAboutURLHandler(pageId) {
		this._assignRoute(pageId, 'about')
	}
	_onWorksURLHandler(workId) {
		this._assignRoute(workId, 'works')
	}
	_onDefaultURLHandler() {
		this._sendToDefault()
	}
	_assignRoute(id, parentPage) {
		var hash = hasher.getHash()
		var parts = this._getURLParts(hash)
		this._updatePageRoute(hash, parts, parts[0], id, parentPage)
		this.newHashFounded = true
	}
	_getURLParts(url) {
		var hash = url
		return hash.split('/')
	}
	_updatePageRoute(hash, parts, parent, targetId, parentPage) {
		hasher.oldHash = hasher.newHash
		hasher.newHash = {
			hash: hash,
			parts: parts,
			parent: parent,
			targetId: targetId,
			parentPage: parentPage
		}
		AppActions.pageHasherChanged()
	}
	_didHasherChange(newHash, oldHash) {
		this.newHashFounded = false
		crossroads.parse(newHash)
		if(this.newHashFounded) return
		// If URL don't match a pattern, send to default
		this._onDefaultURLHandler()
	}
	_sendToDefault() {
		hasher.setHash('works')
	}
	static getBaseURL() {
		return document.URL.split("#")[0]
	}
	static getHash() {
		return hasher.getHash()
	}
	static getRoutes() {
		return data.routing
	}
	static getNewHash() {
		return hasher.newHash
	}
	static getOldHash() {
		return hasher.oldHash
	}
	static setHash(hash) {
		hasher.setHash(hash)
	}
}

export default Router
