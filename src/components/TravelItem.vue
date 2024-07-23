<template>
	<IonItemSliding>
		<IonItem class="item-travel" button="true" @click="editTravel">
			<IonLabel>
				<IonIcon
					:icon="payIcons[travel.payMethod]"
					size="default"
					class="icon-travel"
				></IonIcon>

				<div class="calendar">
					<em></em>
					<strong>{{ month(travel.startDate) }}</strong>
					<span>{{ day(travel.startDate) }}</span>
				</div>

				<div class="time">
					{{ hour(travel.startDate) }}
				</div>

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
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.8);
	}
	.item-travel {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
	}

	.money {
		font-size: 2.4em;
		vertical-align: text-bottom;
		float: right;
		color: #666;
	}

	.icon-travel {
		width: 2em;
		height: 2em;
		color: #949494;
		float: right;
		right: 20px;
		transform: translateY(25%) translateX(25%);
	}

	.income {
		color: #087702;
	}

	div.calendar {
		float: left;
		font-size: 0.4em; /* change icon size */
		display: block;
		position: relative;
		width: 44px;
		height: 45px;
		background-color: #fff;
		border-radius: 0.6em;
		border: 1px solid #adadad;
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
		background-color: #696868;
		border-bottom: 1px dashed #fff;
		box-shadow: 0 2px 0 #696868;
	}

	div.calendar em {
		position: absolute;
		bottom: 0.3em;
		color: #2f2f2f;
	}

	div.calendar span {
		width: 100%;
		font-size: 2.8em;
		letter-spacing: -0.05em;
		padding-top: 1.1em;
		color: #2f2f2f;
	}
	div.time {
		float: left;
		font-size: 1.5em; /* change icon size */
		font-weight: bold;
		display: block;
		position: relative;
		padding-top: 0.35em;
		margin-left: 0.35em;
		width: 80px;
		height: 45px;
		text-align: center;
		background-color: #fff;
		border-radius: 0.2em;
		border: 1px solid #adadad;
		overflow: hidden;
	}
</style>
