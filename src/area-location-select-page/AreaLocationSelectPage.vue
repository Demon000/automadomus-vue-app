<template>
    <div class="location-select-page page">
        <app-sidebar></app-sidebar>
        <app-navbar
                has-nav-button
                title="Select location"
        >
            <template #nav-icon>
                <ui-icon-button
                        @click="onExitButtonClick"
                >
                    <i class="mdi mdi-close"></i>
                </ui-icon-button>
            </template>
            <template #toolbar>
                <ui-icon-button
                        @click="onSaveButtonClick"
                >
                    <i class="mdi mdi-check"></i>
                </ui-icon-button>
            </template>
        </app-navbar>
        <div class="map-container">
            <l-map
                    v-if="initialLocationLoaded"
                    class="map"
                    zoomAnimation
                    @dblclick="onMapClick"
                    :zoom="zoom"
                    :center="location"
                    :options="{
                        zoomControl: false,
                    }"
            >
                <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ></l-tile-layer>

                <l-marker
                        v-if="showMarker"
                        :lat-lng="location"
                >
                    <l-icon
                            :icon-url="iconUrl"
                    >
                    </l-icon>
                </l-marker>
            </l-map>

            <div class="details-card-container">
                <ui-card class="details-card">
                    <ui-textfield
                            class="ui-textfield"
                            v-model="location.address"
                            fullwidth
                            @keyup.enter="onAddressEnterPress"
                    >
                        Address
                    </ui-textfield>

                    <div class="point-fields">
                        <ui-textfield
                                class="ui-textfield"
                                v-model="location.lat"
                                @keyup.enter="onPositionEnterPress"
                        >
                            Latitude
                        </ui-textfield>
                        <ui-textfield
                                class="ui-textfield"
                                v-model="location.lng"
                                @keyup.enter="onPositionEnterPress"
                        >
                            Longitude
                        </ui-textfield>
                    </div>
                </ui-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AppNavbar from '@/app/AppNavbar.vue';
import { LIcon, LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationEvent } from 'leaflet';
import Location, { LocationPoint } from '@/models/Location';
import { geocodeService } from '@/dependencies';

export default defineComponent({
    name: 'AreaLocationSelectPage',
    components: {
        AppSidebar,
        AppNavbar,
        LMap,
        LTileLayer,
        LMarker,
        LIcon,
    },
    emits: [
        'saveButtonClick',
        'exitButtonClick',
        'location',
    ],
    props: {
        initialLocationPoint: Object as () => LocationPoint,
    },
    data() {
        return {
            location: {
                lat: 0,
                lng: 0,
                address: '',
            } as Location,
            initialLocationLoaded: false,
            showMarker: false,
            zoom: 18,
            tileProvider: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
            iconUrl: '/assets/images/pin.svg',
        };
    },
    async mounted() {
        if (this.initialLocationPoint) {
            await this.setPosition(this.initialLocationPoint);
            await this.syncAddressFromPosition();
            this.initialLocationLoaded = true;
        } else {
            this.getUserPhysicalPosition();
        }
    },
    methods: {
        onSaveButtonClick(): void {
            this.$emit('saveButtonClick', this.location);
        },
        onExitButtonClick(): void {
            this.$emit('exitButtonClick');
        },
        async setPosition(point: LocationPoint) {
            this.location.lat = point.lat;
            this.location.lng = point.lng;

            this.showMarker = false;
            await nextTick();
            this.showMarker = true;
        },
        setAddress(address: string) {
            this.location.address = address;
        },
        async syncAddressFromPosition() {
            try {
                const address = await geocodeService.getAddress(this.location);
                this.setAddress(address);
            } catch (err) {
                console.error(err);
            }
        },
        async syncLocationFromIncompleteAddress() {
            try {
                const location = await geocodeService.getPosition(this.location.address);
                await this.setPosition(location);
                this.setAddress(location.address);
            } catch (err) {
                console.error(err);
            }
        },
        async onAddressEnterPress() {
            await this.syncLocationFromIncompleteAddress();
        },
        async onPositionEnterPress() {
            await this.syncAddressFromPosition();
        },
        async onMapClick(value: LocationEvent) {
            if (!value.latlng) {
                return;
            }

            await this.setPosition(value.latlng);
            await this.syncAddressFromPosition();
        },
        getUserPhysicalPosition() {
            if (!navigator.geolocation) {
                console.error('Geolocation not available');
                return;
            }

            navigator.geolocation.getCurrentPosition(async pos => {
                await this.setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                await this.syncAddressFromPosition();
                this.initialLocationLoaded = true;
            }, () => {
                this.initialLocationLoaded = true;
            });
        },
    },
});
</script>

<style scoped>
@import '../app/page.css';

.location-select-page {
    display: flex;
}

.map-container {
    flex-grow: 1;

    position: relative;
}

.details-card-container {
    position: absolute;
    top: 0;
    left: 0;

    box-sizing: border-box;
    width: 100%;
    padding: 16px;

    z-index: 1000;
}

.details-card {
    padding: 16px;
}

.point-fields {
    display: flex;
}

.point-fields .ui-textfield {
    flex-grow: 1;
}

.point-fields .ui-textfield:not(:last-child) {
    margin-right: 16px;
}

.ui-textfield:not(:last-child) {
    margin-bottom: 16px;
}
</style>
