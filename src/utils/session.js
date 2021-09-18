import { Router } from "@vaadin/router";
import { request } from "./network";

export function isLoggedIn() {
  return window.localStorage.getItem("session") !== null;
}

export async function logout(event) {
  if (event) event.preventDefault();

  await request("/api/logout", {
    method: "POST",
  });
  Router.go("/");
  window.dispatchEvent(new CustomEvent("session-changed", { detail: { isLoggedIn: false } }));
  window.localStorage.removeItem("session");
}

export function setSession(object) {
  Router.go(window.location.pathname);
  window.dispatchEvent(new CustomEvent("session-changed", { detail: { isLoggedIn: true } }));
  window.localStorage.setItem("session", JSON.stringify(object));
}

export function getSession() {
  try {
    return JSON.parse(window.localStorage.getItem("session") || "{}");
  } catch {
    return {};
  }
}

export async function hasValidSession() {
  try {
    const me = await request("/api/me");
    setSession(me);
    return true;
  } catch (error) {
    await logout();
    return false;
  }
}
