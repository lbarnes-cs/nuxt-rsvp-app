<template>
  <v-row>
    <v-col cols="12">
      <div id="map" :style="{ width: '100%', height: '400px' }" />
    </v-col>
  </v-row>
</template>

<script setup>
  import { Loader } from '@googlemaps/js-api-loader';
  import { useRuntimeConfig } from '#app';
  import { onMounted } from 'vue';
  import { eventInfo } from '@/constants/event';

  const config = useRuntimeConfig();
  const apiKey = config.public.googleMapsApiKey;

  onMounted(async () => {
    const loader = new Loader({
      apiKey, // Google Maps API key
      version: 'weekly',
    });

    await loader.load();

    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    // Initialize the map centered on the provided location
    const location = { ...eventInfo.address.coordinates };

    const map = new google.maps.Map(document.getElementById('map'), {
      center: location, // Center the map on the location
      zoom: 10, // Adjust zoom level
      mapId: 'DEMO_MAP_ID',
    });

    // Add a marker with title and address
    const marker = new AdvancedMarkerElement({
      position: location, // Set marker at the location
      map, // Attach the marker to the map
      title: eventInfo.venueName, // Marker title
    });

    // Optional: Add an info window to show the address on marker click
    const infoWindow = new google.maps.InfoWindow({
      content: `
      <div>
        <strong>${eventInfo.venueName}</strong><br>
       ${eventInfo.address.fullAddress}
        <a href="${eventInfo.address.googleMapUrl}" target="_blank">Open</a>
      </div>
    `,
    });

    // Show the info window when the marker is clicked
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
</script>

<style>
  /* Optional: Adjust map container styles */
  #map {
    width: 100%;
    height: 400px;
  }
</style>
