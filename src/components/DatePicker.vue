<template>
	<div>
		<div @click="openModal" class="date-container">
			{{ displayDate }}
		</div>
		<IonModal
			:is-open="isModalOpen"
			@ionModalDidDismiss="closeModal"
			class="ion-padding"
		>
			<div class="modal-content" @click.self="closeModal">
				<IonDatetime
					@ionChange="onDateChange"
					presentation="date"
					:value="selectedISODate"
				>
					<div slot="buttons" class="calendar-footer">
						<IonButton expand="block" @click="selectDate">
							Seleccionar
						</IonButton>
					</div>
				</IonDatetime>
			</div>
		</IonModal>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { IonModal, IonDatetime, IonButton } from '@ionic/vue';
	import moment from 'moment';

	const props = defineProps({
		dateStart: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['dateSelected']);

	const displayDate = ref('');
	const selectedISODate = ref('');

	const isModalOpen = ref(false);

	const openModal = () => {
		isModalOpen.value = true;
	};

	const closeModal = () => {
		isModalOpen.value = false;
	};

	const onDateChange = (event) => {
		const newValue = event.detail.value;
		displayDate.value = moment(newValue).format('DD MMM YYYY');
		selectedISODate.value = newValue;
		console.log(newValue);
	};

	const selectDate = () => {
		closeModal();
		console.log('Selected date:', selectedISODate.value);
		emit('dateSelected', moment(selectedISODate.value).format('YYYY-MM-DD'));
	};

	const formatDateToISOString = (date) => {
		return moment(date).toISOString();
	};

	watch(
		() => props.dateStart,
		(newDate) => {
			console.log('newDate', newDate);
			if (newDate) {
				displayDate.value = moment(newDate).format('DD MMM YYYY');
				selectedISODate.value = formatDateToISOString(newDate);
			} else {
				displayDate.value = moment().format('DD MMM YYYY');
				selectedISODate.value = formatDateToISOString(new Date());
			}
		},
		{ immediate: true }
	);
</script>

<style scoped lang="scss">
	.date-container {
		cursor: pointer;
		background-color: #f0f0f0;
		border-radius: 5px;
		text-align: center;
		border-radius: 8px;
		-webkit-padding-start: 13px;
		padding-inline-start: 13px;
		-webkit-padding-end: 13px;
		padding-inline-end: 13px;
		padding-top: 7px;
		padding-bottom: 7px;
	}

	.modal-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	ion-modal.picker-modal.modal-default.show-modal {
		--backdrop-opacity: 0.8;
	}

	ion-modal {
		--height: fit-content;
		--background: white;
		--border-radius: 4px;

		.ion-color-calendar {
			--ion-color-base: green;
			--ion-color-contrast: white;
		}

		ion-datetime {
			width: 100%;
			max-width: none;
			border-radius: 14px;
			--color: gray;
		}

		ion-datetime .calendar-footer {
			width: 80vw;
			padding: 0 16px;
		}

		.calendar-footer {
			box-shadow: none;
			width: auto !important;
			padding: unset !important;

			&__date {
				text-align: center;
				width: 100%;
				padding-bottom: 16px;
			}
		}
	}
</style>
