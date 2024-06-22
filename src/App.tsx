import { Show, onMount, type Component } from "solid-js";

import styles from "./App.module.css";
import "leaflet/dist/leaflet.css";
import {
  map,
  latLng,
  tileLayer,
  MapOptions,
  geoJSON,
  Layer,
  Map,
} from "leaflet";
import { GeoJsonObject } from "geojson";

async function drawCirconscriptionArea(mymap: Map) {
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

  // geoJsonLayer.bindPopup(function (layer) {
  //   return <p>{layer.feature.properties.libelle}</p>;
  // });

  geoJsonLayer.addTo(mymap);

  return geoJsonLayer;
}

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

  const data = (await (
    await fetch("/nosdeputes.fr_deputes_2024-06-22.json")
  ).json()) as {
    deputes: Array<{
      depute: {
        num_deptmt: string;
        nom_circo: string;
        num_circo: number;
        mandat_debut: string;
        mandat_fin: string;
        groupe_sigle: string;
        parti_ratt_financier: string;
        nom: string;
        profession: string;
      };
    }>;
  };

  // ["deputes"]
  const deputes = data.deputes.filter(
    (depItem) => depItem.depute.mandat_fin === "2024-06-09"
  );
  // console.log("deputes", deputes);
  console.log("deputes[0]", deputes[0]);

  for (const depItem of deputes.slice(0, 1)) {
    console.log("depItem.depute", depItem.depute);
    const { num_deptmt, num_circo } = depItem.depute;
    console.log("num_deptmt", num_deptmt);
    console.log("num_circo", num_circo);
  }

  const geoJsonLayer = await drawCirconscriptionArea(mymap);
  geoJsonLayer.bindPopup(function (layer) {
    // const numberPattern = /\d+/g;

    // const num_circonscription = 'something102asdfkj1948948'.match( numberPattern )
    const { id_circo: layerIdCirco, dep: layerNumDep } =
      layer.feature.properties;

    const layerNumCirco = +layerIdCirco.replace(layerNumDep, "");

    console.log("layerIdCirco", layerIdCirco);
    console.log("layerNumCirco", layerNumCirco);

    let resDepute;
    for (const depItem of deputes) {
      // console.log("depItem.depute", depItem.depute);
      const { num_deptmt, num_circo } = depItem.depute;
      // console.log("num_deptmt", num_deptmt);
      // console.log("num_circo", num_circo);
      if (num_deptmt === layerNumDep && num_circo === layerNumCirco) {
        console.log("res", depItem.depute);
        resDepute = depItem.depute;
        break;
      }
    }

    console.log("resDepute", resDepute);
    console.log("resDepute.nom", resDepute.nom);

    return (
      <div>
        <p>{layer.feature.properties.libelle}</p>
        <Show when={resDepute}>
          <p>{resDepute.nom}</p>
        </Show>
        {/* {resDepute?.nom && (
          <div>
            <p>{resDepute.nom}</p>
          </div>
        )} */}
      </div>
    );
  });
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
