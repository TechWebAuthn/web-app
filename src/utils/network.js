export async function request(url, options = {}) {
  try {
    const mergedOptions = {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    const response = await fetch(url, mergedOptions);
    const parsedResponse = await response.json();

    if (response.status >= 400) {
      const error = new Error(parsedResponse.message);
      error.name = "RequestError";
      error.data = parsedResponse || {};
      throw error;
    }

    return parsedResponse;
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
