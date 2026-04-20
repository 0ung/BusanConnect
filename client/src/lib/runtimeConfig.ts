type RuntimeConfigKey =
  | "VITE_FRONTEND_FORGE_API_KEY"
  | "VITE_FRONTEND_FORGE_API_URL";

type RuntimeConfig = Partial<Record<RuntimeConfigKey, string>>;

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

const buildTimeConfig: RuntimeConfig = {
  VITE_FRONTEND_FORGE_API_KEY: import.meta.env.VITE_FRONTEND_FORGE_API_KEY,
  VITE_FRONTEND_FORGE_API_URL: import.meta.env.VITE_FRONTEND_FORGE_API_URL,
};

function getRuntimeConfig(): RuntimeConfig {
  if (typeof window === "undefined") {
    return {};
  }

  return window.__APP_CONFIG__ ?? {};
}

function readConfigValue(key: RuntimeConfigKey) {
  const runtimeValue = getRuntimeConfig()[key];
  if (typeof runtimeValue === "string" && runtimeValue.length > 0) {
    return runtimeValue;
  }

  return buildTimeConfig[key];
}

export function getForgeApiKey() {
  return readConfigValue("VITE_FRONTEND_FORGE_API_KEY") ?? "";
}

export function getForgeApiBaseUrl() {
  return readConfigValue("VITE_FRONTEND_FORGE_API_URL") ?? "https://forge.butterfly-effect.dev";
}
