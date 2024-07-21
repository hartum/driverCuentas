<template>
	<section class="time-picker">
		<div class="input-container">
			<div class="time-value" @click="setShowPicker(true)">
				<input
					:value="displayTime"
					readonly
					class="time-value__input"
					:placeholder="displayTime"
					expand="block"
				/>
			</div>
		</div>

		<IonModal
			class="picker-modal"
			:is-open="showPicker"
			@ionModalDidDismiss="setShowPicker(false)"
		>
			<div class="picker-modal__container">
				<ion-picker>
					<ion-picker-column
						:value="selectedHours"
						@ionChange="onColumnChange('hours', $event)"
					>
						<ion-picker-column-option
							v-for="hours in timeData.hours"
							:key="hours"
							:value="hours"
						>
							{{ hours }}
						</ion-picker-column-option>
					</ion-picker-column>
					<ion-picker-column
						:value="selectedMinutes"
						@ionChange="onColumnChange('minutes', $event)"
					>
						<ion-picker-column-option
							v-for="minutes in timeData.minutes"
							:key="minutes"
							:value="minutes"
						>
							{{ minutes }}
						</ion-picker-column-option>
					</ion-picker-column>
				</ion-picker>

				<div class="actions">
					<IonButton expand="block" @click="setTimeValue">Ok</IonButton>
				</div>
			</div>
		</IonModal>
	</section>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import {
		IonModal,
		IonButton,
		IonPicker,
		IonPickerColumn,
		IonPickerColumnOption,
	} from '@ionic/vue';

	const props = defineProps({
		value: {
			type: String,
			default: '00:00',
		},
	});
	const displayTime = ref();
	const emit = defineEmits(['time-selected']);
	const showPicker = ref(false);
	const selectedHours = ref('00');
	const selectedMinutes = ref('00');

	const timeData = {
		hours: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
		minutes: Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')),
	};

	const setShowPicker = (value) => {
		showPicker.value = value;
	};

	const setTimeValue = () => {
		console.log('1.cambia la hora');
		const newTime = `${selectedHours.value}:${selectedMinutes.value}`;
		emit('time-selected', newTime);
		setShowPicker(false);
	};

	const onColumnChange = (type, event) => {
		if (type === 'hours') {
			selectedHours.value = event.detail.value;
		} else {
			selectedMinutes.value = event.detail.value;
		}
		displayTime.value = `${selectedHours.value}:${selectedMinutes.value}`;
	};

	watch(
		() => props.value,
		(newTime) => {
			if (newTime) {
				const [hours, minutes] = newTime.split(':');
				selectedHours.value = hours;
				selectedMinutes.value = minutes;
			} else {
				selectedHours.value = '00';
				selectedMinutes.value = '00';
			}
			displayTime.value = `${selectedHours.value}:${selectedMinutes.value}`;
		},
		{ immediate: true }
	);
</script>

<style lang="scss" scoped>
	.time-picker {
		.input-container {
			input {
				width: 60px;
				min-height: 32px;
				border: none;
				border-radius: 8px;
				outline: 0;
				line-height: 20px;
				background: #edeef0;
				-webkit-padding-start: 13px;
				padding-inline-start: 13px;
				-webkit-padding-end: 13px;
				padding-inline-end: 13px;
				padding-top: 7px;
				padding-bottom: 7px;
			}

			.time-value {
				position: relative;
				width: 100%;

				&__input {
					padding: 0 8px;
					color: var(ion-text-color);
				}
			}
		}
	}

	ion-modal.picker-modal {
		padding: 0 16px;
		--width: 100%;
		--height: fit-content;
		--border-radius: 4px;
	}

	ion-modal.picker-modal.modal-default.show-modal {
		--backdrop-opacity: 0.7;
	}

	.picker-modal {
		&__container {
			height: fit-content;
			padding: 8px 8px 16px;
			background-color: white;

			.actions {
				padding: 8px 8px 0;
			}
		}
	}
</style>
