import { Accessor, Show } from "solid-js";
import SpinningWheel from "./SpinningWheel";
import styles from "./StatusBar.module.css";

export function StatusBar({
  show,
  message,
}: {
  show: Accessor<boolean>;
  message: Accessor<string>;
}) {
  return (
    <Show when={show()}>
      <div class={styles.statusBarContainer}>
        <SpinningWheel />
        <div>{message()}</div>
      </div>
    </Show>
  );
}
