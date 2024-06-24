import {
  Show,
  createEffect,
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
import { DEFAULT_CIRCONSCRIPTION_OPACITY } from "./constant";
import { updateLegend } from "./Legende";

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

export type LegendType = { [key: PartiRattFinancierType]: string };

type LayerIdCircoType = string;

type DeputesType = Array<{
  depute: DeputeType;
}>;

const [displaySpinningWheel, setDisplaySpinningWheel] = createSignal(true);
const [backgroundLayer, setBackgroundLayer] = createSignal<TileLayer>();
const [geoJsonLayer, setGeoJsonLayer] = createSignal<GeoJSON<any, Geometry>>();
const [legend, setLegend] = createSignal<LegendType>();
const [deputes, setDeputes] = createSignal<DeputesType>();
const [mymap, setMymap] = createSignal<L.Map>();

// Bind area color to new color when the legend update
createEffect(() => {
  if (legend() && mymap()) {
    updateLegend(mymap()!, legend()!);
  }
});

createEffect(() => {
  // This line trigger the effect
  legend();

  if (geoJsonLayer()) {
    geoJsonLayer()!.setStyle(function (feature) {
      const resDepute = findLayerDepute(feature?.properties, deputes()!);

      return resDepute
        ? { fillColor: legend()![resDepute.parti_ratt_financier] }
        : { fillColor: "#FFFFFF" };
    });
  }
});

// TODO: display legend on map
// TODO: use the localstorage to store the legend

async function drawCirconscriptionArea(
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
            // TODO: add a slider to ajust opacity
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
    .on("end", function () {
      console.timeEnd("Retrieve circonscription");
      setDisplaySpinningWheel(false);
    });

  geoJsonLayer()?.addTo(mymap);
}

function generateRandomHexColor() {
  // Générer un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en hexadécimal)
  const randomColor = Math.floor(Math.random() * 16777215);
  // Convertir le nombre en chaîne hexadécimale et s'assurer qu'il y a toujours 6 caractères en ajoutant des zéros au besoin
  const hexColor = "#" + randomColor.toString(16).padStart(6, "0");
  return hexColor;
}

const layerToDepute: { [key: LayerIdCircoType]: DeputeType } = {};

function findLayerDepute(
  featureProperties: { id_circo: string; dep: string },
  deputes: DeputesType
) {
  const { id_circo: layerIdCirco, dep: layerNumDep } = featureProperties;

  const layerNumCirco = +layerIdCirco.replace(layerNumDep, "");

  const candidateDepute = layerToDepute[layerIdCirco];

  if (candidateDepute) {
    return candidateDepute;
  } else {
    let resDepute;
    for (const depItem of deputes) {
      // console.log("depItem.depute", depItem.depute);
      const { num_deptmt, num_circo } = depItem.depute;
      // console.log("num_deptmt", num_deptmt);
      // console.log("num_circo", num_circo);
      if (num_deptmt === layerNumDep && num_circo === layerNumCirco) {
        // console.log("res", depItem.depute);
        resDepute = depItem.depute;
        layerToDepute[layerIdCirco] = resDepute;
        break;
      }
    }

    return resDepute;
  }
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

  // ["deputes"]
  const deputes = data.deputes.filter(
    (depItem) => depItem.depute.mandat_fin === "2024-06-09"
  );
  setDeputes(deputes);

  const legendWk = computeLegend(deputes);
  setLegend(legendWk);

  await drawCirconscriptionArea(mymap, legendWk, deputes);
  geoJsonLayer()?.bindPopup(function (layer) {
    const resDepute = findLayerDepute(layer.feature.properties, deputes);

    // TODO: add link to depute website
    return (
      <div>
        <p>{layer.feature.properties.libelle}</p>
        <Show when={resDepute}>
          <p>{resDepute.nom}</p>
          <p>{resDepute.parti_ratt_financier}</p>
        </Show>
      </div>
    );
  });
  return mymap;
}

function keyStrokeHandler(event: KeyboardEvent) {
  const code = event.code;
  if (code === "Space") {
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
}

const App: Component = () => {
  onMount(async () => {
    const mymap = await initialiseMap();

    window.mymap = mymap;

    document.addEventListener("keypress", keyStrokeHandler);
  });

  onCleanup(() => {
    document.removeEventListener("keypress", keyStrokeHandler);
  });

  return (
    <div>
      <div id="map" class={styles.map} />
      <Show when={backgroundLayer() && geoJsonLayer()}>
        <SideMenu
          backgroundLayer={backgroundLayer()!}
          geoJsonLayer={geoJsonLayer()!}
        />
      </Show>
      <StatusBar show={displaySpinningWheel} />
    </div>
  );
};

export default App;
