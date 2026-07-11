const apiHost = process.env.EXPO_PUBLIC_API_URL || "192.168.1.8:5000";

const getBaseUrl = (host: string) => {
  return host.startsWith("http://") || host.startsWith("https://") ? host : `http://${host}`;
};

export const API_BASE_URL = getBaseUrl(apiHost);