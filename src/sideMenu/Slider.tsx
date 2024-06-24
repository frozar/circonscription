import { onMount } from "solid-js";

import noUiSlider, { API } from "nouislider";

import "nouislider/dist/nouislider.css";
import styles from "./Slider.module.css";

type EventCallback = (
  this: API,
  values: (number | string)[],
  handleNumber: number,
  unencoded: number[],
  tap: boolean,
  locations: number[],
  slider: API
) => void;

function instanciateSlider(htmlElement: HTMLElement, initialValue: number) {
  noUiSlider.create(htmlElement, {
    start: [initialValue],
    range: {
      min: [0],
      max: [1],
    },
    orientation: "horizontal",
  });
}

export function Slider({
  initialValue,
  callback,
}: {
  initialValue: number;
  callback: EventCallback;
}) {
  let ref!: HTMLDivElement & {
    noUiSlider?: API;
  };

  onMount(() => {
    instanciateSlider(ref, initialValue);
    ref.noUiSlider?.on("update.one", callback);
  });

  return (
    <div class={styles.sliderContainer}>
      <div ref={ref} class={styles.slider} />
    </div>
  );
}
