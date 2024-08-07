<template>
	<ion-card class="shift-card" mode="ios">
		<ion-card-header class="shift-header">
			<ion-card-title class="shift-title">
				<ion-item-sliding>
					<ion-item button="true" lines="none" mode="ios" @click="editShift">
						<div class="shift-tittle-info">
							{{ formatTime(shift.startDate) }}
							<ion-icon
								:icon="timeOutline"
								class="shift-header-icon"
								size="large"
							/>
							{{ formatTime(shift.endDate) }}
						</div>
					</ion-item>
					<ion-item-options side="end">
						<ion-item-option color="danger" @click="confirmRemoveShift($event)">
							<ion-icon slot="icon-only" :icon="trash"></ion-icon>
						</ion-item-option>
					</ion-item-options>
				</ion-item-sliding>
			</ion-card-title>
		</ion-card-header>
		<div
			v-if="shift.modeKM == 'fix' && shift.totalKm > 0"
			class="ion-padding km-container"
		>
			Kilometros
			<div class="right">{{ shift.totalKm }} km</div>

			<ion-icon :icon="timerOutline"></ion-icon>
		</div>
		<div
			v-else-if="shift.finalKm - shift.initialKm > 0"
			class="ion-padding km-container"
		>
			Kilometros <ion-icon :icon="timerOutline" class="icon"></ion-icon>
			<div class="right">{{ shift.finalKm - shift.initialKm }} Km</div>
		</div>
		<ion-card-content><slot></slot></ion-card-content>
		<div class="shift-footer">
			<div class="subtotal-container">
				<div v-if="shift.modeTotalShift == 'fixTotal'" class="shift-total">
					<div class="right">{{ shift.totalShift }} {{ currency }}</div>
				</div>
				<div v-else>
					<div class="subtotal">
						<span class="subtotal-title">Subtotal</span>
						<div class="right">{{ subtotalBeforeGasoline }}{{ currency }}</div>
					</div>
					<div class="subtotal" v-if="shift.gasoline > 0">
						<span class="subtotal-title"> Gasolina </span>
						<div class="right">-{{ shift.gasoline }}{{ currency }}</div>
					</div>
					<div
						class="shift-total"
						:class="calculatedTotal < 0 ? 'expense' : ''"
					>
						<div class="right">{{ calculatedTotal }}{{ currency }}</div>
					</div>
				</div>
			</div>
		</div>
	</ion-card>
</template>

<script setup>
	import { defineProps, defineEmits, computed } from 'vue';
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
	import { trash, timeOutline, timerOutline } from 'ionicons/icons';

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

	const subtotalBeforeGasoline = computed(() => {
		let total = 0;
		if (props.shift.children) {
			props.shift.children.forEach((item) => {
				if (item.type === 'travel') {
					total += item.amount;
				} else if (item.type === 'note') {
					if (item.noteType === 'income') {
						total += item.amount;
					} else if (item.noteType === 'expense') {
						total -= item.amount;
					}
				}
			});
		}
		return total.toFixed(2);
	});

	const calculatedTotal = computed(() => {
		if (props.shift.modeTotalShift === 'fixTotal') {
			return props.shift.totalShift;
		}

		return (
			parseFloat(subtotalBeforeGasoline.value) - props.shift.gasoline
		).toFixed(2);
	});
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: transparent;
	}
	ion-card {
		--background: rgba(255, 255, 255, 0.9);
	}

	.shift-card {
		border: 1px solid #ccc;
		margin: 20px 0;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: rgba(255, 255, 255, 0.8);
			text-align: center;
			padding-left: 0;
			padding-right: 0;
			.shift-title {
				.shift-tittle-info {
					font-size: 2.3em;
					font-weight: 300 !important;
					text-align: center;
					width: 100%;
					color: #666;
				}
				.shift-header-icon {
					vertical-align: middle;
					width: 1.5em;
					height: 1.5em;
					margin: -5px 0 0 0;
				}
			}
		}
		.km-container {
			background: #eaeaea;
			font-size: 1.3em;
			border-bottom: 1px #d8d8d8 solid;
			color: #8f8f8f;
			.icon {
				vertical-align: bottom;
			}
			.right {
				float: right;
				text-align: right;
				padding-right: 1.7em;
			}
		}
		.card-content-ios {
			padding: 0px;
		}
		.shift-footer {
			background-color: rgba(255, 255, 255, 0.8);
			.subtotal-container {
				padding-top: 0.2em;
				padding-bottom: 0.2em;
				border-top: 1px #666 dashed;
				font-size: 2.4em;
				color: #8f8f8f;
				background: #eaeaea;
				margin-bottom: -7px;

				.subtotal {
					padding: 0em 0.4em 0.2em 0.5em;

					.subtotal-title {
						font-size: 0.6em;
						font-weight: 300;
						.icon {
							vertical-align: middle;
						}
					}
				}

				.right {
					float: right;
					text-align: right;
					padding-right: 1em;
				}
				.shift-total {
					border-top: 1px solid #ccc;
					padding-top: 0.3em;
					padding-bottom: 1.5em;
					padding-right: 0.4em;
					color: #333;
					background-color: #fff;
				}
			}
		}
	}
</style>
