import Swal from 'sweetalert2';
import { Urls } from './Urls';

export class Utils {
	static successToast(props) {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
			}
		});
		Toast.fire(props);
	}

	static buttonSwal(props) {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
			buttonsStyling: false
		});

		swalWithBootstrapButtons
			.fire({
				title: props.title,
				text: props.text,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: props.confirmButtonText,
				cancelButtonText: props.cancelButtonText,
				reverseButtons: true
			})
			.then((result) => {
				if (result.isConfirmed) {
					props.handlerAcce(props.data);
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					props.handlerCanc(props.data);
				}
			});
	}

	static swl(props) {
		return Swal.fire(props);
	}

	static swlToast(config) {
		this.swl(
			Object.assign(config, {
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3000
			})
		);
	}

	static swalError(params, title) {
		let tileTx = 'Oops...'
		if(title){
			tileTx = title;
		}

		Swal.fire({
			icon: 'error',
			title: tileTx,
			text: params
		});
	}

	static swalNeddLogin(params) {
		Swal.fire({
			icon: 'error',
			title: params,
			text: 'Se requiere haber iniciado sesión para entrar a esta sección.'
		}).then(function () {
			window.location = Urls.navApi.login;
		});
	}

	static swalSuccess(msg) {
		Swal.fire({
			icon: 'success',
			toast: true,
			title: msg,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3500
		});
	}

	static swalQrAlert(params) {
		Swal.fire({
			title: '!Choque de colores!',
			text:
				params + 'Puede ocasionar dificultades al momento de escanear el qr.',
			icon: 'warning'
		});
	}

	static raise(e, msg) {
		if (typeof e === 'string') {
			throw new Error(e);
		} else if (Object.keys(msg) === 0) {
			console.error('Error de sistema:', e);
			throw new Error('Error de sistema');
		} else {
			console.error('Error en proceso: ' + msg.toLowerCase(), e);
			throw new Error('Error en proceso: ' + msg.toLowerCase());
		}
	}

	static handle(e, msg) {
		if (typeof e === 'string') {
			console.error(e);
		} else {
			try {
				Utils.raise(e, msg);
			} catch (e2) {
				Utils.handle(e2);
			}
		}
	}

	static parseDate(date) {
		const fecha = new Date(date);
		fecha.setHours(0, 0, 0, 0);
		return fecha;
	}

	formatDate = (date) => {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		if (month < 10) {
			if (day < 10) return `0${day}-0${month}-${year}`;
			else return `${day}-0${month}-${year}`;
		} else {
			if (day < 10) return `0${day}-${month}-${year}`;
			else return `${day}-${month}-${year}`;
		}
	};

	maxDate() {
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1;
		const yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}

	formatDate(date) {
		return (
			date.substring(6, 10) +
			'-' +
			date.substring(3, 5) +
			'-' +
			date.substring(0, 2)
		);
	}

	static maxFech() {
		let fecha = new Date; 
		const dd = (fecha.getDate() < 10) ?  `0${fecha.getDate()}`: fecha.getDate();
		const mm = ((fecha.getMonth()+1) < 10) ?  `0${fecha.getMonth()+1}`: fecha.getMonth()+1;
		const yyyy = fecha.getFullYear()-18;
		fecha = `${yyyy}-${mm}-${dd}`;
		return fecha;
	}

	static minFech() {
		let fecha = new Date; 
		const dd = (fecha.getDate() < 10) ?  `0${fecha.getDate()}`: fecha.getDate();
		const mm = ((fecha.getMonth()+1) < 10) ?  `0${fecha.getMonth()+1}`: fecha.getMonth()+1;
		const yyyy = fecha.getFullYear()-100;
		fecha = `${yyyy}-${mm}-${dd}`;
		return fecha;
	}
}

export const deleteLastOneObject = (obj = {})=>{
	return { ...obj};
};
export const isInvalidBtnExpress = (currentDate, cuponDate) => {
	const fechaActual = new Date();
	fechaActual.setHours(0, 0, 0, 0);
	cuponDate = (cuponDate.substring(6, 10) + '-' + cuponDate.substring(3, 5) +	'-' + cuponDate.substring(0, 2))
	const fechaBD = new Date(cuponDate);
	fechaBD.setHours(0, 0, 0, 0);
	fechaBD.setDate(fechaBD.getDate()+1);
	if (fechaBD < fechaActual) {
		return (
			false
		);
	} else {
		return (
			true
		);
	}
}
