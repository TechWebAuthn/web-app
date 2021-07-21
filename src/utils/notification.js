export function setNotificationMessage(element, message, type) {
    element.textContent = message;
    element.dataset.type = type;
}

export function clearNotificationMessage(element) {
  element.textContent = '';
}