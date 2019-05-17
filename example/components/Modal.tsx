import * as React from 'react'
import Frame from './Frame'

interface Props {
	id: string
	onDismiss: () => void
}

export default class extends React.Component<Props> {
	private shim: any
	private photoWrap: any

	public render() {
		return (
			<div
				ref={el => (this.shim = el)}
				className="shim"
				onClick={(e: React.MouseEvent<HTMLDivElement>) => this.dismiss(e)}
			>
				<div ref={el => (this.photoWrap = el)} className="photo">
					<Frame id={this.props.id} />
				</div>
				<style jsx>{`
					.shim {
						position: fixed;
						background: rgba(0, 0, 0, 0.65);
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						margin: auto;
					}
					.photo {
						position: absolute;
						top: 50%;
						width: 100%;
						margin-top: -250px;
					}
				`}</style>
			</div>
		)
	}

	private dismiss = (e: React.MouseEvent) => {
		if (this.shim === e.target || this.photoWrap === e.target) {
			if (this.props.onDismiss) {
				this.props.onDismiss()
			}
		}
	}
}
