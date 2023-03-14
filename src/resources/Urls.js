const baseURl = 'https://cuponealo.com.mx:8080/';
const baseQrUrl = 'https://cuponealo.com.mx:8089/';
const baseBugs = 'https://softitlan.com/rutback/';


// this is a explame data for base url api
const baseApi = {
	coupons: baseURl + 'coupons/',
	clients: baseURl + 'clients/',
	session: baseURl + 'session/',
	business: baseURl + 'business/',
	filesMng: 'https://softitlan-storage.s3.us-east-2.amazonaws.com/',
	personalQr: baseURl + 'qrPersonalizado/',
	coords: baseURl + 'coords/',
	categories: baseURl + 'categories/',
	files: baseBugs + 'file/',
	users: baseURl + 'employees/'
};
const baseQr = {
	qr: baseQrUrl + 'qr'
};

// this is a exmple data for enpoint api
export const Urls = {
	filesApi: {
		imgs: baseApi.filesMng + 'images/',
		upload: baseApi.files + 'upload',
		edit: baseApi.files + 'edit'
	},
	clientsApi: {
		findAllActive: baseApi.clients + 'findAllActive',
		findBirthdayDudes: baseApi.clients + 'findBirthdayDudes',
		delete: baseApi.clients + 'delete',
		edit: baseApi.clients + 'update',
		findAllClients: baseApi.clients + 'findAllClientes',
		findAll: baseApi.clients + 'findAll',
		insert: baseApi.clients + 'insert',
		verifyPhone: baseApi.clients + 'verifyPhone',
		verifyEmail: baseApi.clients + 'verifyEmail',
		verifyData: baseApi.clients + 'verifyData',
		findFilter: baseApi.clients + 'findFilter',
		findAllFilter: baseApi.clients + 'findAllFilter'
	},
	cuponsApi: {
		createCoupon: baseApi.coupons + 'createCoupon',
		scanCoupon: baseApi.coupons + 'scanCoupon',
		getQR: baseApi.coupons + 'GetQr',
		autorizar: baseApi.coupons + 'autorizar',
		download: baseApi.coupons + 'download',
		auth: baseApi.coupons + 'authCoupon',
		findAll: baseApi.coupons + 'findAll',
		update: baseApi.coupons + 'update',
		createSon: baseApi.coupons + 'createSon',
		getTypes: baseApi.coupons + 'findAllTypes',
		getNumberCupons: baseApi.coupons + 'findAllActive',
		generateQRToBusiness: baseQrUrl + 'generate',
		findAllAvailable: baseApi.coupons + 'findAllAvailable'
	},
	sessionApi: {
		login: baseApi.session + 'login',
		recoverPassword: baseApi.session + 'recoverPassword'
	},
	navApi: {
		login: baseApi.front + 'login',
		cuponData: baseApi.front + 'cuponData',
		clientGrid: baseApi.front + 'clientGrid',
		forgotten: baseApi.front + 'forgotten',
		mainMenu: baseApi.front + 'mainMenu',
		secondaryMenu: baseApi.front + 'secondaryMenu',
		cuponCreation: baseApi.front + 'cuponCreation',
		scanner: baseApi.front + 'scanner',
		birthdayDudes: baseApi.front + 'birthdayDudes'
	},
	businessApi: {
		findCarrusel: baseApi.business + 'findCarrusel',
		insert: baseApi.business + 'insert',
		findCatalog: baseApi.business + 'findCatalog',
		saveImage: baseApi.business + 'saveImage',
		update: baseApi.business + 'update',
		findPicture: baseApi.business + 'findPicture',
		findBussinesById: baseApi.business + 'findBussinesById',
		delete: baseApi.business + 'delete',
		getBusinessPaged: baseApi.business + 'getBusinessPaged',
		findAll: baseApi.business + 'findAll',
		findFilter: baseApi.business + 'findFilter'
	},
	socialApi: {
		facebook: 'https://www.facebook.com/plugins/page.php?href='
	},
	qr: {
		getImage: baseQr.qr + '/generate',
		findBussinesById: baseApi.personalQr + 'findById',
		saveQr: baseApi.personalQr + 'insert',
		updateQr: baseApi.personalQr + 'update'
	},
	coordsApi: {
		findAll: baseApi.coords + 'findAll',
		findByBussinesId: baseApi.coords + 'findByBusinessId'
	},
	categoriesApi: {
		insert: baseApi.categories + 'insert'
	},
	
	usersApi: {
		findUsers: baseApi.users + 'findEmployees',
		insert: baseApi.users + 'insert',
		update: baseApi.users + 'update'
	}
};
