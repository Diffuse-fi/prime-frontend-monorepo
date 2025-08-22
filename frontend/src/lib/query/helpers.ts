export const qk = <T extends readonly unknown[]>(...parts: T) => parts satisfies T;

export const opt = <T>(v: T | undefined | null) => v ?? null;
