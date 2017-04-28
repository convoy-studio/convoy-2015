import React from 'react'
import AppStore from 'AppStore'
import BaseBlockList from 'BaseBlockList'
import BlockPart from 'BlockPart'
import Router from 'Router'

export default class ProjectsBlockList extends BaseBlockList {
	constructor(props) {
		super(props)
		this.blockIndex = -1
	}
	componentWillMount() {
		this.listItemClicked = this.listItemClicked.bind(this)
		this.blockSelected = this.blockSelected.bind(this)
		this.blockParts = AppStore.pageContentById('works').slides
		super.componentWillMount()
	}
	componentDidMount() {
		super.componentDidMount()
		var currentBlock = this.refs['block-part-wrapper-0']
		currentBlock.componentOnViewport()
	}
	blockOnViewport() {
		super.blockOnViewport()
	}
	render() {
		var that = this
		var blockParts = this.blockParts.map(function(part, i) {
			var ref = 'block-part-wrapper-' + i
			return(
				<BlockPart onBlockSelected={that.blockSelected} key={i} ref={ref} scope={part} />
			)
		})
		return (
			<div ref='block-list-wrapper' id='block-list-wrapper'>
				<div className='blocks-wrapper' ref="blocks-wrapper" id="works-part">
					{blockParts}
				</div>
			</div>
		)
		super.render()
	}
	openPage() {
		var currentBlockPartId = 'block-part-wrapper-' + this.blockIndex
		this.refs[currentBlockPartId].openPage()
	}
	closePage() {
		var currentBlockPartId = 'block-part-wrapper-' + this.blockIndex
		this.refs[currentBlockPartId].closePage()
	}
	getBlockByIndex(index) {
		var currentBlockPartId = 'block-part-wrapper-' + index
		return this.refs[currentBlockPartId]
	}
	transitionInSlide(currentDirection) {
		var currentBlockPartId = 'block-part-wrapper-' + this.blockIndex
		this.refs[currentBlockPartId].transitionInSlide(currentDirection)
	}
	transitionOutSlide() {
		var currentBlockPartId = 'block-part-wrapper-' + this.oldBlockIndex
		var component = this.refs[currentBlockPartId]
		if(component != undefined) {
			component.transitionOutSlide()
		}
	}
	onWheelInertia(direction) {
		this.props.toTriggerBlockMove(direction)
	}
	blockSelected(id, e) {
		e.preventDefault()
		Router.setHash('works/' + id)
	}
	resize() {
		super.resize()
	}
}
