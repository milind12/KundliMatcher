import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onRegisterError(error) {
    console.warn("Service worker registration failed", error);
  }
});
