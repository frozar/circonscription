import { Show, onMount, type Component } from "solid-js";

import styles from "./App.module.css";
import "leaflet/dist/leaflet.css";
import { map, latLng, tileLayer, MapOptions, geoJSON, Map } from "leaflet";
import { GeoJsonObject } from "geojson";

// TODO: display legend on map
// TODO: add a handler on space stroke to recompute the legend colors

async function drawCirconscriptionArea(
  mymap: Map,
  legend: LegendType,
  deputes: DeputesType
) {
  const geoJson = await (
    await fetch("/circonscriptions_legislatives_030522.json")
  ).json();

  const geoJsonLayer = geoJSON(geoJson.features as GeoJsonObject[], {
    // style: myStyle,
    style: function (feature) {
      const resDepute = findLayerDepute(feature.properties, deputes);

      return {
        ...{
          weight: 5,
          // TODO: add a slider to ajust opacity
          opacity: 0.75,
        },
        ...(resDepute
          ? { color: legend[resDepute.parti_ratt_financier] }
          : { color: "#FFFFFF" }),
      };
    },
  });

  geoJsonLayer.addTo(mymap);

  return geoJsonLayer;
}

type PartiRattFinancierType = string;

type DeputeType = {
  num_deptmt: string;
  nom_circo: string;
  num_circo: number;
  mandat_debut: string;
  mandat_fin: string;
  groupe_sigle: string;
  parti_ratt_financier: PartiRattFinancierType;
  nom: string;
  profession: string;
};

type LegendType = { [key: PartiRattFinancierType]: string };

function generateRandomHexColor() {
  // Générer un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en hexadécimal)
  const randomColor = Math.floor(Math.random() * 16777215);
  // Convertir le nombre en chaîne hexadécimale et s'assurer qu'il y a toujours 6 caractères en ajoutant des zéros au besoin
  const hexColor = "#" + randomColor.toString(16).padStart(6, "0");
  return hexColor;
}

function findLayerDepute(
  featureProperties: { id_circo: string; dep: string },
  deputes: DeputesType
) {
  const { id_circo: layerIdCirco, dep: layerNumDep } = featureProperties;

  const layerNumCirco = +layerIdCirco.replace(layerNumDep, "");

  // console.log("layerIdCirco", layerIdCirco);
  // console.log("layerNumCirco", layerNumCirco);

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

  return resDepute;
}

function computeLegend(
  deputes: Array<{
    depute: DeputeType;
  }>
) {
  const partisPolitique: { [key: string]: number } = {};
  for (const depItem of deputes) {
    // console.log("depItem.depute", depItem.depute);
    const { parti_ratt_financier } = depItem.depute;
    // console.log("num_deptmt", num_deptmt);
    // console.log("num_circo", num_circo);

    partisPolitique[parti_ratt_financier] = partisPolitique[
      parti_ratt_financier
    ]
      ? partisPolitique[parti_ratt_financier] + 1
      : 1;
  }

  // console.log("partiPolitique", partisPolitique);

  const legend: LegendType = {};

  for (const partiPolitique of Object.keys(partisPolitique)) {
    const color = generateRandomHexColor();
    legend[partiPolitique] = color;
  }

  console.log("legend", legend);

  return legend;
}

type DeputesType = Array<{
  depute: DeputeType;
}>;

async function initialiseMap() {
  const options: MapOptions = {
    center: latLng(-21.14695277642929, 55.53039550781251),
    zoom: 9,
  };

  const mymap = map("map", options);

  tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    // TODO: add a slider to ajust opacity
    // opacity: 0.75,
  }).addTo(mymap);

  const data = (await (
    await fetch("/nosdeputes.fr_deputes_2024-06-22.json")
  ).json()) as {
    deputes: DeputesType;
  };

  // ["deputes"]
  const deputes = data.deputes.filter(
    (depItem) => depItem.depute.mandat_fin === "2024-06-09"
  );

  const legend = computeLegend(deputes);

  const geoJsonLayer = await drawCirconscriptionArea(mymap, legend, deputes);
  geoJsonLayer.bindPopup(function (layer) {
    const resDepute = findLayerDepute(layer.feature.properties, deputes);

    return (
      <div>
        <p>{layer.feature.properties.libelle}</p>
        <Show when={resDepute}>
          <p>{resDepute.nom}</p>
          <p>{resDepute.parti_ratt_financier}</p>
          // TODO: add link to depute website
        </Show>
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
