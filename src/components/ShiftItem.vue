<template>
	<IonCard class="shift-card" mode="ios">
		<IonCardHeader class="shift-header">
			<IonCardTitle class="shift-title">
				<IonItemSliding>
					<IonItem button="true" lines="none" @click="editShift">
						<IonIcon
							:icon="timeOutline"
							color="primary"
							class="shift-header-icon"
							size="large"
						/>
						<span class="shift-tittle-info"
							>{{ formatTime(shift.startDate) }}h -
							{{ formatTime(shift.endDate) }}h</span
						>
					</IonItem>
					<IonItemOptions side="end">
						<IonItemOption color="danger" @click="confirmRemoveShift($event)">
							<IonIcon slot="icon-only" :icon="trash"></IonIcon>
						</IonItemOption>
					</IonItemOptions>
				</IonItemSliding>
			</IonCardTitle>
		</IonCardHeader>
		<IonCardContent><slot></slot></IonCardContent>
		<div class="shift-footer ion-padding">
			<div>
				<div v-if="shift.modeKM == 'fix'">
					<b>{{ shift.totalKm }}</b> km
					<IonIcon :icon="timerOutline"></IonIcon>
				</div>
				<div v-else>
					<b>{{ shift.finalKm - shift.initialKm }}</b> km
					<IonIcon :icon="timerOutline"></IonIcon>
				</div>
				<div>
					<b>{{ shift.gasoline }}</b> {{ currency }}
					<IonIcon :icon="waterOutline"></IonIcon>
				</div>
			</div>
			<div class="shift-footer-right">
				<div>SubTotal</div>
				<div v-if="shift.modeTotalShift == 'fixTotal'" class="shift-total">
					{{ shift.totalShift }} {{ currency }}
				</div>
				<div v-else><b>*Esperando viajes</b></div>
			</div>
		</div>
	</IonCard>
</template>

<script setup>
	import { defineProps, defineEmits } from 'vue';
	import moment from 'moment';
	import {
		IonItemSliding,
		IonItem,
		IonItemOptions,
		IonItemOption,
		IonIcon,
		IonCardContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
	} from '@ionic/vue';
	import {
		trash,
		timeOutline,
		timerOutline,
		waterOutline,
	} from 'ionicons/icons';

	const props = defineProps({
		shift: {
			type: Object,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['edit-shift', 'delete-shift']);

	const editShift = () => {
		emit('edit-shift', props.shift.id);
	};

	const confirmRemoveShift = (event) => {
		emit('delete-shift', { id: props.shift.id, event, itemType: 'turno' });
	};

	const formatTime = (date) => {
		return moment(date).format('HH:mm');
	};
</script>

<style lang="scss">
	ion-item::part(native) {
		background: transparent;
	}
	ion-card {
		--background: rgba(255, 255, 255, 0.8);
	}
	.shift-card {
		border: 1px solid #ccc;
		margin: 20px 0;
		box-shadow: 0 1px 0 #767676, 0 5px 0 #fff, 0 6px 0 #767676, 0 11px 0 #fff,
			0 12px 0 #767676, 0 0 0 1px #767676;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: #f8f8ff;
			text-align: center;
			padding-left: 0;
			.shift-title {
				.shift-tittle-info {
					font-size: 28px;
					font-weight: 300 !important;
					color: var(--ion-color-primary);
				}
				.shift-header-icon {
					vertical-align: bottom;
					margin: 0 9px 0 0;
				}
			}
		}
		.card-content-ios {
			padding: 0px;
		}
		.shift-footer {
			border-top: 1px #ccc solid;
			display: flex;
			text-align: right;
			.shift-footer-right {
				.shift-total {
					font-size: 1.7em;
				}
				&:first-child {
					flex-grow: 4;
				}
				&:last-child {
					flex-grow: 1;
					padding-right: 20px;
				}
			}
		}
	}
</style>
