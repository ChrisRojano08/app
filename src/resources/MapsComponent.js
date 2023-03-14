import { React, Component } from 'react';
import { Map, ZoomControl, Marker } from 'pigeon-maps';
import { Utils } from './Utils';
import { maptiler } from 'pigeon-maps/providers'

export class maps extends Component {
	constructor(props) {
		super(props);

		this.state = {
			markers: [],
			showingInfoWindow: false,
			zoomMap: 14,
			activeMarker: {},
			selectedPlace: {},
			center: [0, 0],
			maptilerProvider: maptiler('vAqfctD8My2HtDWuey1v', 'streets'),
			hover: '⁭⁭'
		};
	}

	componentDidMount() {
		setTimeout(() => {
			if (this.props.mode === 'Buss') {
				if (this.props.data.length > 0) {
					this.setState({
						markers: [
							[
								parseFloat(this.props.data[0].position.lat),
								parseFloat(this.props.data[0].position.lng),
								this.props.data[0].name
							]
						]
					});

					this.setState({
						center: [
							parseFloat(this.props.data[0].position.lat),
							parseFloat(this.props.data[0].position.lng)
						]
					});
				} else {
					this.setState({ markers: [] });
					this.setState({ center: [19.3187473, -98.233536] });
				}
			}else if(this.props.mode === 'Show') {
				const aux = [];
				this.props.data.forEach((c) => {
					aux.push([
						parseFloat(c.position.lat),
						parseFloat(c.position.lng),
						c.name
					]);
				});

				this.setState({ markers: aux });
			}else{
				if(this.props.data.length > 0){
					const mark = [[parseFloat(this.props.data[0].position.lat), parseFloat(this.props.data[0].position.lng), this.props.data[0].id]]
					this.setState({ markers: mark });
				}
			}

			this.setState({ zoomMap: 15 });
		}, 600);

		if (this.props.mode !== 'Buss') {
			this.getCurrentLoc();
		}
	}

	userAcepts = (posicion) => {
		const currentLoc = [posicion.coords.latitude, posicion.coords.longitude];
		this.setState({ center: currentLoc });
	};

	userDeny = (_error) => {
		const defaultLoc = [19.3187473, -98.233536];
		this.setState({ center: defaultLoc });
	};

	getCurrentLoc() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.userAcepts, this.userDeny, {
				enableHightAccuracy: true,
				timeout: Infinity,
				maximage: 0
			});
		} else {
			Utils.swalError('Los servicios de geolocalización no están disponibles.');
		}
	}

	render() {
		if (this.state.center[0] !== undefined || this.state.center[0] === 0) {
			return (
				<>
					
					<Map
						center={this.state.center}
						zoom={this.state.zoomMap}
						mouseEvents={true}
						provider={this.state.maptilerProvider}
						onClick={
							this.props.mode === 'Edit'
								? ({ event, latLng, pixel }) => this.addMarker(latLng)
								: this.onMapClicked
						}
					>
						{
							this.props.mode === 'Edit' ?
								<></>
							:
							<div className='row justify-content-end text-dark'>
								<div className='col-12 p-1' style={{'zIndex':'1000', 'background':'rgb(0, 228, 228)'}}>
									<h5 className='text-center'>{this.state.hover}</h5>
								</div>
							</div>
						}

						{this.state.markers.length > 0 ? (
							this.state.markers.map((marker, index) => {
								return (
									<Marker
										key={index}
										anchor={[marker[0], marker[1]]}
										width={40}
										color={`hsl(${(index * 15) % 360}deg 50% 70%)`}
										
										onClick={
											this.props.mode === 'Edit'
												? () => this.handleMarkerClick(marker, index)
												: this.onMarkerClick
										}
										onMouseOver={() => {this.setState({ hover: ''+marker[2]})}}
										onMouseOut={() => {this.setState({ hover: '⁭⁭'})}}
									/>
								);
							})
						) : (
							<></>
						)}

						<ZoomControl style={{ 'left': '90%', 'top': '80%'}} />
					</Map>
				</>
			);
		} else {
			return <></>;
		}
	}

	onMapClicked = (props) => {
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null
			});
		}
	};

	addMarker = (latLng) => {
		if (this.state.markers.length >= 1) {
			Utils.swalError(
				'Solo puede agregar un marcador! \n Si tiene otra sucursal, favor de ingresarla como un negocio diferente.'
			);
		} else {
			const marker = [[latLng[0], latLng[1], -1]];
			this.setState({ markers: marker });

			if (this.state.markers.length === 1) {
				Utils.successToast('Da click en el marcador si deseas quitarlo.');
			}

			this.props.handler(this.state.markers, false, {});
		}
	};

	handleMarkerClick = (marker, index) => {
		this.setState({ markers: [] });
		setTimeout(() => {
			this.props.handler(this.state.markers, true, marker[2]);
		}, 100);
	};
}

export default maps;
