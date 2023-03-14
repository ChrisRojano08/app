import { ChromePicker } from 'react-color';
import React from 'react';
import reactCSS from 'reactcss';

class ColorSelect extends React.Component {
	constructor() {
		super();
		this.state = {
			color: {
				r: '0',
				g: '0',
				b: '0',
				a: '1'
			}
		};
	}

	componentDidMount() {
		if (this.props.colorIn) {
			this.setState({
				color: {
					...this.state.color,
					r: '' + this.props.colorIn[0],
					g: '' + this.props.colorIn[1],
					b: '' + this.props.colorIn[2]
				}
			});
		}
	}

	handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false });
	};

	handleChange = (color) => {
		this.setState({ color: color.rgb }, () => {
			this.props.onColorChange(color.rgb)
		})
	};

	render() {
		const styles = reactCSS({
			default: {
				color: {
					width: '100%',
					height: '20px',
					borderRadius: '4px',
					background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`
				},
				swatch: {
					width: '100%',
					height: '30px',
					padding: '5px',
					background: '#fff',
					borderRadius: '10px',
					boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
					display: 'inline-block',
					cursor: 'pointer'
				},
				popover: {
					position: 'absolute',
					zIndex: '2'
				},
				cover: {
					position: 'fixed',
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px'
				}
			}
		});

		return (
			<div>
				<div
					className='container-fluid'
					style={styles.swatch}
					onClick={this.handleClick}
				>
					<div className='container-fluid' style={styles.color} />
				</div>
				{this.state.displayColorPicker ? (
					<div style={styles.popover}>
						<div
							className='container-fluid'
							style={styles.cover}
							onClick={this.handleClose}
						/>
						<ChromePicker
							disableAlpha = {true}
							color={this.state.color}
							onChange={this.handleChange}
						/>
					</div>
				) : null}
			</div>
		);
	}
}
export default ColorSelect;
