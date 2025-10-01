import * as leaflet from 'leaflet'

/**
 * Create a marker from a Leaflet map instance with its latitude,
 * longitude and a popup text
 * @param {leaflet.Map} mapInstance - Leaflet map instance
 * @param {*} lat 
 * @param {*} lng 
 * @param {*} popupText 
 * @returns a marker added to the map.
 */
function addMarker(mapInstance, lat, lng, popupText){
    let Icon = leaflet.icon({
        iconUrl : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const marker = leaflet.marker(
        [parseFloat(lat),parseFloat(lng)],
        { icon: Icon }
    ).addTo(mapInstance);
    if(popupText) {
        marker.bindPopup(popupText);
    }
    return marker;
}

/**
 * Adding all the markers stored in a JSON file
 * into an array of all the markers
 * @param {leaflet.Map} mapInstance 
 * @param {*} markerJSONArray 
 * @param {*} markerTotalArray 
 */
function addMarkerFromJSON(mapInstance, markerJSONArray, markerTotalArray){
        markerJSONArray.forEach( item => {
        if( item.lat && item.lng) {
            console.log("ID : "+item.id+"\nLAT : "+item.lat+"\nLNG : "+item.lng+"\nPOPUPTEXT : "+item.popupText);
            const marker = addMarker(mapInstance , item.lat, item.lng, item.popupText);
            markerTotalArray.push(marker);
            marker.on('click',() => marker.openPopup());
        }
    });
}

export default {
    addMarker,
    addMarkerFromJSON
}