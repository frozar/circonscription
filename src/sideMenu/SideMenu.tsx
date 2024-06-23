import { createSignal } from "solid-js";
import styles from "./SideMenu.module.css";
import { MenuBurger } from "./MenuBurger";

export function SideMenu() {
  const [sideMenuOpened, setSideMenuOpened] = createSignal(false);

  return (
    <div
      class={styles.menuBurgerContainer}
      onClick={() => {
        setSideMenuOpened((opened: boolean) => !opened);
      }}
    >
      <MenuBurger sideMenuOpened={sideMenuOpened} />
    </div>
  );
}
