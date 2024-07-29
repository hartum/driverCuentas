<template>
	<IonItemSliding>
		<IonItem class="item-travel" lines="none" button="true" @click="editTravel">
			<IonLabel>
				<span class="hour-date-container">
					{{ hour(travel.noteDate) }}
					<div class="date-container">
						{{ day(travel.noteDate) }} {{ month(travel.noteDate) }}
					</div>
				</span>
				<span class="money">
					{{ formattedAmount }}{{ currency }}
					<div class="pay-method-container">
						<span v-if="travel.payMethod == 'cash'"> Efectivo </span>
						<span v-else-if="travel.payMethod == 'card'"> Tarjeta </span>
						<span v-else-if="travel.payMethod == 'app'"> Aplicación </span>
						<IonIcon
							:icon="payIcons[travel.payMethod]"
							size="default"
							class="icon-travel"
						></IonIcon>
					</div>
				</span>
			</IonLabel>
		</IonItem>
		<IonItemOptions side="end">
			<IonItemOption color="danger" @click="confirmRemoveTravel($event)">
				<IonIcon slot="icon-only" :icon="trash"></IonIcon>
			</IonItemOption>
		</IonItemOptions>
	</IonItemSliding>
</template>

<script setup>
	import { defineProps, defineEmits, computed } from 'vue';
	import moment from 'moment';
	import {
		IonItemSliding,
		IonItem,
		IonLabel,
		IonItemOptions,
		IonItemOption,
		IonIcon,
	} from '@ionic/vue';
	import {
		trash,
		phonePortraitOutline,
		cashOutline,
		cardOutline,
	} from 'ionicons/icons';

	const props = defineProps({
		travel: {
			type: Object,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['edit-travel', 'delete-travel']);

	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	const editTravel = () => {
		emit('edit-travel', props.travel.id);
	};

	const confirmRemoveTravel = (event) => {
		emit('delete-travel', { id: props.travel.id, event, itemType: 'viaje' });
	};

	const formatDate = (date) => {
		return moment(date).format('DD MMM - HH:mm');
	};
	const day = (date) => {
		return moment(date).format('DD');
	};
	const weekday = (date) => {
		return moment(date).format('dddd');
	};
	const hour = (date) => {
		return moment(date).format('HH:mm');
	};
	const month = (date) => {
		return moment(date).format('MMM');
	};
	const formattedAmount = computed(() => {
		return props.travel.amount.toFixed(2);
	});
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.9);
	}
	.shift-card {
		ion-item::part(native) {
			background: transparent;
		}
	}
	.item-travel {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
	}
	.hour-date-container {
		font-size: 2em;
		float: left;
		color: #8f8f8f;
		.date-container {
			font-size: 0.5em;
		}
	}
	.money {
		font-size: 2em;
		vertical-align: text-bottom;
		text-align: right;
		float: right;
		color: #666;
		.pay-method-container {
			font-size: 0.5em;
			color: #8f8f8f;
			.icon-travel {
				width: 1em;
				height: 1em;
				vertical-align: middle;
			}
		}
	}

	.income {
		color: #087702;
	}
</style>
