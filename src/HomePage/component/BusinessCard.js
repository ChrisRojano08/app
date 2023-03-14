import React from 'react';

import bootsCss from "./../../resources/css/bootstrap5_3_0.css";
import generalCss from "./../../resources/css/General.css";

class BusinessCard extends React.Component {
	go2business = (e) => {
		this.props.history.push({
			pathname: '/business',
			data: e
		});

		const aux = {
			id: e.id,
			name: e.name,
			slogan: e.slogan,
			description: e.description,
			phone: e.phone,
			contacEmail: e.contacEmail,
			googlemaps: e.googlemaps,
			instagramLink: e.instagramLink,
			facebookLink: e.facebookLink,
			twitterLink: e.twitterLink,
			mainSociamedia: e.mainSociamedia,
			catalogImgVO: e.catalogImgVO
		};
		sessionStorage.setItem('info', JSON.stringify(aux));
	};

	render() {
		return (
			<>
				<div 
					className='business-card shadow hover-div' 
					key={this.props.c.id} 
					onClick={() => this.go2business(this.props.c)} 
				>
					<img
						className='business-img'
						src={this.props.c.catalogImgVO.description !== '' ? this.props.c.catalogImgVO.description : 'https://static.thenounproject.com/png/4381137-200.png' }
						alt={this.props.c.name}
					/>
					<div className='h6 text-dark pl-2 mt-2'>
						{this.props.c.name}
						{this.props.c.totalCupones > 0 ? (
							' (' + this.props.c.totalCupones + ')'
						) : (
							<span></span>
						)}
					</div>
				</div>
			</>
		);
	}
}
export default (BusinessCard);
