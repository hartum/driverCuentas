<template>
	<div class="time-navigator">
		<IonSegment v-model="timeNavigator" @ionChange="handleSegmentChange">
			<IonSegmentButton value="day">
				<IonLabel>Día</IonLabel>
			</IonSegmentButton>
			<IonSegmentButton value="week">
				<IonLabel>Semana</IonLabel>
			</IonSegmentButton>
			<IonSegmentButton value="month">
				<IonLabel>Mes</IonLabel>
			</IonSegmentButton>
			<IonSegmentButton value="year">
				<IonLabel>Año</IonLabel>
			</IonSegmentButton>
		</IonSegment>
		<IonIcon
			size="large"
			color="primary"
			:icon="arrowBackCircle"
			@click="navigateDate('prev')"
		></IonIcon>
		<span class="fechaVista"> {{ fechaVista }} </span>
		<IonIcon
			size="large"
			color="primary"
			:icon="arrowForwardCircle"
			@click="navigateDate('next')"
		></IonIcon>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/vue';
	import { arrowBackCircle, arrowForwardCircle } from 'ionicons/icons';
	import moment from 'moment';

	const props = defineProps({
		initialDate: {
			type: String,
			required: true,
		},
		initialNavigator: {
			type: String,
			default: 'month',
		},
	});

	const emit = defineEmits(['date-changed']);

	const timeNavigator = ref(props.initialNavigator);
	const fechaVista = ref('');
	const fechaUnica = ref(props.initialDate);

	const updateFechaVista = () => {
		let currentWeek, month, year;
		switch (timeNavigator.value) {
			case 'day':
				fechaVista.value = moment(fechaUnica.value).format('DD MMM YYYY');
				break;
			case 'week':
				currentWeek = Math.ceil(moment(fechaUnica.value).date() / 7);
				month = moment(fechaUnica.value).format('MMM');
				year = moment(fechaUnica.value).format('YYYY');
				fechaVista.value = `${currentWeek}ª semana - ${month} ${year}`;
				break;
			case 'month':
				fechaVista.value = moment(fechaUnica.value).format('MMM YYYY');
				break;
			case 'year':
				fechaVista.value = moment(fechaUnica.value).format('YYYY');
				break;
		}
	};

	const navigateDate = (direction) => {
		const amount = direction === 'next' ? 1 : -1;
		let duration;
		switch (timeNavigator.value) {
			case 'day':
				duration = moment.duration(amount, 'days');
				break;
			case 'week':
				duration = moment.duration(amount, 'weeks');
				break;
			case 'month':
				duration = moment.duration(amount, 'months');
				break;
			case 'year':
				duration = moment.duration(amount, 'years');
				break;
		}
		const newDate = moment(fechaUnica.value).add(duration);
		fechaUnica.value = newDate.format('YYYY-MM-DD');
		updateFechaVista();
		emit('date-changed', {
			newDate: fechaUnica.value,
			type: timeNavigator.value,
		});
	};

	const handleSegmentChange = () => {
		updateFechaVista();
		emit('date-changed', {
			newDate: fechaUnica.value,
			type: timeNavigator.value,
		});
	};

	onMounted(() => {
		updateFechaVista();
	});
</script>

<style lang="scss" scoped>
	.time-navigator {
		position: relative;
		padding: 10px 0;
		text-align: center;
		* {
			vertical-align: middle;
		}
		.fechaVista {
			color: #fff;
			padding: 0 5px;
		}
	}
	ion-segment {
		color: #000;
		--background: rgba(255, 255, 255, 0.5);
		margin-bottom: 15px;
	}
</style>
