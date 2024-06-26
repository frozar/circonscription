import styles from "./Legende.module.css";
import { deputes, geoJsonLayer, mymap, regenerateColor } from "./App";
import { For, createEffect, createSignal } from "solid-js";
import { LegendType } from "./type";
import { findLayerDepute } from "./utils";

export const [circonscriptionLoadFinished, setCirconscriptionLoadFinished] =
  createSignal(false);

export const [legend, setLegend] = createSignal<LegendType>();
export const [legendEffective, setLegendEffective] = createSignal<LegendType>();

export function filterLegend() {
  // console.log("geoJsonLayer()", geoJsonLayer());
  const resFilteredLegend: LegendType = {};
  if (
    circonscriptionLoadFinished() &&
    geoJsonLayer() &&
    legend() &&
    deputes()
  ) {
    const mapBounds = mymap()!.getBounds();
    for (const layer of geoJsonLayer()!.getLayers()) {
      if (
        mapBounds.contains(layer.getBounds()) ||
        mapBounds.intersects(layer.getBounds())
      ) {
        // console.log("layer", layer);
        // console.log("layer.getBounds()", layer.getBounds());
        // console.log("mapBounds", mapBounds);
        // console.log(
        //   "mapBounds.contains",
        //   mapBounds.contains(layer.getBounds())
        // );
        // console.log(
        //   "mapBounds.intersects",
        //   mapBounds.intersects(layer.getBounds())
        // );

        const resDepute = findLayerDepute(layer.feature.properties, deputes()!);

        if (resDepute) {
          resFilteredLegend[resDepute.parti_ratt_financier] =
            legend()![resDepute.parti_ratt_financier];
        }
      }
    }
  }

  return resFilteredLegend;
}

// Setup legend filtered when circonscription are loaded
createEffect(() => {
  if (circonscriptionLoadFinished()) {
    setLegendEffective(filterLegend());
  }
});

createEffect(() => {
  // This line trigger the effect
  legendEffective();

  if (circonscriptionLoadFinished() && geoJsonLayer()) {
    geoJsonLayer()!.setStyle(function (feature) {
      const resDepute = findLayerDepute(feature?.properties, deputes()!);

      return resDepute
        ? { fillColor: legend()![resDepute.parti_ratt_financier] }
        : { fillColor: "#FFFFFF" };
    });
  }
});

export function Legend() {
  if (!legendEffective()) {
    return;
  }

  return (
    <div class={styles.legendContainer}>
      <div class={styles.legend}>
        <h4 class={styles.legendTitle}>Légende</h4>
        <div class={styles.legendItems}>
          <For each={Object.entries(legendEffective()!)}>
            {([parti, color]) => {
              return (
                <div class={styles.legendItem}>
                  <div>
                    <i
                      class={styles.legendSquare}
                      style={`background: ${color}`}
                    ></i>
                  </div>
                  <div>
                    <span class={styles.legendLabel}>{parti}</span>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
        <div class={styles.buttonRegenerateContainer}>
          <button
            class={styles.buttonRegenerate}
            onClick={() => {
              regenerateColor();
            }}
          >
            Regénérer
          </button>
        </div>
      </div>
    </div>
  );
}
