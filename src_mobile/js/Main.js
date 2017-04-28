import TweenMax from 'gsap'
import Pager from 'Pager'
import raf from 'raf'
import wheel from 'jquery-mousewheel'
import App from 'App'

window.jQuery = window.$ = $
wheel($)

// Start App
var app = new App()
app.init()
