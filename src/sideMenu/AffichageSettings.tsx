import { GeoJSON, TileLayer } from "leaflet";
import { Geometry } from "geojson";

import styles from "./AffichageSettings.module.css";
import {
  DEFAULT_BACKGROUND_OPACITY,
  DEFAULT_CIRCONSCRIPTION_OPACITY,
} from "../constant";
import { Slider } from "./Slider";
import { setLegendDisplayed } from "../App";

export function AffichageSettings({
  backgroundLayer,
  geoJsonLayer,
}: {
  backgroundLayer: TileLayer;
  geoJsonLayer: GeoJSON<any, Geometry>;
}) {
  return (
    <>
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
      <div class={styles.controlSlider}>
        <input
          type="checkbox"
          onChange={(event) => {
            setLegendDisplayed(event.target.checked);
          }}
        />
        <span class={styles.legendLabel}>Affiché la légende</span>
      </div>
    </>
  );
}
