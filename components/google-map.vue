<template>
  <v-row>
    <v-col cols="12">
      <div id="map" :style="{ width: '100%', height: '400px' }"></div>
    </v-col>
  </v-row>
</template>

<script setup>
import { Loader } from "@googlemaps/js-api-loader";
import { useRuntimeConfig } from "#app";
import { onMounted } from "vue";

const config = useRuntimeConfig();
const apiKey = config.public.googleMapsApiKey;

onMounted(async () => {
  const loader = new Loader({
    apiKey,
    version: "weekly",
  });

  await loader.load();

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const location = { lat: 50.93350462219232, lng: 12.903691355181687 };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: location, // Center the map on the location
    zoom: 10, // Adjust zoom level
    mapId: "DEMO_MAP_ID",
  });

  // Add a marker with title and address
  const marker = new AdvancedMarkerElement({
    position: location, // Set marker at the location
    map, // Attach the marker to the map
    title: "Water castle Klaffenbach", // Marker title
  });

  // Optional: Add an info window to show the address on marker click
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div>
        <strong>Wasserschloßweg 6,</strong><br>
        09123 Chemnitz, Germany
        <a href="https://maps.app.goo.gl/WytXRTHj6r7rZaoZ7" target="_blank">Open</a>
      </div>
    `,
  });

  // Show the info window when the marker is clicked
  marker.addListener("click", () => {
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
