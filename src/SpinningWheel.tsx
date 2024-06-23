import style from "./SpinningWheel.module.css";
import logoAnimated from "./assets/logo-animated.svg";

export default function () {
  return (
    <div class={style.spinningWheelContainer}>
      <img src={logoAnimated} width="60px" />
    </div>
  );
}
