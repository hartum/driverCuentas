<template>
	<ion-item-sliding>
		<ion-item
			class="item-note"
			button="true"
			lines="none"
			mode="ios"
			@click="editNote"
		>
			<span slot="start">
				<ion-icon class="title-icon" :icon="iconType[note.noteType]" />
			</span>
			<ion-label>
				<span class="hour-date-container">
					{{ hour(note.noteDate) }}
					<div class="date-container">
						{{ day(note.noteDate) }} {{ month(note.noteDate) }}
					</div>
				</span>
				<span
					:class="['money', { 'hidden-amount': isHidden }]"
					v-if="note.amount > 0"
				>
					<span v-if="note.noteType == 'expense'">-</span>
					{{ formattedAmount }}{{ currency }}
					<div class="service-container">
						{{ note.description }}
						<ion-icon
							v-show="note.fuel"
							slot="icon-only"
							:icon="water"
						></ion-icon>
					</div>
				</span>
				<span v-else-if="note.noteType == 'other'" class="note-decription">
					{{ note.description }}
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
			<ion-item-option color="danger" @click="confirmRemoveNote($event)">
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
		readerOutline,
		thumbsUpOutline,
		thumbsDownOutline,
		eyeOffOutline,
		eyeOutline,
		water,
	} from 'ionicons/icons';

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

	const emit = defineEmits(['edit-note', 'delete-note', 'toggle-visibility']);
	const isHidden = ref(false);

	const iconType = {
		income: thumbsUpOutline,
		expense: thumbsDownOutline,
		other: readerOutline,
	};

	const editNote = () => {
		emit('edit-note', props.note.id);
	};

	const toggleVisibility = () => {
		isHidden.value = !isHidden.value;
		emit('toggle-visibility', { id: props.note.id, hidden: isHidden.value });
	};

	const confirmRemoveNote = (event) => {
		emit('delete-note', { id: props.note.id, event, itemType: 'nota' });
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
		return props.note.amount.toFixed(2);
	});
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.9);
	}
	.item-note {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
		.title-icon {
			font-size: 2.5em;
			color: #8f8f8f;
		}
	}

	.shift-card {
		ion-item::part(native) {
			/*background: transparent;*/
			background: #eaeaea;
		}
		.item-note {
			border-bottom: none;
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
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 120px;
		}
	}
	.note-decription {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		float: right;
		width: 50%;
		vertical-align: middle;
	}
	.income {
		color: #087702;
	}

	.expense {
		color: #bc0404;
	}
</style>
