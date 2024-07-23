<template>
	<IonItemSliding>
		<IonItem class="item-note" button="true" @click="editNote">
			<IonLabel>
				<IonIcon :icon="readerOutline" size="small" class="icon-note"></IonIcon>

				<div class="calendar">
					<em></em>
					<strong>{{ month(note.noteDate) }}</strong>
					<span>{{ day(note.noteDate) }}</span>
				</div>

				<div class="time">
					{{ hour(note.noteDate) }}
				</div>

				<span
					class="money"
					:class="{
						income: note.noteType == 'income',
						expense: note.noteType == 'expense',
					}"
					v-if="note.amount > 0"
				>
					<b>{{ note.amount }}{{ currency }} </b>
				</span>
			</IonLabel>
		</IonItem>
		<IonItemOptions side="end">
			<IonItemOption color="danger" @click="confirmRemoveNote($event)">
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
	import { trash, readerOutline } from 'ionicons/icons';

	const props = defineProps({
		note: {
			type: Object,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['edit-note', 'delete-note']);

	const editNote = () => {
		emit('edit-note', props.note.id);
	};

	const confirmRemoveNote = (event) => {
		emit('delete-note', { id: props.note.id, event, itemType: 'nota' });
	};

	const formatDate = (date) => {
		return moment(date).format('DD MMM - HH:mm');
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
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.8);
	}
	.item-note {
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

	.icon-note {
		width: 2em;
		height: 2em;
		color: #949494;
		float: right;
		right: 20px;
		transform: translateY(15%) translateX(25%);
	}

	.income {
		color: #087702;
	}

	.expense {
		color: #bc0404;
	}
	/*------- CALENDAR -------*/
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
