import AppConstants from 'AppConstants'
import AppDispatcher from 'AppDispatcher'

var AppActions = {
    pageHasherChanged: function(pageId) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.PAGE_HASHER_CHANGED,
            item: pageId
        })  
    },
    windowResize: function(windowW, windowH) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.WINDOW_RESIZE,
            item: { windowW:windowW, windowH:windowH }
        })
    },
    changeAmbient: function(color) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CHANGE_AMBIENT,
            item: { color:color }
        })
    },
    openProjectsMenu: function() {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.OPEN_PROJECTS_MENU,
            item: { }
        })  
    },
    closeProjectsMenu: function() {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CLOSE_PROJECTS_MENU,
            item: { }
        })  
    }
}

export default AppActions


      
