import { Accessor, Show } from "solid-js";
import SpinningWheel from "./SpinningWheel";
import styles from "./StatusBar.module.css";

export function StatusBar({ show }: { show: Accessor<boolean> }) {
  return (
    <Show when={show()}>
      <div class={styles.statusBarContainer}>
        <SpinningWheel />
        <div>Chargement des circonscriptions</div>
      </div>
    </Show>
  );
}
