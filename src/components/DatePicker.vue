<template>
	<div>
		<div @click="openModal" class="date-container">
			{{ displayDate }}
		</div>
		<ion-modal
			:is-open="isModalOpen"
			@ionModalDidDismiss="closeModal"
			class="ion-padding"
		>
			<div class="modal-content" @click.self="closeModal">
				<vue-date-picker
					v-model="selectedISODate"
					inline
					auto-apply
					:enable-time-picker="false"
				></vue-date-picker>
				<ion-item mode="ios">
					<ion-button
						expand="block"
						@click="selectDate"
						mode="ios"
						size="large"
					>
						Seleccionar
					</ion-button>
				</ion-item>
			</div>
		</ion-modal>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { IonModal, IonButton, IonItem } from '@ionic/vue';
	import moment from 'moment';

	const props = defineProps({
		value: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['date-selected']);
	const displayDate = ref('');
	const selectedISODate = ref('');
	const isModalOpen = ref(false);

	const openModal = () => {
		isModalOpen.value = true;
	};

	const closeModal = () => {
		isModalOpen.value = false;
	};

	const selectDate = () => {
		closeModal();
		console.log('1.cambia la fecha');
		emit('date-selected', moment(selectedISODate.value).format('YYYY-MM-DD'));
	};

	const formatDateToISOString = (date) => {
		return moment(date).toISOString();
	};

	watch(
		() => props.value,
		(newDate) => {
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
		width: auto;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
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
