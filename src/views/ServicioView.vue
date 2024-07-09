<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Servicios</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<ion-icon :icon="listCircleOutline" class="icon"></ion-icon>
			<div class="list-container">
				<img src="/hand.svg" class="animated-hand" @click="fadeOutHand" />
				<ion-list>
					<ion-list-header>
						<ion-label>¿Para quien vas a trabajar?*</ion-label>
					</ion-list-header>
					<ion-reorder-group :disabled="false" @ionItemReorder="handleReorder">
						<IonItemSliding
							v-for="(service, index) in services"
							:key="index"
							ref="slidingItems"
						>
							<ion-item>
								<ion-label>{{ service }}</ion-label>
								<ion-reorder slot="end"></ion-reorder>
							</ion-item>
							<IonItemOptions side="end">
								<ion-item-option
									color="danger"
									@click="confirmRemoveService(index, $event)"
								>
									<ion-icon slot="icon-only" :icon="trash"></ion-icon>
								</ion-item-option>
							</IonItemOptions>
						</IonItemSliding>
					</ion-reorder-group>
					<ion-item>
						<ion-input
							label="Nuevo Servicio"
							label-placement="stacked"
							placeholder="Nombre del Servicio"
							v-model="newService"
						></ion-input>
						<ion-button mode="ios" @click="addService">
							<ion-icon slot="end" :icon="addCircle"></ion-icon>
							Añadir
						</ion-button>
					</ion-item>
				</ion-list>
				<p class="ion-padding">
					<small>*Borra, Añade, reordena. Podrás editarlo mas adelante</small>
				</p>
			</div>
		</IonContent>
		<ion-action-sheet
			:header="actionSheetHeader"
			:buttons="actionSheetButtons"
			:is-open="actionSheetOpen"
			@didDismiss="handleActionSheetDismiss"
		></ion-action-sheet>
		<IonFooter class="ion-padding">
			<IonNavLink router-direction="forward" :component="component">
				<IonButton expand="block" fill="outline" mode="ios">
					Siguiente
				</IonButton>
			</IonNavLink>
		</IonFooter>
	</IonPage>
</template>

<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonListHeader,
		IonItem,
		IonLabel,
		IonIcon,
		IonItemSliding,
		IonItemOptions,
		IonItemOption,
		IonReorderGroup,
		IonReorder,
		IonInput,
		IonButton,
		IonActionSheet,
		IonNavLink,
		IonFooter,
	} from '@ionic/vue';
	import { trash, addCircle, listCircleOutline } from 'ionicons/icons';
	import { ref, markRaw } from 'vue';
	import MapaView from './MapaView.vue';
	// Crear una referencia para navegar
	const component = ref(markRaw(MapaView));

	const services = ref(['Lyft', 'Privado', 'Uber', 'Bolt', 'Taxi']);
	const newService = ref('');
	const actionSheetOpen = ref(false);
	const actionSheetHeader = ref('');
	const serviceToRemove = ref(null);
	let slidingItem = ref(null);

	const handleReorder = (event) => {
		services.value = event.detail.complete(services.value);
	};

	const addService = () => {
		if (newService.value.trim()) {
			services.value.push(newService.value.trim());
			newService.value = '';
		}
	};

	const confirmRemoveService = (index, event) => {
		serviceToRemove.value = index;
		slidingItem.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = `¿Deseas eliminar el servicio "${services.value[index]}"?`;
		actionSheetOpen.value = true;
	};

	const removeService = () => {
		if (serviceToRemove.value !== null && services.value.length > 1) {
			services.value.splice(serviceToRemove.value, 1);
			serviceToRemove.value = null;
		}
		closeSlidingItem();
		fadeOutHand();
	};

	const handleActionSheetDismiss = (event) => {
		const role = event.detail.role;
		if (role === 'destructive') {
			removeService();
		} else {
			closeSlidingItem();
		}
		actionSheetOpen.value = false;
	};

	const closeSlidingItem = () => {
		if (slidingItem.value) {
			slidingItem.value.close();
			slidingItem.value = null;
		}
	};

	const actionSheetButtons = [
		{
			text: 'Borrar servicio',
			role: 'destructive',
			data: {
				action: 'delete',
			},
		},
		{
			text: 'Cancel',
			role: 'cancel',
			data: {
				action: 'cancel',
			},
		},
	];

	const fadeOutHand = () => {
		const hand = document.querySelector('.animated-hand');
		if (hand) {
			hand.classList.add('fade-out');
		}
	};
</script>

<style scoped>
	.icon {
		font-size: 100px;
		color: #ccc;
		display: block;
		margin: auto;
	}
	small {
		color: #666;
	}
	.list-container {
		position: relative;
	}
	.animated-hand {
		position: absolute;
		top: 40px;
		right: 20px;
		z-index: 9;
		opacity: 0.9;
		transform: translate(-50%, -50%);
		animation: slide-left 1.5s ease infinite;
		filter: drop-shadow(20px 20px 8px rgb(0 0 0 / 0.4));
		cursor: pointer;
	}
	.animated-hand-vertical {
		position: absolute;
		top: 40px;
		right: 0px;
		z-index: 9;
		opacity: 0.9;
		transform: translate(-50%, -50%);
		animation: slide-left 1.5s ease infinite;
		filter: drop-shadow(20px 20px 8px rgb(0 0 0 / 0.4));
		cursor: pointer;
	}
	@keyframes slide-left {
		0% {
			transform: translateX(0);
			zoom: 8.5;
		}
		100% {
			transform: translateX(-40%);
			zoom: 1;
		}
	}
	.fade-out {
		animation: fadeOut 0.3s forwards;
	}
	@keyframes fadeOut {
		0% {
			opacity: 0.3;
			transform: translateX(-40%);
		}
		100% {
			opacity: 0;
			transform: translateX(-40%);
			display: none;
		}
	}
</style>
