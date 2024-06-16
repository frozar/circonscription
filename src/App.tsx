import { onMount, type Component } from "solid-js";

import styles from "./App.module.css";
import "leaflet/dist/leaflet.css";
import { map, latLng, tileLayer, MapOptions, geoJSON } from "leaflet";

const App: Component = () => {
  onMount(async () => {
    console.log("On mount");

    const options: MapOptions = {
      center: latLng(-21.14695277642929, 55.53039550781251),
      zoom: 11,
    };

    const mymap = map("map", options);

    window.mymap = mymap;

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(mymap);

    const geoJson = await (
      await fetch(
        "http://localhost:3000/circonscriptions_legislatives_030522.json"
      )
    ).json();

    console.log(geoJson);

    const myStyle = {
      color: "#ff7800",
      weight: 5,
      opacity: 0.45,
    };

    geoJSON(geoJson.features, {
      style: myStyle,
    }).addTo(mymap);
  });

  return <div id="map" class={styles.map}></div>;
};

export default App;
