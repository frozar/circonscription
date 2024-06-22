import { onMount, type Component } from "solid-js";

import styles from "./App.module.css";
import "leaflet/dist/leaflet.css";
import { map, latLng, tileLayer, MapOptions, geoJSON, Layer } from "leaflet";
import { GeoJsonObject } from "geojson";

async function initialiseMap() {
  const options: MapOptions = {
    center: latLng(-21.14695277642929, 55.53039550781251),
    zoom: 9,
  };

  const mymap = map("map", options);

  tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(mymap);

  const geoJson = await (
    await fetch("/circonscriptions_legislatives_030522.json")
  ).json();

  const myStyle = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.45,
  };

  const geoJsonLayer = geoJSON(geoJson.features as GeoJsonObject[], {
    style: myStyle,
  });

  geoJsonLayer.bindPopup(function (layer) {
    return <p>{layer.feature.properties.libelle}</p>;
  });

  geoJsonLayer.addTo(mymap);

  return mymap;
}

const App: Component = () => {
  onMount(async () => {
    const mymap = await initialiseMap();

    window.mymap = mymap;
  });

  return <div id="map" class={styles.map}></div>;
};

export default App;
