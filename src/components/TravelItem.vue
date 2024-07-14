<template>
	<IonItemSliding>
		<IonItem class="item-travel" button="true" @click="editTravel">
			<IonLabel>
				<IonIcon
					:icon="payIcons[travel.payMethod]"
					size="small"
					class="icon-travel"
				></IonIcon>
				<span>{{ formatDate(travel.startDate) }}</span>
				<span class="money income">
					<b>{{ travel.amount }}{{ currency }} </b>
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
	import { defineProps, defineEmits } from 'vue';
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
		emit('delete-travel', { id: props.travel.id, event });
	};

	const formatDate = (date) => {
		return moment(date).format('DD MMM - HH:mm');
	};
</script>

<style scoped>
	ion-item::part(native) {
		background: transparent;
	}
	.item-travel {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
	}

	.money {
		font-size: 1.4em;
		vertical-align: text-bottom;
		float: right;
		color: #666;
	}

	.icon-travel {
		vertical-align: middle;
		color: #4b4a4a;
		width: 1.5em;
		height: 1.5em;
	}

	.income {
		color: #087702;
	}
</style>
