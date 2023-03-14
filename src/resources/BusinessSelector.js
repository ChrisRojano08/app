import React from 'react';
import { HomePageController } from '../Index/controller/HomePageController';
import {Preload} from "../utils/Preload";

class BusinessSelector extends React.Component {
	constructor(props) {
		super(props);
		this.homePageController = new HomePageController();
		this.state = {
			option: sessionStorage.getItem('idBusiness') || '',
			cat: []
		};
		this.handleBusiness = this.handleBusiness.bind(this);
	}

	loaderFn = async () => this.init().then((values)=>this.setState({ cat: values.data }));

	init = async () => {
		if (sessionStorage.getItem("idBusiness")===undefined || sessionStorage.getItem("idBusiness")==="")
			sessionStorage.removeItem("idBusiness");

		const res = await this.homePageController.findBusiness();

		if (this.props.selectedB) {
			this.setState({ option: this.props.selectedB });
		}
		return res;
	};

	handleBusiness = (event) => {
		this.setState({ option: event.target.value });
		sessionStorage.setItem('idBusiness', event.target.value);

		if (this.props.handler) {
			this.props.handler(event.target.value);
		}
	};

	render() {
		return (
			<>
				<Preload type="load" callToService={this.loaderFn}  >
					<div className='row m-0'>
						<div className='col-12 col-xl-3 col-lg-3 col-md-3'>
							<label>Seleccione el negocio:</label>
						</div>
						<div className='col-12 col-xl-9 col-lg-9 col-md-9'>
							<select
								className='form-control col-12'
								aria-label='.form-select-lg example'
								name='catId'
								value={this.state.option}
								required
								onChange={this.handleBusiness}
							>
								<option selected="false" hidden className='col-12'>Seleccione...</option>
								{this.state.cat.map((c) =>
									c.id === sessionStorage.getItem('idBusiness') ? (
										<option key={c.id} value={c.id} selected>
											{c.name}
										</option>
									) : (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									)
								)}
							</select>
						</div>
					</div>
				</Preload>
			</>
		);
	}
}

export default BusinessSelector;
