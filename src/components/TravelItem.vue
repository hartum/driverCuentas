<template>
	<ion-item-sliding>
		<ion-item
			class="item-travel"
			lines="none"
			button="true"
			mode="ios"
			@click="editTravel"
		>
			<span slot="start">
				<ion-icon class="title-icon" :icon="payIcons[travel.payMethod]" />
			</span>
			<ion-label>
				<span class="hour-date-container">
					{{ hour(travel.startDate) }}
					<div class="date-container">
						{{ day(travel.startDate) }} {{ month(travel.startDate) }}
					</div>
				</span>
				<span :class="['money', { 'hidden-amount': isHidden }]">
					{{ formattedAmount }}{{ currency }}
					<div class="service-container">{{ travel.service }}</div>
				</span>
			</ion-label>
		</ion-item>
		<ion-item-options side="start">
			<ion-item-option color="primary" @click="toggleVisibility">
				<ion-icon
					slot="icon-only"
					:icon="isHidden ? eyeOffOutline : eyeOutline"
				></ion-icon>
			</ion-item-option>
		</ion-item-options>
		<ion-item-options side="end">
			<ion-item-option color="danger" @click="confirmRemoveTravel($event)">
				<ion-icon slot="icon-only" :icon="trash"></ion-icon>
			</ion-item-option>
		</ion-item-options>
	</ion-item-sliding>
</template>

<script setup>
	import { defineProps, defineEmits, computed, ref } from 'vue';
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
		eyeOffOutline,
		eyeOutline,
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

	const emit = defineEmits([
		'edit-travel',
		'delete-travel',
		'toggle-visibility',
	]);
	const isHidden = ref(false);

	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	const editTravel = () => {
		emit('edit-travel', props.travel.id);
	};

	const toggleVisibility = () => {
		isHidden.value = !isHidden.value;
		emit('toggle-visibility', { id: props.travel.id, hidden: isHidden.value });
	};

	const confirmRemoveTravel = (event) => {
		emit('delete-travel', { id: props.travel.id, event, itemType: 'viaje' });
	};
	const day = (date) => {
		return moment(date).format('DD');
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
			/*background: transparent;*/
			background: #eaeaea;
		}
	}
	.item-travel {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
		.title-icon {
			font-size: 2.5em;
			color: #8f8f8f;
		}
	}
	.hour-date-container {
		font-size: 1.5em;
		float: left;
		color: #8f8f8f;
		.date-container {
			font-size: 0.5em;
			color: #616161;
		}
	}
	.money {
		font-size: 1.5em;
		text-align: right;
		float: right;
		color: #666;
		&.hidden-amount {
			text-decoration: line-through;
			opacity: 0.5;
		}
		.service-container {
			font-size: 0.5em;
			color: #616161;
		}
	}
</style>
