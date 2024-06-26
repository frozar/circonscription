import styles from "./Legende.module.css";
import { LegendType, regenerateColor } from "./App";
import { Accessor, For } from "solid-js";

export function Legend({
  legend,
}: {
  legend: Accessor<LegendType | undefined>;
}) {
  if (!legend()) {
    return;
  }

  return (
    <div class={styles.legendContainer}>
      <div class={styles.legend}>
        <h4 class={styles.legendTitle}>Légende</h4>
        <div class={styles.legendItems}>
          <For each={Object.entries(legend()!)}>
            {([parti, color]) => {
              // console.log("parti", parti);
              // console.log("color", color);
              return (
                <div class={styles.legendItem}>
                  <div>
                    <i
                      class={styles.legendSquare}
                      style={`background: ${color}`}
                    ></i>
                  </div>
                  <div>
                    <span class={styles.legendLabel}>{parti}</span>
                    {/* <br /> */}
                  </div>
                </div>
              );
            }}
          </For>
        </div>
        <div class={styles.buttonRegenerateContainer}>
          <button
            class={styles.buttonRegenerate}
            onClick={() => {
              regenerateColor();
            }}
          >
            Regénérer
          </button>
        </div>
      </div>
    </div>
  );
}
