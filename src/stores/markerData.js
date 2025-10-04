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
    async function mapInit(mapInstance) {
        // Ensure map is a ref and initialize if undefined
            if (!mapInstance || typeof mapInstance.value === 'undefined') {
            mapInstance = ref(null);
        }
        if (mapInstance.value) {
            mapInstance.value.remove();
        }
        mapInstance.value = leaflet.map('map', {
            maxBounds: [
                [41.303, -5.142], // Sud de la France
                [51.124, 9.560]   // Nord de la France
            ],
            maxBoundsViscosity: 1.0,
        }).setView(defaultPos, defaultZoom);

        leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstance.value);
    }

    /**
     * Add a marker to the map instance given in arguments
     * @param {*} mapInstance 
     * @param {*} lat 
     * @param {*} lng 
     * @param {*} popupText 
     * @returns result
     */
    async function addMarkerStore(mapInstance, lat, lng, popupText){
        if (!mapInstance || !mapInstance.value ) {
            throw new Error('Map is not initialized');
        } else if (lat === undefined || lat === null || lng === undefined || lng === null) {
            throw new SyntaxError("No lat nor lng value");
        }
        console.log('Adding a marker :\nLAT : '+lat+"\nLNG : "+lng);
        let result;
        result = await markerService.addMarker(mapInstance.value, lat, lng, popupText);
        if(result !== null){
            AllMarker.value.push(result);
            return result;
        }
        return result;
    }

    /**
     * Add the individual markers and chekc the synthax
     * from the JSON data given in argument.
     * @param {*} mapInstance 
     * @param {*} jsonData 
     */
    async function addMarkerFromJSONStore(mapInstance, jsonData) {
        if (mapInstance === undefined || mapInstance === null || mapInstance.value === undefined || mapInstance.value === null ) {
            throw new Error('Map is not initialized');
        } else if ( jsonData === undefined || jsonData === null ) {
            throw new Error('No JSON data');
        } else if (typeof jsonData === 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (e) {
                throw new SyntaxError('Invalid JSON string');
            }
        }
        
        const markersArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        markersArray.forEach(marker => {
            if (marker.lat === undefined || marker.lat === null){
                throw new SyntaxError("No lat value in marker JSON data");
            } else if(  marker.lng === undefined || marker.lng === null) {
                throw new SyntaxError("No lng value in marker JSON data");
            }
        });

        await markerService.addMarkerFromJSON(mapInstance.value, jsonData, AllMarker.value);

        AllMarker.value.forEach(marker => {
            marker.on('click', () => {
                marker.openPopup();
            });
        });
    }

    return { AllMarker, mapInit , addMarkerStore, addMarkerFromJSONStore};
})  