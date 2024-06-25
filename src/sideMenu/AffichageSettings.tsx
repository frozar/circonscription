import { GeoJSON, TileLayer } from "leaflet";
import { Geometry } from "geojson";

import styles from "./AffichageSettings.module.css";
import {
  DEFAULT_BACKGROUND_OPACITY,
  DEFAULT_CIRCONSCRIPTION_OPACITY,
} from "../constant";
import { Slider } from "./Slider";
import { legendDisplayed, setLegendDisplayed } from "../App";
import { createSignal } from "solid-js";

export function AffichageSettings({
  backgroundLayer,
  geoJsonLayer,
}: {
  backgroundLayer: TileLayer;
  geoJsonLayer: GeoJSON<any, Geometry>;
}) {
  // const [display] = createSignal(false)

  return (
    <div class={styles.controlRoot}>
      <h3>Affichage</h3>
      <div class={styles.controlSlider}>
        <p>Opacité fond de carte</p>
        <div class={styles.sliderContainer}>
          <Slider
            initialValue={DEFAULT_BACKGROUND_OPACITY}
            callback={(values) => {
              const value = +values[0];
              backgroundLayer.setOpacity(value);
            }}
          />
        </div>
      </div>
      <div class={styles.controlSlider}>
        <p>Opacité circonscription</p>
        <div class={styles.sliderContainer}>
          <Slider
            initialValue={DEFAULT_CIRCONSCRIPTION_OPACITY}
            callback={(values) => {
              const value = +values[0];
              geoJsonLayer.setStyle({
                fillOpacity: value,
              });
            }}
          />
        </div>
      </div>
      <div
        class={styles.controlCheckbox}
        onClick={() => {
          setLegendDisplayed((displayed) => {
            return !displayed;
          });
        }}
      >
        <input
          class={styles.legendCheckbox}
          type="checkbox"
          checked={legendDisplayed()}
        />
        <span class={styles.legendLabel}>Afficher la légende</span>
      </div>
    </div>
  );
}
