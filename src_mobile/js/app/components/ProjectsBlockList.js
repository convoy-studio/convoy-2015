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
	blockSelected(id, e) {
		e.preventDefault()
		Router.setHash('works/' + id)
	}
	resize() {
		super.resize()
	}
}
