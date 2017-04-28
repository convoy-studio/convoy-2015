import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import dom from 'domquery'
import AppConstants from 'AppConstants'
import Utils from 'Utils'

export default class BaseBlockList extends BaseComponent {
	constructor(props) {
		super(props)
		this.blockIndex = 0
		this.oldBlockIndex = 0
		this.isAnimate = false
	}
	componentWillMount() {
		this.resize = this.resize.bind(this)
		this.wrapperAnimationFinished = this.wrapperAnimationFinished.bind(this)
		this.listItemClicked = this.listItemClicked.bind(this)
		this.triggerBlockMove = this.triggerBlockMove.bind(this)
	}
	componentDidMount() {
		this.wrapper = React.findDOMNode(this.refs['block-list-wrapper'])
		this.blocksWrapper = React.findDOMNode(this.refs['blocks-wrapper'])
		this.blocks = dom(this.blocksWrapper).select('.full-block')
		this.moveBlock()
	}
	willChangeAmbient(color) {
		var currentBlockPartId = 'block-part-wrapper-' + this.blockIndex
		this.refs[currentBlockPartId].willChangeAmbient(color)
	}
	onWorkPageScrollTriggered(item) {
		var currentBlockPartId = 'block-part-wrapper-' + this.blockIndex
		this.refs[currentBlockPartId].onWorkPageScrollTriggered(item)	
	}
	render() {
	}
	onKeyPressed(e) {
		e.preventDefault()
		var up = 38
		var down = 40
		var space = 32
		var pageup = 36
		var pagedown = 35
		switch(e.keyCode) {
			case up:
				this.triggerBlockMove(1)
				break
			case down:
				this.triggerBlockMove(-1)
				break
			case pageup:
				this.triggerBlockMove(1)
				break
			case pagedown:
				this.triggerBlockMove(-1)
				break
			case space:
				this.triggerBlockMove(-1)
				break
		}
	}
	triggerBlockMove(direction) {
		if(AppStore.MenuIsOpened) return
		if(this.isAnimate) return
		if(direction > 0) this.decreaseIndex()
		else this.increaseIndex()
		this.moveBlock()
	}
	listItemClicked(index) {
		this.setBlockIndex(index)
		this.moveBlock()
		this.props.listItemClicked(this.blockIndex)
	}
	changeSlideByIndex(index) {
		this.setBlockIndex(index)
		this.moveBlock()
	}
	positionBlocksWrapper() {
		if(this.blockIndex < 0) return
		var yPos = this.blockIndex * AppStore.Window.h
		Utils.Translate(this.blocksWrapper, 0, -yPos, 0)
	}
	moveBlock() {
		if(this.blockIndex < 0) return
		this.isAnimate = true

		this.positionBlocksWrapper()

		TweenLite.killDelayedCallsTo(this.wrapperAnimationFinished)
		TweenLite.delayedCall(0.4, this.wrapperAnimationFinished)

		this.toggleBlockPartActivation()
		this.blockOnViewport()
	}
	toggleBlockPartActivation() {
		if(this.blockIndex < 0) return
		for (var i = 0; i < this.blockParts.length; i++) {
			var blockPart = this.refs['block-part-wrapper-'+i]
			if(blockPart === undefined) break
			if(i == this.blockIndex) blockPart.activate()
			else blockPart.disactivate()
		}
	}
	disableAllBlockParts() {
		for (var i = 0; i < this.blockParts.length; i++) {
			var blockPart = this.refs['block-part-wrapper-'+i]
			blockPart.disactivate()
		}	
	}
	blockOnViewport() {
		var index = this.blockIndex
		var nextIndex = (index + 1) > this.blockParts.length-1 ? 0 : (index + 1)
		var previousIndex = (index - 1) < 0 ? this.blockParts.length-1 : (index - 1)
		var currentBlock = this.refs['block-part-wrapper-' + (index)]
		var previousBlock = this.refs['block-part-wrapper-' + previousIndex]
		var nextBlock = this.refs['block-part-wrapper-' + nextIndex]
		currentBlock.componentOnViewport()
		previousBlock.componentOnViewport()
		nextBlock.componentOnViewport()
	}
	disactivateAllBlock() {
		for (var i = 0; i < this.blockParts.length; i++) {
			var blockPart = this.refs['block-part-wrapper-'+i]
			if(blockPart === undefined) break
			blockPart.disactivate()
		}	
	}
	wrapperAnimationFinished() {
		this.isAnimate = false
	}
	increaseIndex() {
		this.setBlockIndex(this.blockIndex+1)
	}
	decreaseIndex() {
		this.setBlockIndex(this.blockIndex-1)
	}
	setBlockIndex(index) {
		this.oldBlockIndex = this.blockIndex
		this.blockIndex = index
		if(this.blockIndex > this.blockParts.length-1) this.blockIndex = 0
		if(this.blockIndex < 0) this.blockIndex = this.blockParts.length-1
	}
	resize() {
		for (var i = 0; i < this.blockParts.length; i++) {
			var blockPart = this.refs['block-part-wrapper-'+i]
			if(blockPart === undefined) break
			blockPart.resize()
		}
	}
	componentWillUnmount() {
		dom(document.body).off('keydown', this.onKeyPressed)
	}
}
