const apiHost = process.env.EXPO_PUBLIC_API_URL || "localhost:5000";

const getBaseUrl = (host: string) => {
  return host.startsWith("http://") || host.startsWith("https://") ? host : `http://${host}`;
};

export const API_BASE_URL = getBaseUrl(apiHost);