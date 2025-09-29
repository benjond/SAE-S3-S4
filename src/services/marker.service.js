import MarkerSource from '@/datasource/marker.json';
import * as leaflet from 'leaflet'

/**
 * Create a marker from a mapInstante with his latitude,
 * longitude and a popup text
 * @param {*} mapInstance 
 * @param {*} lat 
 * @param {*} lng 
 * @param {*} popupText 
 * @returns a marker added to the maps.
 */
function addMarker(mapInstance, lat, lng, popupText){
    // Creation of the Icon of the marker
    const Icon = leaflet.icon({
        iconUrl : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const marker = leaflet.marker([lat,lng], { icon : Icon }).addTo(mapInstance);
    if(popupText) {
        marker.bindPopup(popupText);
    }
    return marker;
}

/**
 * Adding all the markers stored in a JSON file
 * into an array of all the markers
 * @param {*} mapInstance 
 * @param {*} markerJSONArray 
 * @param {*} markerTotalArray 
 */
function addMarkerFromJSON(mapInstance, markerJSONArray, markerTotalArray){
    if(mapInstance == null || markerJSONArray == null || markerTotalArray == null) return;
    if(!Array.isArray(markerJSONArray)) return;
    if(!Array.isArray(markerTotalArray)) return;
    markerJSONArray.forEach( item => {
        if( item.lat && item.lng) {
            const marker = addMarker(mapInstance , item.lat, item.lng, item.popupText);
            markerTotalArray.push(marker);
            marker.on('click',() => marker.openPopup());
        }
    });
}
