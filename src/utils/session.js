import { Router } from "@vaadin/router";

export function isLoggedIn() {
  return window.localStorage.getItem("session") !== null;
}

export async function logout(event) {
  event.preventDefault();

  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
  Router.go("/");
  window.dispatchEvent(new CustomEvent("session-changed", { detail: { isLoggedIn: false } }));
  window.localStorage.removeItem("session");
}

export function setSession(object) {
  Router.go("/dashboard");
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
