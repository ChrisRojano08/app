import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Box, Modal, Center, FormControl, Input, HStack, Stack } from "native-base";

import { HomePageController } from '../controller/HomePageController';
import BusinessCard from './BusinessCard';

import logoCup from '../../resources/images/Logo-cupon.png';
import bootsCss from "./../../resources/css/bootstrap5_3_0.css";
import generalCss from "./../../resources/css/General.css";

const _ = require('lodash');

class HomeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.homePageController = new HomePageController();
		this.state = {
			showModal: false,
			setShowModal: false,
			index: 0,
			setIndex: 0,
			reload: false,
			categories: [
				{
					id: 0,
					description: ''
				}
			],
			categoriesPaged: {
				page: 0,
				total: 0
			},
			count: [0, 0, 0, 0, 0, 0, 0, 0],
			view: 0,
			filterCategorie: [
				{
					id: 0,
					name: '',
					description: '',
					slogan: '',
					phone: 0,
					catalogImgVO: { description: '' },
					totalCupones: 0
				}
			],
			business: [],
			businessFilt: [],
			businessCard: [],
			images: [],
			galleryArray: [],
			dataCupons: [],
			page: 1,
			coordsMap: [],
			flag: false
		};
	}

	componentDidMount() {
		this.loadCategoriesCatalog();
		this.init();
	}

	componentDidUpdate() {
		document.getElementById('cuponealoLogo').src = logoCup;
	}

	async init() {
		const res = await this.findCarrusel();

		if (res.data) {
			this.setState({ business: res.data });
			this.setState({ businessCard: res.data });
			this.setState({ filterCategorie: res.data });

			const resp = await this.homePageController.findCoords(res);
			this.setState({ coordsMap: resp }, () => {
				this.filtrar('');

			});
		} else {
			Utils.swalError('No se pudo recuperar la información de negocios.');
		}
		this.countBusinessPerCategory();
		this.pageBusiness(1);

		document.getElementById('cuponealoLogo').src = logoCup;
		this.setState({ flag: true });
	}

	async findCarrusel() {
		return await this.homePageController.findCarrusel();
	}

	async loadCategoriesCatalog() {
		const cat = await this.homePageController.findCatalog(
			this.state.categoriesPaged.page
		);
		if (cat.data) {
			this.setState({ categories: cat.data });
			this.setState({
				categoriesPaged: {
					page: 0,
					total: cat.total
				}
			});
		} else {
			Utils.swalError('No se pudo recuperar la información de negocios.');
		}
	}

	countBusinessPerCategory() {
		const aux = [];
		let aux2 = this.state.business;
		if (document.getElementById('busqueda').value !== '') {
			aux2 = this.state.businessFilt;
		}

		this.state.categories.map((c) => {
			let count = 0;
			for (let i = 0; i < aux2.length; i++) {
				if (c.description === aux2[i].catalogCatVO.description) {
					count++;
				}
			}
			aux.push(count);

			return null;
		});
		this.setState({
			count: aux
		});
	}

	renderCategories() {
		return this.state.categories.map((c, i) => (
			<li
				className='d-flex clickable'
				key={c.id}
				onClick={() => this.openCategorie(c)}
			>
				<div key={c.id} className='button p-2 text-dark'>
					{c.description + ' (' + this.state.count[i] + ') '}
				</div>
			</li>
		));
	}

	openCategorie = (c) => {
		const aux = [];

		if (c === 'todas') {
			if (document.getElementById('busqueda').value !== '') {
				this.setState({ filterCategorie: this.state.businessFilt }, () => {
					this.pageBusiness(1);
				});
			} else {
				this.setState({ filterCategorie: this.state.business }, () => {
					this.pageBusiness(1);
				});
			}

		} else {
			let bussToGet = this.state.business;
			if (document.getElementById('busqueda').value !== '') {
				bussToGet = this.state.businessFilt;
			}

			for (let i = 0; i < bussToGet.length; i++) {
				if (c.id === bussToGet[i].catalogCatVO.id) {
					aux.push(bussToGet[i]);
				}
			}

			this.setState({ filterCategorie: aux }, () => {
				this.pageBusiness(1);
			});
		}
	};

	filtrar = (e) => {
		const aux = [];
		const c = e.toLowerCase();

		for (let i = 0; i < this.state.business.length - 1; i++) {
			if (
				this.state.business[i].name.toLowerCase().indexOf(c) !== -1
			) {
				aux.push(this.state.business[i]);
			}
		}

		if (aux.length < 1) {
			Utils.swalError('Ingrese un criterio distinto...', 'No se encontraron negocios que coincidad!')
		} else {
			this.setState({ filterCategorie: aux }, () => {
				this.setState({ businessFilt: aux }, () => {
					this.pageBusiness(1);
					this.countBusinessPerCategory();
				});

			});
		}

	};

	funcModal = (m, opc, typeModal) => {
		let mP = '';
		let mCA = '';

		if (typeModal === 'aviso') {
			mP = document.getElementById('modalPanel');
			mCA = document.getElementById('modalContent');
		} else {
			mP = document.getElementById('modalForm');
			mCA = document.getElementById('modalFormContent');
		}

		if (opc === 'cerrar') {
			mP.setAttribute('style', 'display:none;');
			mCA.setAttribute('style', 'display:none;');
		} else {
			if (m === 'aviso') {
				mP.setAttribute('style', 'display:block;');
				mCA.setAttribute('style', 'display:block;');
			}
		}

		window.scroll({
			top: 0,
			behavior: 'smooth'
		});
	};

	enviarEmail = e => {
		e.preventDefault();
		const messa = '' + document.getElementById('mensaje floatingTextarea').value;

		if (this.validar('nombre floatingInputGrid', 'El nombre solo debe')) {
			if (messa.length < 20) {
				Utils.swl('Tus comentarios nos interesan. Envía un mensaje más largo.');
			} else {
				emailjs.sendForm('service_ibv9k43', 'template_txnd2js', e.target, 'wsrbfhtLY0t0T8s9z').then(res => {
					if (res.text === 'OK') {
						Utils.swalSuccess("Sus comentarios fueron enviados con éxito!!");
						setTimeout(() => {
							window.location.reload(true);
						}, 2500);
					} else {
						Utils.swalError("No se pudieron enviar sus comentarios, intentelo más tarde.");
					}
				});
			}
		}
	}

	validar(idInput, msg) {
		const input = document.getElementById(idInput);
		const patte = '^[A-Z ]+$';
		const pattern = new RegExp(patte, 'i');

		if (!input.value) {
			Utils.swalError(msg + ' estar vacio!');
			return false;
		} else {
			if (!pattern.test(input.value)) {
				Utils.swalError(msg + ' contener letras o números!');
				return false;
			} else {
				return true;
			}
		}
	}

	orderCoupons = (e) => {
		const list = this.state.filterCategorie;

		if (e === 'ascendente') {
			list.sort(function (a, b) { return b.totalCupones - a.totalCupones });
		} else {
			list.sort(function (a, b) { return a.totalCupones - b.totalCupones });
		}

		this.setState({ filterCategorie: list }, () => {
			this.pageBusiness(1);
		});
	};

	orderName = (e) => {
		const list = this.state.filterCategorie;

		if (e === 'ascendente') {
			list.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			list.sort((a, b) => b.name.localeCompare(a.name));
		}

		this.setState({ filterCategorie: list }, () => {
			this.pageBusiness(1);
		});
	};

	async getCategories(option) {
		let page;
		page = this.state.categoriesPaged.page;
		page = option === 1 ? page + 1 : page - 1;
		const cat = await this.homePageController.findCatalog(page);
		if (cat.data) {
			this.setState({
				categories: cat.data,
				categoriesPaged: {
					page: page,
					total: cat.total
				}
			});
		} else {
			Utils.swalError('No se pudo recuperar la información de negocios.');
		}
		this.countBusinessPerCategory();
	}

	renderMainContent() {
		/* return (
			<div className='row'>
				{this.state.filterCategorie.map((section, i) => {
					return (
						<BusinessCard c={section} />
					)
				})}
			</div>

		) */

		const parents = _.chunk(this.state.pagedBusiness, 4);
		return parents.map((parent, i) => (
			<div key={i} className='row'>
				{parent.map((section, j) => (
					<div key={j} className='col-sm-6 col-md-6 col-lg-6 col-xl-3 col-6'>
						<BusinessCard c={section} />
					</div>
				))}
			</div>
		));
	}

	pageBusiness(page) {
		const aux = [];
		const aux2 = this.state.filterCategorie;

		for (let i = page * 12 - 12; i < page * 12; i++) {
			if (aux2[i] !== undefined) {
				aux.push(aux2[i]);
			}
		}
		this.setState({
			pagedBusiness: aux,
			page: page
		});
	}

	logo() {
		return (
			<div className='navbarS' >
				<div className='row logo align-items-center justify-content-center'>
					<div className='p-2 ml-4 mt-4 col-5 col-sm-5 col-md-2 col-lg-2 col-xl-2' style={bootsCss["bg-danger"]}>
						<img
							src={logoCup}
							className='ml-4'
							id='cuponealoLogo'
							width='120px'
							alt=''
						/>
					</div>

					<div className='p-4 mt-4 col-9 col-sm-9 col-md-7 col-lg-8 col-xl-8'>
						<input
							type='text'
							className='form-control ml-4 col-10'
							id='busqueda'
							placeholder='Ingrese su criterio a buscar'
							aria-describedby='busqueda'
							required
						/>
					</div>

					<div className='p-2 mt-4 col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2'>
						<a href="/login" className='btn btn-outline-danger ml-2'>
							Iniciar sesión
						</a>
					</div>

				</div>
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.logo()}

				<div className='sep-home'>
				</div>

				<Center>

					<Modal isOpen={this.state.showModal} onClose={() => this.setState({ showModal: false })}>
						<Modal.Content>
							<Modal.CloseButton />
							<Modal.Header>Política de privacidad</Modal.Header>
							<Modal.Body>
								<h6>
									La presente Política de Privacidad establece los términos en que
									Softitlan usa y protege la información que es proporcionada por
									sus usuarios al momento de utilizar su sitio web. Esta compañía
									está comprometida con la seguridad de los datos de sus usuarios.
									Cuando le pedimos llenar los campos de información personal con
									la cual usted pueda ser identificado, lo hacemos asegurando que
									solo se empleará de acuerdo con los términos de este documento.
									Sin embargo esta Política de Privacidad puede cambiar con el
									tiempo o ser actualizada por lo que le recomendamos y
									enfatizamos revisar continuamente esta página para asegurarse
									que está de acuerdo con dichos cambios.
								</h6>
								<br />
								<h5>Información que es recogida.</h5>
								<h6>
									Nuestro sitio web podrá recoger información personal por
									ejemplo: Nombre, información de contacto como su dirección de
									correo electrónico e información demográfica. Así mismo cuando
									sea necesario podrá ser requerida información específica para
									procesar algún pedido o realizar una entrega o facturación.
								</h6>
								<br />
								<h5>Uso de la información recogida.</h5>
								<h6>
									Nuestro sitio web emplea la información con el fin de
									proporcionar el mejor servicio posible, particularmente para
									mantener un registro de usuarios, de pedidos en caso de que
									aplique, y mejorar nuestros productos y servicios. Es posible
									que sean enviados correos electrónicos periódicamente a través
									de nuestro sitio con ofertas especiales, nuevos productos y otra
									información publicitaria que consideremos relevante para usted o
									que pueda brindarle algún beneficio, estos correos electrónicos
									serán enviados a la dirección que usted proporcione y podrán ser
									cancelados en cualquier momento. <br />
									Softitlan está altamente comprometido para cumplir con el
									compromiso de mantener su información segura. Usamos los
									sistemas más avanzados y los actualizamos constantemente para
									asegurarnos que no exista ningún acceso no autorizado.
								</h6>
								<br />
								<h5>Cookies</h5>
								<h6>
									Una cookie se refiere a un fichero que es enviado con la
									finalidad de solicitar permiso para almacenarse en su ordenador,
									al aceptar dicho fichero se crea y la cookie sirve entonces para
									tener información respecto al tráfico web, y también facilita
									las futuras visitas a una web recurrente. Otra función que
									tienen las cookies es que con ellas las web pueden reconocerte
									individualmente y por tanto brindarte el mejor servicio
									personalizado de su web. <br />
									Nuestro sitio web emplea las cookies para poder identificar las
									páginas que son visitadas y su frecuencia. Esta información es
									empleada únicamente para análisis estadístico y después la
									información se elimina de forma permanente. Usted puede eliminar
									las cookies en cualquier momento desde su ordenador. Sin embargo
									las cookies ayudan a proporcionar un mejor servicio de los
									sitios web, estás no dan acceso a información de su ordenador ni
									de usted, a menos de que usted así lo quiera y la proporcione
									directamente, visitas a una web. Usted puede aceptar o negar el
									uso de cookies, sin embargo la mayoría de navegadores aceptan
									cookies automáticamente pues sirve para tener un mejor servicio
									web. También usted puede cambiar la configuración de su
									ordenador para declinar las cookies. Si se declinan es posible
									que no pueda utilizar algunos de nuestros servicios.
								</h6>
								<br />
								<h5>Enlaces a Terceros.</h5>
								<h6>
									Este sitio web pudiera contener enlaces a otros sitios que
									pudieran ser de su interés. Una vez que usted de clic en estos
									enlaces y abandone nuestra página, ya no tenemos control sobre
									al sitio al que es redirigido y por lo tanto no somos
									responsables de los términos o privacidad ni de la protección de
									sus datos en esos otros sitios terceros. Dichos sitios están
									sujetos a sus propias políticas de privacidad por lo cual es
									recomendable que los consulte para confirmar que usted está de
									acuerdo con estas.
								</h6>
								<br />
								<h5>Control de su información personal.</h5>
								<h6>
									En cualquier momento usted puede restringir la recopilación o el
									uso de la información personal que es proporcionada a nuestro
									sitio web. Esta compañía no venderá, cederá ni distribuirá la
									información personal que es recopilada sin su consentimiento,
									salvo que sea requerido por un juez con un orden judicial.
								</h6>
								<br />
								<br />
								<h6>
									Softitlan se reserva el derecho de cambiar los términos de la
									presente Política de Privacidad en cualquier momento.
								</h6>
								<br />
							</Modal.Body>
							<Modal.Footer>
								<Button variant="ghost" colorScheme="blueGray" onPress={() => {
									this.setState({ showModal: false })
								}}>
									Cancel
								</Button>
								<Button onPress={() => {
									this.setState({ showModal: false })
								}}>
									Save
								</Button>
							</Modal.Footer>
						</Modal.Content>
					</Modal>
				</Center>
				
				<div className='body-home'>
					<a className='btn btn-danger' onClick={() => this.setState({ showModal: true })}>Button</a>

					<div className='container-fluid'>
					<div className='row'>
						<div className='col-lg-7 col-md-6 col-sm-6 text-dark align-self-center mt-4'>
							<div className='subtitleText'>
								Para que pagar el precio completo si puedes...
							</div>
						</div>

						<div className='col-lg-5 col-md-6 col-sm-6 mt-4'>
							<div className='titleText'>¡CUPONEARLO!</div>
						</div>
					</div>
				</div>

				<div className='container-fluid'>
					<div className='row'>
						<div className='my-3 col-sm-0 col-md-0 col-lg-0 col-xl-1 col-0'></div>
						<div className='my-3 col-sm-12 col-md-3 col-lg-3 col-xl-2 menu-container'>
							<input type="checkbox" />
							<button className='ml-3'></button>
							<button className='ml-3'></button>
							<button className='ml-3'></button>
							<div className='menu'>
								<div className='row'>
									<ul className='d-flex mx-3 flex-column'>
										<div className='p-2 text-danger mt-3'>Filtrar por categoría</div>
										<li
											className='d-flex clickable'
											onClick={() => this.openCategorie('todas')}
										>
											{this.state.business.length !== 0 ?
												<div className='button p-2 text-dark'>
													Todas ({document.getElementById('busqueda').value !== '' ?
														this.state.businessFilt.length
														:
														this.state.business.length
													}){' '}
												</div>
												:
												<></>
											}
										</li>
										{this.renderCategories()}
										<li className='my-3 d-flex justify-content-left align-items-center'>
											<div className='d-flex flex-row'>
												<div className='d-flex flex-column'>
													<div
														className={
															this.state.categoriesPaged.page > 0
																? 'button btn btn-outline-danger'
																: 'button btn btn-outline-danger disabled'
														}
														onClick={
															this.state.categoriesPaged.page > 0
																? () => this.getCategories(0)
																: null
														}
													>
														{'<-'}
													</div>
												</div>
												<div
													className='d-flex flex-column'
													style={{ paddingLeft: '10px' }}
												>
													<div
														className={
															(this.state.categoriesPaged.page + 1) * 8 <
																this.state.categoriesPaged.total
																? 'button btn btn-outline-danger'
																: 'button btn btn-outline-danger disabled'
														}
														onClick={
															(this.state.categoriesPaged.page + 1) * 8 <
																this.state.categoriesPaged.total
																? () => this.getCategories(1)
																: null
														}
													>
														{'->'}
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>

								<div className='row'>
									<ul className='d-flex mx-3 flex-column'>
										<div className='p-2 text-danger mt-3'>Ordenar negocios</div>
										<li
											className='d-flex clickable'
											onClick={() => this.orderCoupons('ascendente')}
										>
											<div className='button p-2 text-dark'>
												Cupones (^)
											</div>
										</li>
										<li
											className='d-flex clickable'
											onClick={() => this.orderCoupons('descendente')}
										>
											<div className='button p-2 text-dark'>
												Cupones (v)
											</div>
										</li>

										<li
											className='d-flex clickable'
											onClick={() => this.orderName('ascendente')}
										>
											<div className='button p-2 text-dark'>
												Nombre (^)
											</div>
										</li>
										<li
											className='d-flex clickable'
											onClick={() => this.orderName('descendente')}
										>
											<div className='button p-2 text-dark'>
												Nombre (v)
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='my-3 col-sm-12 col-md-9 col-lg-8 col-xl-8 col-12'>

							<div className='p-4 my-4'>
								{this.renderMainContent()}
							</div>


							<div className='my-3 d-flex justify-content-left align-items-center'>
								<div className='d-flex flex-row'>
									<div className='d-flex flex-column'>
										<div
											className={
												this.state.page > 1
													? 'button btn btn-outline-danger'
													: 'button btn btn-outline-danger disabled'
											}
											onClick={
												this.state.page > 1
													? () => this.pageBusiness(this.state.page - 1)
													: null
											}
										>
											Anterior
										</div>
									</div>
									<div
										className='d-flex flex-column'
										style={{ paddingLeft: '10px' }}
									>
										<div
											className={
												this.state.page * 12 <
													this.state.filterCategorie.length
													? 'button btn btn-outline-danger'
													: 'button btn btn-outline-danger disabled'
											}
											onClick={
												this.state.page * 12 <
													this.state.filterCategorie.length
													? () => this.pageBusiness(this.state.page + 1)
													: null
											}
										>
											Siguiente
										</div>
									</div>
									<p className='ml-3 pt-2'>
										Página {this.state.page} de{' '}
										{Math.ceil(this.state.filterCategorie.length / 12)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>

				

			</div>
		)
	}

	toFooter() {
		return (
			<div className='d-flex flex-column h-100 footer'>
				<div className='container py-4'>
					<div className='row gy-4 gx-5'>
						<div className='col-lg-4 col-md-6'>
							<h2 className='mb-3 title-footerr'>Cuponealo</h2>
							<p className='small text-muted'>
								Para que pagar el precio completo si puedes...¡Cuponearlo!
							</p>
							<p className='small text-muted mb-0'>
								&copy; Copyrights. Todos los derechos reservados. Softitlan.com
							</p>
						</div>

						<div className='col-lg-2 col-md-6'>
							<h5 className='text-dark mb-3'>Enlaces rápidos</h5>
							<ul className='list-unstyled text-muted'>
								<li key='inicio'
									className='btnL clickable' onClick={() => { window.location.reload(true) }} >
									Inicio
								</li>
								<li
									key='texto'
									onClick={() => this.funcModal('aviso', 'abrir', 'aviso')}
									className='btnL clickable'
								>
									Aviso de privacidad
								</li>
								<li
									key='contacto'
									onClick={() => this.funcModal('aviso', 'abrir', 'form')}
									className='btnL clickable'
								>
									Contáctanos
								</li>
							</ul>
						</div>

						<div className='col-lg-2 col-md-6'>
							<h5 className='text-dark mb-3'>Síguenos</h5>
							<ul className='list-unstyled text-muted'>
								<li key='facebook'>
									<a href='https://www.facebook.com/profile.php?id=100075633856246'>
										Facebook
									</a>
								</li>
								<li key='instagram'>
									<a href='https://www.instagram.com/cuponealomx/'>Instagram</a>{' '}
								</li>
								<li key='twitter'>
									<a href='https://twitter.com/Cuponealomx?s=20&t=gxKzbNzAOeqZOrIudIE5yQ'>
										Twitter
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default HomeComponent;