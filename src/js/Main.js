import TweenMax from 'gsap'
import Pager from 'Pager'
import raf from 'raf'
import App from 'App'
import wheel from 'jquery-mousewheel'

window.jQuery = window.$ = $
wheel($)

// Start App
var app = new App()
app.init()
