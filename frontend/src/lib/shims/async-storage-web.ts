"use client";

function ensureBrowser() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    throw new Error(
      "async-storage-web.ts: This shim must only be used in client-side code."
    );
  }
}

const AsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    ensureBrowser();
    return window.localStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    ensureBrowser();
    window.localStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    ensureBrowser();
    window.localStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    ensureBrowser();
    window.localStorage.clear();
  },
};

export default AsyncStorage;
