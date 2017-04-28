import AppDispatcher from 'AppDispatcher'
import AppConstants from 'AppConstants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import Router from 'Router'

function _pageRouteIdChanged(id) {
}
function _getPageContent() {
    var hashObj = Router.getNewHash()
    var content = AppStore.Data.routing[hashObj.hash]
    return content
}
function _getPageContentById(id) {
    return AppStore.Data.routing['/' + id]
}
function _getWorkDataById(id) {
    var works = AppStore.Data.works
    for (var i = 0; i < works.length; i++) {
        var w = works[i]
        if(w.id == id) {
            return w
        }
    };
}
function _getNextPreviousProject() {
    var currentId = Router.getNewHash().parts[1]
    var works = AppStore.getAllWorks()
    var previous = ''
    var next = ''
    for (var i = 0; i < works.length; i++) {
        if(works[i].id === currentId) {
            var previousIndex = i - 1
            var nextIndex = i + 1
            previousIndex = (previousIndex < 0) ? works.length-1 : previousIndex
            nextIndex = (nextIndex > works.length-1) ? 0 : nextIndex
            previous = works[previousIndex]
            next = works[nextIndex]
        }
    }
    return { previous:previous, next:next }
}
function _getAllWorks() {
    return AppStore.Data.routing['/works'].slides
}
function _getMenuContent() {
    return AppStore.Data.menu
}
function _getAppData() {
    return AppStore.Data
}
function _getDefaultRoute() {
    return AppStore.Data['default-route']
}
function _getGlobalContent() {
    return AppStore.Data.content
}
function _windowWidthHeight() {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    }
}

var AppStore = assign({}, EventEmitter2.prototype, {
    emitChange: function(type, item) {
        this.emit(type, item)
    },
    pageContent: function() {
        return _getPageContent()
    },
    menuContent: function() {
        return _getMenuContent()
    },
    pageContentById: function(id) {
        return _getPageContentById(id)
    },
    workDataById: function(id) {
        return _getWorkDataById(id)
    },
    appData: function() {
        return _getAppData()
    },
    getAllWorks: function() {
        return _getAllWorks()
    },
    getNextPreviousProject: function() {
        return _getNextPreviousProject()
    },
    defaultRoute: function() {
        return _getDefaultRoute()
    },
    globalContent: function() {
        return _getGlobalContent()
    },
    Window: function() {
        return _windowWidthHeight()
    },
    MenuIsOpened: false,
    Orientation: AppConstants.LANDSCAPE,
    Detector: {},
    dispatcherIndex: AppDispatcher.register(function(payload){
        var action = payload.action
        switch(action.actionType) {
            case AppConstants.PAGE_HASHER_CHANGED:
                _pageRouteIdChanged(action.item)
                AppStore.emitChange(action.actionType)
                break
            case AppConstants.WINDOW_RESIZE:
                AppStore.Window.w = action.item.windowW
                AppStore.Window.h = action.item.windowH
                AppStore.Orientation = (AppStore.Window.w > AppStore.Window.h) ? AppConstants.LANDSCAPE : AppConstants.PORTRAIT
                AppStore.emitChange(action.actionType)
                break
            case AppConstants.CHANGE_AMBIENT:
                AppStore.emitChange(action.actionType, action.item)
                break
            case AppConstants.OPEN_PROJECTS_MENU:
                AppStore.MenuIsOpened = true
                AppStore.emitChange(action.actionType)
                break
            case AppConstants.CLOSE_PROJECTS_MENU:
                AppStore.MenuIsOpened = false
                AppStore.emitChange(action.actionType)
                break
        }
        return true
    })
})



export default AppStore

