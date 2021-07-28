const NOTIFICATION_ELEMENT_ID = "notification";
const NOTIFICATION_EXPIRATION = 5000;

export function setNotificationMessage(message, type, expires = true, context = document) {
  const element = context.getElementById(NOTIFICATION_ELEMENT_ID);
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
  if (expires) {
    const timeout = typeof expires === "number" ? expires : NOTIFICATION_EXPIRATION;
    setTimeout(clearNotificationMessage, timeout);
  }
}

export function clearNotificationMessage(context = document) {
  const element = context.getElementById(NOTIFICATION_ELEMENT_ID);
  if (!element) return;
  element.textContent = "";
}
