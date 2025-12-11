export const qk = <T extends readonly unknown[]>(...parts: T) => parts satisfies T;

export const opt = <T>(v: null | T | undefined) => v ?? null;
