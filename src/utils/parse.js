
/**
 * Tranforms a string to an Uint8Array
 * @param {String} base64UrlString Base64 URL String to be tranfsormed
 * @param {Boolean} isBase64Encoded Is the string base64 encoded
 */
export function base64StringToUint8Array(base64UrlString, isBase64Encoded = false) {
  const padding = "==".slice(0, (4 - (base64UrlString.length % 4)) % 4);
  const base64String = base64UrlString.replace(/-/g, "+").replace(/_/g, "/") + padding;

  const string = window.atob(base64String);

  return Uint8Array.from(string, c => c.charCodeAt(0));
}

export function arrayBufferToBase64String(arrayBuffer) {
  const characters = [];
  for (const char of new Uint8Array(arrayBuffer)) {
    characters.push(String.fromCharCode(char));
  }
  const base64String = window.btoa(characters.join(""));
  const base64UrlString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return base64UrlString;
}

export function parseCredential(credential) {
  return ({
    id: credential?.id,
    rawId: arrayBufferToBase64String(credential?.rawId),
    response: {
      attestationObject: arrayBufferToBase64String(credential?.response?.attestationObject),
      clientDataJSON: arrayBufferToBase64String(credential?.response?.clientDataJSON)
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    type: credential?.type
  });
}