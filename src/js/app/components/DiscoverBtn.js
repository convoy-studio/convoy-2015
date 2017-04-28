import React from 'react'
import dom from 'domquery'

export default class DiscoverBtn extends React.Component {
	render() {
		return (
			<div id='discover-btn' ref='discover-btn' className='paragraph'>
				<div className="relative">
					<a target='_blank' href={this.props.vars.url}>
						<div className="btn-wrapper">
							{this.props.vars.title}
							<div className="bottom-line"></div>
						</div>
					</a>
				</div>
			</div>
		)
	}
}
