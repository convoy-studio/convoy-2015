import React from 'react'
import Utils from 'Utils'
import AppConstants from 'AppConstants'
import dom from 'domquery'
import SVGComponent from 'SVGComponent'

export default class ScrollDownBtn extends React.Component {
	render() {
		return (
			<div ref='scroll-down-btn' id='scroll-down-btn' onClick={this.props.clickBtn} className='arrow-container btn'>
				<div className="arrow bottom">
					<SVGComponent width="100%" viewBox="0 0 28.347 28.346">
						<polyline fill="none" stroke="black" strokeWidth="1" strokeMiterlimit="10" points="25.366,9.577 14.173,20.77 2.98,9.577 "/>
					</SVGComponent>
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.onMouseEnter = this.onMouseEnter.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)

		this.parent = React.findDOMNode(this.refs['scroll-down-btn'])
		this.arrowBtn = dom(this.parent).select('.arrow')[0]
		this.width = this.arrowBtn.offsetWidth 
		this.height = this.arrowBtn.offsetHeight
		this.parent.style.width = this.width + 'px'
		this.parent.style.height = this.height + 'px'

		dom(this.parent).on('mouseenter', this.onMouseEnter)
		dom(this.parent).on('mouseleave', this.onMouseLeave)
	}
	onMouseEnter(e) {
		e.preventDefault()
		Utils.Translate(this.arrowBtn, 0, 10, 0)
	}
	onMouseLeave(e) {
		e.preventDefault()
		Utils.Translate(this.arrowBtn, 0, 0, 0)
	}
	componentWillUnmount() {
		dom(this.parent).off('mouseenter', this.onMouseEnter)
		dom(this.parent).off('mouseleave', this.onMouseLeave)
	}
}
