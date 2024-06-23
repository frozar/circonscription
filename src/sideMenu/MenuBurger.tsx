import { Accessor } from "solid-js";
import styles from "./MenuBurger.module.css";

export function MenuBurger({
  sideMenuOpened,
}: {
  sideMenuOpened: Accessor<boolean>;
}) {
  return (
    <svg id="hamburger" viewBox="0 0 60 40">
      <g
        stroke="#fff"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          id={styles.topLine}
          class={sideMenuOpened() ? styles.topLineClose : ""}
          d="M10,10 L50,10 Z"
        ></path>
        <path
          id={styles.middleLine}
          class={sideMenuOpened() ? styles.middleLineClose : ""}
          d="M10,20 L50,20 Z"
        ></path>
        <path
          id={styles.bottomLine}
          class={sideMenuOpened() ? styles.bottomLineClose : ""}
          d="M10,30 L50,30 Z"
        ></path>
      </g>
    </svg>
  );
}
