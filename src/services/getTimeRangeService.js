// services/dateService.js
import moment from 'moment';
moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sept_Oct_Nov_Dec'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mier_Jue_Vier_Sab'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
});

export function getTimeRange(newDate, type, firstDayOfWeek) {
	const initialDate = {};
	const endDate = {};

	switch (type) {
		case 'day':
			initialDate.value = moment(newDate)
				.startOf('day')
				.format('YYYY-MM-DD HH:mm');
			endDate.value = moment(newDate).endOf('day').format('YYYY-MM-DD HH:mm');
			break;
		case 'week':
			initialDate.value = moment(newDate)
				.isoWeekday(firstDayOfWeek)
				.startOf('day')
				.format('YYYY-MM-DD HH:mm');
			endDate.value = moment(newDate)
				.isoWeekday(firstDayOfWeek + 6)
				.endOf('day')
				.format('YYYY-MM-DD HH:mm');
			break;
		case 'month':
			initialDate.value = moment(newDate)
				.startOf('month')
				.format('YYYY-MM-DD HH:mm');
			endDate.value = moment(newDate)
				.endOf('month')
				.format('YYYY-MM-DD HH:mm');
			break;
		case 'year':
			initialDate.value = moment(newDate)
				.startOf('year')
				.format('YYYY-MM-DD HH:mm');
			endDate.value = moment(newDate)
				.endOf('year')
				.format('YYYY-MM-DD HH:mm');
			break;
	}

	return { initialDate: initialDate.value, endDate: endDate.value };
}
