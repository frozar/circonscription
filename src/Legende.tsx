import { Control } from "leaflet";

import styles from "./Legende.module.css";
import { LegendType } from "./App";
import { For } from "solid-js";

function legendHtml(legend: LegendType) {
  return (
    <div class={styles.legend}>
      <h4 class={styles.legendTitle}>Légende</h4>
      <For each={Object.entries(legend)}>
        {([parti, color]) => {
          // console.log("parti", parti);
          // console.log("color", color);
          return (
            <>
              <i class={styles.legendSquare} style={`background: ${color}`}></i>
              <span class={styles.legendLabel}>{parti}</span>
              <br />
            </>
          );
        }}
      </For>
    </div>
  ) as HTMLElement;
}

let legendDisplay: Control;

function addLegend(mymap: L.Map, legend: LegendType) {
  legendDisplay = new Control({ position: "topright" });

  // console.log("add legend", legend);

  legendDisplay.onAdd = function () {
    return legendHtml(legend);
  };

  legendDisplay.addTo(mymap);
}

export function removeLegend() {
  // console.log("legendDisplay", legendDisplay);
  if (legendDisplay) {
    legendDisplay.remove();
  }
}

export function updateLegend(mymap: L.Map, legend: LegendType) {
  // console.log("legendDisplay", legendDisplay);
  removeLegend();
  addLegend(mymap, legend);
}
