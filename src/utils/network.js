const BroadcastChannels = {};

export async function request(url, options = {}) {
  try {
    const mergedOptions = {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    const response = await fetch(url, mergedOptions);

    if (response.status > 500) {
      throw new Error("Server is not responding");
    }

    if (response.status >= 400) {
      const parsedResponse = await response.json();
      const error = new Error(parsedResponse.message);
      error.name = "RequestError";
      error.data = parsedResponse || {};
      error.code = response.status;
      throw error;
    }

    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  } catch (error) {
    throw new Error(getStatusErrorMessage(error));
  }
}

export function getStatusErrorMessage(error) {
  const status = error?.data?.status;

  if (!status) return error.message;

  switch (status) {
    case "USERNAME_TAKEN":
      return "Username is already taken";
    case "TOKEN_INVALID":
      return "Token is invalid";
    default:
      return "Something went wrong";
  }
}

export function connectToBroadcastChannel(channelName = "app") {
  if ("BroadcastChannel" in window) {
    const channel = BroadcastChannels[channelName] || new BroadcastChannel(channelName);

    if (!BroadcastChannels[channelName]) {
      BroadcastChannels[channelName] = channel;
    }

    return channel;
  } else {
    return null;
  }
}
