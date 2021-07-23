const NOTIFICATION_ELEMENT_ID = "notification";

export function setNotificationMessage(message, type, context = document) {
  const element = context.getElementById(NOTIFICATION_ELEMENT_ID);
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

export function clearNotificationMessage(context = document) {
  const element = context.getElementById(NOTIFICATION_ELEMENT_ID);
  if (!element) return;
  element.textContent = "";
}
