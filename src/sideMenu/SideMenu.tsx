import { createSignal, onMount } from "solid-js";
import noUiSlider, { API } from "nouislider";
import { MenuBurger } from "./MenuBurger";
import { GeoJSON, TileLayer } from "leaflet";
import { GeoJsonObject, Geometry } from "geojson";

import "nouislider/dist/nouislider.css";
import styles from "./SideMenu.module.css";
import {
  DEFAULT_BACKGROUND_OPACITY,
  DEFAULT_CIRCONSCRIPTION_OPACITY,
} from "../constant";

type SliderElement = HTMLElement & { noUiSlider: API };

function instanciateSlider(htmlId: string, initialValue: number) {
  const slider = document.getElementById(htmlId) as SliderElement | null;

  if (!slider) {
    console.error(`Cannot found element with id ${htmlId}`);
    return;
  }

  noUiSlider.create(slider, {
    start: [initialValue],
    range: {
      min: [0],
      max: [1],
    },
    orientation: "horizontal",
  });

  return slider;
}

export function SideMenu({
  backgroundLayer,
  geoJsonLayer,
}: {
  backgroundLayer: TileLayer;
  geoJsonLayer: GeoJSON<any, Geometry>;
}) {
  const [sideMenuOpened, setSideMenuOpened] = createSignal(true);

  onMount(() => {
    const backgroundOpacitySliderId = "background-opacity-slider";
    const backgroundOpacitySlider = instanciateSlider(
      backgroundOpacitySliderId,
      DEFAULT_BACKGROUND_OPACITY
    );
    backgroundOpacitySlider?.noUiSlider.on("update.one", function (values) {
      const value = +values[0];
      backgroundLayer.setOpacity(value);
    });

    const circonscriptionOpacitySliderId = "circonscription-opacity-slider";
    const circonscriptionOpacitySlider = instanciateSlider(
      circonscriptionOpacitySliderId,
      DEFAULT_CIRCONSCRIPTION_OPACITY
    );
    circonscriptionOpacitySlider?.noUiSlider.on(
      "update.one",
      function (values) {
        const value = +values[0];
        geoJsonLayer.setStyle({
          fillOpacity: value,
        });
        // backgroundLayer.setOpacity(value);
      }
    );
  });

  return (
    <div class={styles.sideMenuRoot}>
      <div class={sideMenuOpened() ? styles.sideMenuOpened : styles.sideMenu}>
        <div
          class={
            sideMenuOpened()
              ? styles.menuBurgerContainerOpened
              : styles.menuBurgerContainer
          }
          onClick={() => {
            setSideMenuOpened((opened: boolean) => !opened);
          }}
        >
          <MenuBurger sideMenuOpened={sideMenuOpened} />
        </div>

        <div class={styles.menuContentContainer}>
          <div class={styles.menuContentInner}>
            <div class={styles.menuControlContainer}>
              <h3>Controles</h3>
              <div class={styles.controlSlider}>
                <p>Opacité fond de carte</p>
                <div class={styles.sliderContainer}>
                  <div id="background-opacity-slider" class={styles.slider} />
                </div>
              </div>
              <div class={styles.controlSlider}>
                <p>Opacité circonscription</p>
                <div class={styles.sliderContainer}>
                  <div
                    id="circonscription-opacity-slider"
                    class={styles.slider}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
