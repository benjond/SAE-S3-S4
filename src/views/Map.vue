<template>
    <body>
        <h1>Map</h1>
        <div id="map"></div>
    </body>
</template>
<script setup>
    import { useMapStore } from '@/stores/markerData';
    import markerData from '@/datasource/marker.json'
    import { onMounted, ref } from 'vue';
    const map = ref(null); // Creation of the ID
    const lat = ref('');
    const lng = ref('');
    const popupText = ref('');
    const mapStore = useMapStore();
    onMounted(() => {
        mapStore.mapInit(map);
        mapStore.addMarkerFromJSONStore(map,markerData);
    });
</script>
<style scoped>
    #map{
        height: 650px;
        width: 100%;
        margin : 0 auto;
    }
</style>