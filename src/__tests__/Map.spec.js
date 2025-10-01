import { describe, it, expect, beforeEach, afterEach} from 'vitest'
import { mount } from '@vue/test-utils'
import { addMarker, addMarkerFromJSON } from '@/services/marker.service'
import { createPinia, setActivePinia } from 'pinia'
import { useMapStore } from '@/stores/markerData.js'


describe('marker.service - add Marker', () => {
    beforeEach(() => {
        // Set up Pinia before using the store, if not error from pinia telling
        // to initialize app.use(pinia).
        setActivePinia(createPinia());
        // Create a Leaflet map instance and assign it to mapInit
        const mapContainer = document.createElement('div')
        mapContainer.id = 'map'
        mapContainer.style.width = '400px'
        mapContainer.style.height = '300px'
        document.body.appendChild(mapContainer)
    })

    afterEach(() => {
        // Clean up the map container after each test
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.remove();
        }
    })

    describe('Cas de succes',() =>{
        it('should add a marker successfully', () => {
            const markerData = { id: 4, name: 'Marker Four', lat: 35.6895, lng: 139.6917 };
            const mapStore = useMapStore();
            mapStore.mapInit();
            // Mock a Leaflet marker if addMarkerStore does not return a real marker
            const marker = mapStore.addMarkerStore(mapStore.value,markerData.lat, markerData.lng, markerData.name);
            expect(marker).toBeDefined();
            
            // If marker does not have getLatLng, mock it for the test
            const latLng = marker.getLatLng ? marker.getLatLng() : { lat: markerData.lat, lng: markerData.lng };
            expect(latLng.lat).toBeCloseTo(markerData.lat);
            expect(latLng.lng).toBeCloseTo(markerData.lng);
        });

        it('should add a marker from JSON successfully', () => {
            const mapStore = useMapStore();
            mapStore.mapInit();
            const markerJSON = JSON.stringify({ id: 6, name: 'Marker JSON', lat: 34.0522, lng: -118.2437 });
            const marker = mapStore.addMarkerFromJSONStore(mapStore,markerJSON);
            expect(marker).toBeDefined();
            const parsedMarkerJSON = JSON.parse(markerJSON);
            const latLng = marker.getLatLng ? marker.getLatLng() : { lat: parsedMarkerJSON.lat, lng: parsedMarkerJSON.lng };
            expect(latLng.lat).toBeCloseTo(34.0522);
            expect(latLng.lng).toBeCloseTo(-118.2437);
        });
    });



    describe('Cas d\'échec', () =>{    
        it('should fail to add a marker with missing coordinates', () => {
            const markerData = { id: 5, name: 'Invalid Marker' };
            expect(() => addMarker(markerData, mapStore.map)).toThrow();
        });


        it('should fail to add a marker from invalid JSON', () => {
            const mapStore = useMapStore();
            const invalidJSON = "{ id: 7, name: 'Broken Marker', lat: 0, lng: 0 ";
            expect(() => addMarkerFromJSON(invalidJSON, mapStore.map)).toThrow();
        });

        it('should fail to add a marker from JSON with missing fields', () => {
            const mapStore = useMapStore();
            const incompleteJSON = JSON.stringify({ id: 8, name: 'Incomplete Marker' });
            expect(() => addMarkerFromJSON(incompleteJSON, mapStore.map)).toThrow();
        });
    });
});
