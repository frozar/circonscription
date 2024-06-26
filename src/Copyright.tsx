import logo from "./assets/logo-baseline.svg";

import styles from "./Copyright.module.css";

export function Copyright() {
  return (
    <div class={styles.copyrightContainer}>
      <a
        href="https://flaxib.re/"
        target="_blank"
        class={styles.copyrightInner}
      >
        <div class={styles.copyrightTitle}>
          Créé avec <span style="color: red">♥</span> par{" "}
        </div>
        <img width="90px" src={logo} />
      </a>
    </div>
  );
}
