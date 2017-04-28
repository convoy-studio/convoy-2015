import React from 'react'
import dom from 'domquery'
import AppStore from 'AppStore'
import size from 'element-size'
import Utils from 'Utils'

export default class ViewSmoothScrollbar extends React.Component {
    constructor(props) {
        super(props)
        this.pageHeight = 0
        this.scrollTarget = 0
        this.newPosY = 0
        this.ease = 0.1
        this.grabOffsetY = 0

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onBarMouseEnter = this.onBarMouseEnter.bind(this)
        this.onBarMouseLeave = this.onBarMouseLeave.bind(this)
        this.onGrabBgMouseDown = this.onGrabBgMouseDown.bind(this)
    }
    render() {
        var col = {
            backgroundColor: this.props.color
        }
        return (
            <div onMouseEnter={this.onBarMouseEnter} onMouseLeave={this.onBarMouseLeave} ref='view-smooth-scrollbar' className='view-smooth-scrollbar global-transparent global-hover btn'>
                <div className="relative">
                    <div className="scroll-grab btn">
                        <div style={col} className="scroll-inside"></div>
                    </div>
                    <div className="scroll-bg"></div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.element = React.findDOMNode(this.refs['view-smooth-scrollbar'])
        this.grab = dom(this.element).select(".scroll-grab.btn")[0]
        this.grabBg = dom(this.element).select(".scroll-bg")[0]
        dom(this.grab).on("mousedown", this.onMouseDown)
        dom(this.grabBg).on("mousedown", this.onGrabBgMouseDown)
        var grabSize = size(this.grab)
        this.grabW = grabSize[0]
        this.grabH = grabSize[1]
    }
    setScrollTarget(val) {
        this.scrollTarget = val
    }
    onMouseDown(e) {
        e.preventDefault()
        dom(window).on("mousemove", this.onMouseMove)
        dom(window).on("mouseup", this.onMouseUp)
        this.grabOffsetY = e.offsetY
    }
    onGrabBgMouseDown(e) {
        var windowH = AppStore.Window.h
        var posY = (this.pageHeight / windowH) * (e.offsetY)
        this.props.scrollTargetHandler(posY)
    }
    onMouseUp(e) {
        e.preventDefault()
        this.killAllEvents()
    }
    onMouseMove(e) {
        e.preventDefault()
        var windowH = AppStore.Window.h
        var posY = (this.pageHeight / windowH) * (e.clientY - this.grabOffsetY)
        this.props.scrollTargetHandler(posY)
    }
    onBarMouseEnter(e) {
        e.preventDefault()
        dom(this.grab).addClass('hovered')
        dom(this.grabBg).addClass('hovered')
    }
    onBarMouseLeave(e) {
        e.preventDefault()
        dom(this.grab).removeClass('hovered')
        dom(this.grabBg).removeClass('hovered')
    }
    update() {
        var windowH = AppStore.Window.h
        var posY = Math.round((this.scrollTarget / (this.pageHeight-windowH)) * (windowH - this.grabH))
        if(isNaN(posY)) return
        this.newPosY += (posY - this.newPosY) * this.ease
        var p = this.newPosY
        Utils.Translate(this.grab, 0, p, 0)
    }
    killAllEvents() {
        dom(window).off("mousemove", this.onMouseMove)
        dom(window).off("mouseup", this.onMouseUp)
    }
    setPageHeight(height)  {
        this.pageHeight = height
    }
    componentWillUnmount() {
        this.killAllEvents()
        dom(this.grab).off("mousedown", this.onMouseDown)
        dom(this.grabBg).off("mousedown", this.onGrabBgMouseDown)
    }
}
