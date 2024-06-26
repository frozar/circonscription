import { Accessor, Show } from "solid-js";
import SpinningWheel from "./SpinningWheel";
import styles from "./StatusBar.module.css";

export function StatusBar({ message }: { message: Accessor<string> }) {
  return (
    <div class={styles.statusBarContainer}>
      <SpinningWheel />
      <div>{message()}</div>
    </div>
  );
}
