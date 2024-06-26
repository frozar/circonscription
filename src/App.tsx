// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

import {
  Show,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";

import "leaflet/dist/leaflet.css";
import L, {
  map,
  latLng,
  tileLayer,
  MapOptions,
  geoJSON,
  GeoJSON,
  Map,
  TileLayer,
} from "leaflet";
import { GeoJsonObject, Geometry } from "geojson";
import leafletStream from "leaflet-geojson-stream";
import { StatusBar } from "./StatusBar";
import { SideMenu } from "./sideMenu/SideMenu";

import styles from "./App.module.css";
import {
  DEFAULT_CIRCONSCRIPTION_OPACITY,
  NB_CIRCONSCRIPTION,
} from "./constant";
import {
  Legend,
  filterLegend,
  setCirconscriptionLoadFinished,
  setLegend,
  setLegendEffective,
} from "./Legende";
import { DeputeType, DeputesType, LegendType } from "./type";
import { findLayerDepute } from "./utils";
import { Copyright } from "./Copyright";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSH5rtsfvNzAfowzjiPYdZbcvlnDR48fY",
  authDomain: "circonscription-19b33.firebaseapp.com",
  projectId: "circonscription-19b33",
  storageBucket: "circonscription-19b33.appspot.com",
  messagingSenderId: "309952758105",
  appId: "1:309952758105:web:20d28c4d6c807b1f19cc48",
  measurementId: "G-11W0V2BB4F",
};

const [displaySpinningWheel, setDisplaySpinningWheel] = createSignal(true);
const [backgroundLayer, setBackgroundLayer] = createSignal<TileLayer>();
export const [geoJsonLayer, setGeoJsonLayer] =
  createSignal<GeoJSON<any, Geometry>>();

export const [deputes, setDeputes] = createSignal<DeputesType>();
export const [mymap, setMymap] = createSignal<L.Map>();
export const [displayLegend, setDisplayLegend] = createSignal(false);

const [nbCirconscriptionLoaded, setNbCirconscriptionLoaded] = createSignal(0);

function drawCirconscriptionArea(
  mymap: Map,
  legend: LegendType,
  deputes: DeputesType
) {
  setGeoJsonLayer(
    geoJSON([] as GeoJsonObject[], {
      style: function (feature) {
        const resDepute = findLayerDepute(feature?.properties, deputes);

        return {
          ...{
            weight: 2,
            opacity: 0.75,
            color: "white",
            dashArray: "10",
            fillOpacity: DEFAULT_CIRCONSCRIPTION_OPACITY,
          },
          ...(resDepute
            ? { fillColor: legend[resDepute.parti_ratt_financier] }
            : { fillColor: "#FFFFFF" }),
        };
      },
    })
  );

  setDisplaySpinningWheel(true);
  console.time("Retrieve circonscription");
  leafletStream
    .ajax("/circonscriptions_legislatives_030522.json", geoJsonLayer())
    .on("data", function () {
      setNbCirconscriptionLoaded(
        (currentCirconscriptionLoaded) => currentCirconscriptionLoaded + 1
      );
    })
    .on("end", function () {
      console.timeEnd("Retrieve circonscription");
      setDisplaySpinningWheel(false);
      setCirconscriptionLoadFinished(true);
    });

  // console.log("geoJsonLayer()", geoJsonLayer());

  geoJsonLayer()?.addTo(mymap);
}

function generateRandomHexColor() {
  // Générer un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en hexadécimal)
  const randomColor = Math.floor(Math.random() * 16777215);
  // Convertir le nombre en chaîne hexadécimale et s'assurer qu'il y a toujours 6 caractères en ajoutant des zéros au besoin
  const hexColor = "#" + randomColor.toString(16).padStart(6, "0");
  return hexColor;
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

  // console.log("legend", legend);

  return legend;
}

async function initialiseMap() {
  const options: MapOptions = {
    center: latLng(-21.14695277642929, 55.53039550781251),
    zoom: 9,
    zoomControl: false,
    wheelPxPerZoomLevel: 600,
  };

  const mymap = map("map", options);
  setMymap(mymap);

  setBackgroundLayer(
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(mymap)
  );

  const data = (await (
    await fetch("/nosdeputes.fr_deputes_2024-06-22.json")
  ).json()) as {
    deputes: DeputesType;
  };

  const deputes = data.deputes.filter(
    (depItem) => depItem.depute.mandat_fin === "2024-06-09"
  );
  setDeputes(deputes);

  const legendWk = computeLegend(deputes);
  setLegend(legendWk);

  // Draw circonscription area
  drawCirconscriptionArea(mymap, legendWk, deputes);

  // Setup popup
  geoJsonLayer()?.bindPopup(function (layer) {
    const resDepute = findLayerDepute(layer.feature.properties, deputes);

    return (
      <div>
        <p class={styles.popupParagraphe}>{layer.feature.properties.libelle}</p>
        <Show when={resDepute}>
          {/* <p class={styles.popupParagrapheMention}>Ancien député</p> */}
          <p class={styles.popupParagraphe}>
            <span class={styles.popupParagrapheMention}>Ancien député :</span>{" "}
            <span>{resDepute.nom}</span>
          </p>
          <p class={styles.popupParagraphe}>
            <span class={styles.popupParagrapheMention}>Parti politique :</span>{" "}
            <span>{resDepute.parti_ratt_financier}</span>
          </p>
        </Show>
      </div>
    );
  });

  mymap.on("zoomend", () => {
    setLegendEffective(filterLegend());
  });

  mymap.on("moveend", () => {
    setLegendEffective(filterLegend());
  });

  return mymap;
}

export function regenerateColor() {
  setLegend((currentLegend) => {
    if (!currentLegend) {
      return {};
    }
    const res: LegendType = {};
    for (const parti of Object.keys(currentLegend)) {
      res[parti] = generateRandomHexColor();
    }
    return res;
  });
}

function keyStrokeHandler(event: KeyboardEvent) {
  const code = event.code;
  if (code === "Space") {
    regenerateColor();
  }
}

const App: Component = () => {
  onMount(async () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Analytics and get a reference to the service
    const analytics = getAnalytics(app);
    logEvent(analytics, "application_mounted");

    const mymap = await initialiseMap();

    window.mymap = mymap;

    document.addEventListener("keypress", keyStrokeHandler);
  });

  onCleanup(() => {
    document.removeEventListener("keypress", keyStrokeHandler);
  });

  const statusBarMessage = () =>
    `${nbCirconscriptionLoaded()}/${NB_CIRCONSCRIPTION} circonscription`;

  return (
    <div>
      <div id="map" class={styles.map} />
      <Show when={backgroundLayer() && geoJsonLayer()}>
        <SideMenu
          backgroundLayer={backgroundLayer()!}
          geoJsonLayer={geoJsonLayer()!}
        />
      </Show>
      <Show when={displaySpinningWheel()}>
        <StatusBar message={statusBarMessage} />
      </Show>
      <Show when={displayLegend()}>
        <Legend />
      </Show>
      <Copyright />
    </div>
  );
};

export default App;
