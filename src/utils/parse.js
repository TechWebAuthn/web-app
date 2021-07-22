export function base64UrlStringToUint8Array(base64UrlString) {
  const padding = "==".slice(0, (4 - (base64UrlString.length % 4)) % 4);
  const base64String = base64UrlString.replace(/-/g, "+").replace(/_/g, "/") + padding;

  const string = window.atob(base64String);

  return Uint8Array.from(string, (c) => c.charCodeAt(0));
}

export function arrayBufferToBase64UrlString(arrayBuffer) {
  const characters = [];
  for (const char of new Uint8Array(arrayBuffer)) {
    characters.push(String.fromCharCode(char));
  }
  const base64String = window.btoa(characters.join(""));
  const base64UrlString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return base64UrlString;
}

export function parseRegisterCredential(credential) {
  return {
    id: credential.id,
    rawId: arrayBufferToBase64UrlString(credential.rawId),
    response: {
      attestationObject: arrayBufferToBase64UrlString(credential.response.attestationObject),
      clientDataJSON: arrayBufferToBase64UrlString(credential.response.clientDataJSON),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    type: credential.type,
  };
}

export function parseLoginCredential(credential) {
  return {
    id: credential.id,
    rawId: arrayBufferToBase64UrlString(credential.rawId),
    response: {
      authenticatorData: arrayBufferToBase64UrlString(credential.response.authenticatorData),
      clientDataJSON: arrayBufferToBase64UrlString(credential.response.clientDataJSON),
      signature: arrayBufferToBase64UrlString(credential.response.signature),
      userHandle: arrayBufferToBase64UrlString(credential.response.userHandle),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    type: credential.type,
  };
}
