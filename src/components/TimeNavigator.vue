<template>
	<div class="time-navigator">
		<ion-segment
			v-model="timeNavigator"
			@ionChange="handleSegmentChange"
			mode="ios"
		>
			<ion-segment-button
				v-for="option in timeOptions"
				:key="option.value"
				:value="option.value"
				mode="ios"
			>
				<ion-label>{{ option.label }}</ion-label>
			</ion-segment-button>
		</ion-segment>

		<ion-icon
			size="large"
			color="primary"
			:icon="arrowBackCircle"
			@click="navigateDate('prev')"
		/>

		<div class="calendar">
			<em>{{ calendarData.em }}</em>
			<strong>{{ calendarData.strong }}</strong>
			<span>{{ calendarData.span }}</span>
		</div>

		<ion-icon
			size="large"
			color="primary"
			:icon="arrowForwardCircle"
			@click="navigateDate('next')"
		/>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
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
	const fechaUnica = ref(props.initialDate);

	const timeOptions = [
		{ value: 'day', label: 'Día' },
		{ value: 'week', label: 'Semana' },
		{ value: 'month', label: 'Mes' },
		{ value: 'year', label: 'Año' },
	];

	const calendarData = computed(() => {
		const date = moment(fechaUnica.value);
		const formatters = {
			day: () => ({
				em: date.format('dddd'),
				strong: date.format('MMM'),
				span: date.format('DD'),
			}),
			week: () => ({
				em: 'Semana',
				strong: date.format('MMM'),
				span: `${Math.ceil(date.date() / 7)}ª`,
			}),
			month: () => ({
				em: '',
				strong: date.format('YYYY'),
				span: date.format('MMM'),
			}),
			year: () => ({
				em: '',
				strong: 'Año',
				span: date.format('YYYY'),
			}),
		};
		return formatters[timeNavigator.value]();
	});

	const navigateDate = (direction) => {
		const amount = direction === 'next' ? 1 : -1;
		const newDate = moment(fechaUnica.value).add(amount, timeNavigator.value);
		fechaUnica.value = newDate.format('YYYY-MM-DD');
		emitDateChanged();
	};

	const handleSegmentChange = () => {
		emitDateChanged();
	};

	const emitDateChanged = () => {
		console.log('emito la fecha: ', fechaUnica.value);
		emit('date-changed', {
			newDate: fechaUnica.value,
			type: timeNavigator.value,
		});
	};

	onMounted(emitDateChanged);
</script>

<style lang="scss" scoped>
	.time-navigator {
		position: relative;
		padding: 0;
		text-align: center;
		* {
			vertical-align: middle;
		}
		.fechaVista {
			color: #fff;
			padding: 0 5px;
		}
		.icon-large {
			width: 1.5em;
			height: 1.5em;
			font-size: 2em;
			margin: 0 0.5em;
			background-color: #fff;
			border-radius: 25px;
		}
	}
	ion-segment {
		color: #000;
		--background: rgba(255, 255, 255, 0.5);
		margin-bottom: 15px;
	}

	//------ Calendar -------
	div.calendar {
		font-size: 0.7em; /* change icon size */
		display: inline-block;
		position: relative;
		margin: auto;
		width: 80px;
		height: 80px;
		background-color: #fff;
		border-radius: 0.6em;
		border: 1px solid #d63d00;
		overflow: hidden;
	}

	div.calendar * {
		display: block;
		width: 100%;
		font-size: 2em;
		font-weight: bold;
		font-style: normal;
		text-align: center;
	}

	div.calendar strong {
		font-size: 1.5em;
		position: absolute;
		top: 0;
		text-transform: uppercase;
		padding: 0.2em 0;
		color: #fff;
		background-color: #d63d00;
		border-bottom: 1px dashed #fff;
		box-shadow: 0 2px 0 #d63d00;
	}

	div.calendar em {
		font-size: 1em;
		position: absolute;
		bottom: 0.3em;
		color: #2f2f2f;
	}

	div.calendar span {
		width: 100%;
		font-size: 2.8em;
		letter-spacing: -0.05em;
		padding-top: 1em;
		color: #2f2f2f;
	}
</style>
