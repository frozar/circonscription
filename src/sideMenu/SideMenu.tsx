import { createSignal } from "solid-js";
import { MenuBurger } from "./MenuBurger";
import { GeoJSON, TileLayer } from "leaflet";
import { Geometry } from "geojson";

import "nouislider/dist/nouislider.css";
import styles from "./SideMenu.module.css";
import {
  DEFAULT_BACKGROUND_OPACITY,
  DEFAULT_CIRCONSCRIPTION_OPACITY,
} from "../constant";
import { Slider } from "./Slider";

export function SideMenu({
  backgroundLayer,
  geoJsonLayer,
}: {
  backgroundLayer: TileLayer;
  geoJsonLayer: GeoJSON<any, Geometry>;
}) {
  const [sideMenuOpened, setSideMenuOpened] = createSignal(true);

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
