import { createSignal } from "solid-js";
import { MenuBurger } from "./MenuBurger";
import { GeoJSON, TileLayer } from "leaflet";
import { Geometry } from "geojson";
import { AffichageSettings } from "./AffichageSettings";

import styles from "./SideMenu.module.css";

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
              <AffichageSettings
                backgroundLayer={backgroundLayer}
                geoJsonLayer={geoJsonLayer}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
