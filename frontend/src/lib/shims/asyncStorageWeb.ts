"use client";

function ensureBrowser() {
  if (globalThis.window === undefined || typeof localStorage === "undefined") {
    throw new TypeError(
      "async-storage-web.ts: This shim must only be used in client-side code."
    );
  }
}

const AsyncStorage = {
  async clear(): Promise<void> {
    ensureBrowser();
    globalThis.localStorage.clear();
  },

  async getItem(key: string): Promise<null | string> {
    ensureBrowser();
    return globalThis.localStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    ensureBrowser();
    globalThis.localStorage.removeItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    ensureBrowser();
    globalThis.localStorage.setItem(key, value);
  },
};

export default AsyncStorage;
