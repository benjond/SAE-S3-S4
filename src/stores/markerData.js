import { ref, getCurrentInstance, onMounted, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import markerService from '@/services/marker.service'
import * as leaflet from 'leaflet'
import "leaflet/dist/leaflet.css";


export const useMapStore = defineStore('map', () => {
    
    const defaultPos = [47.6427015, 6.8394333];
    const defaultZoom = 6;
    const AllMarker = ref([]);

    /**
     * Main Application of the map nedeed
     * to initialize the application
     */
    async function mapInit(map) {
        console.log("Starting map..");
        // Ensure map is a ref and initialize if undefined
        if (!map || typeof map.value === 'undefined') {
            map = ref(null);
        }
        if (map.value) {
            map.value.remove();
        }
        map.value = leaflet.map('map', {
            maxBounds: [
                [41.303, -5.142], // Sud de la France
                [51.124, 9.560]   // Nord de la France
            ],
            maxBoundsViscosity: 1.0,
        }).setView(defaultPos, defaultZoom);

        leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.value);
    }

    /**
     * Add a marker to the global map
     * @param {*} lat 
     * @param {*} lng 
     * @param {*} popupText 
     * @returns 
     */
    async function addMarkerStore(mapInstance, lat, lng, popupText){
        if (!mapInstance || !mapInstance.value) {
            console.warn('Map is not initialized');
            return;
        }
        console.log('Adding a marker :\nLAT : '+lat+"\nLNG : "+lng);
        const result = markerService.addMarker(mapInstance.value, lat, lng, popupText);
        if(result !== null){
            AllMarker.value.push(result);
            return result;
        }
        return result;
    }

    async function addMarkerFromJSONStore(mapInstance, jsonData) {
        if (!mapInstance.value) {
            console.warn('Map is not initialized');
            return;
        }
        markerService.addMarkerFromJSON(mapInstance.value , jsonData , AllMarker.value);
        AllMarker.value.forEach(marker => {
            marker.on('click', () => {
                marker.openPopup();
            });
        });
    }

    return { AllMarker, mapInit , addMarkerStore, addMarkerFromJSONStore};
})