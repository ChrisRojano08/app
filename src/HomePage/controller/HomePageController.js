import { Urls } from '../../resources/Urls';
import { Client } from '../../resources/Client';
export class HomePageController {
	async findCarrusel() {
		const res = await Client.GET({
			url: Urls.businessApi.findCarrusel
		});

		res.data.forEach((x) => {
			this.findCoupons(x.id).then((value) => {
				x.totalCupones = value;
			});
		});

		return res;
	}

	async findBusiness() {
		const res = await Client.GET({
			url: Urls.businessApi.findCarrusel
		});

		return res;
	}

	async findCoupons(idB) {
		const resp = await Client.GET({
			url: Urls.cuponsApi.findAllAvailable,
			params: {
				page: 1,
				limit: 20,
				id: idB
			}
		});

		return resp.total;
	}

	async findCatalog(state) {
		const res = await Client.GET({
			url: Urls.businessApi.findCatalog,
			params: {
				page: state,
				limit: 8
			}
		});
		return res;
	}

	async findAllActive() {
		const res = await Client.GET({
			url: Urls.cuponsApi.getNumberCupons
		});
		return res;
	}

	async findCoords(business) {
		const res = await Client.GET({
			url: Urls.coordsApi.findAll
		});

		let auxC = [];
		const coords = [];
		res.data.forEach((c) => {
			if (
				business.data.find((element) => {
					return element.id === c.idBusiness;
				})
			) {
				auxC = [
					{
						id: c.id,
						idBusiness: c.idBusiness,
						position: {
							lat: c.latitude,
							lng: c.longitude
						},
						key: c.id,
						name: business.data.find((element) => {
							return element.id === c.idBusiness;
						}).name,
						animation: 2
					}
				];

				coords.push.apply(coords, auxC);
				auxC = [];
			}
		});

		return coords;
	}
}
