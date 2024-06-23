import { createSignal, onMount } from "solid-js";
import noUiSlider from "nouislider";
import { MenuBurger } from "./MenuBurger";

import styles from "./SideMenu.module.css";

import "nouislider/dist/nouislider.css";

export function SideMenu() {
  const [sideMenuOpened, setSideMenuOpened] = createSignal(true);

  onMount(() => {
    const slider = document.getElementById("slider-opacity-background");
    if (!slider) {
      console.error("Cannot found element with if 'slider-opacity-background'");
      return;
    }

    // console.log("slider", slider);
    noUiSlider.create(slider, {
      start: [80],
      range: {
        min: [0],
        max: [100],
      },
      orientation: "horizontal",

      // range: {
      //   // min: 0,
      //   // max: 1,
      //   min: 1300,
      //   max: 3250,
      // },

      // step: 150,

      // // Handles start at ...
      // start: [1450, 2050], //, 2350, 3000],

      // // ... must be at least 300 apart
      // margin: 300,

      // // ... but no more than 600
      // limit: 600,

      // // Display colored bars between handles
      // connect: true,

      // // Put '0' at the bottom of the slider
      // direction: "rtl",
      // orientation: "horizontal",

      // // Move handle on tap, bars are draggable
      // behaviour: "tap-drag",
      // tooltips: true,
      // // format: wNumb({
      // //   decimals: 0,
      // // }),

      // // Show a scale with the slider
      // pips: {
      //   mode: "steps",
      //   stepped: true,
      //   density: 4,
      // },
    });
  });

  return (
    <div class={styles.sideMenuRoot}>
      <div
        class={
          sideMenuOpened()
            ? styles.sideMenuContentOpened
            : styles.sideMenuContent
        }
      >
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

        <div class={styles.menuControlContainer}>
          <div class={styles.menuControlInner}>
            <h3>Controles</h3>
            <p>Opacité fond de carte</p>
            <div id="slider-opacity-background" />
            <p>Opacité circonscription</p>
          </div>
        </div>
      </div>
    </div>
  );
}
