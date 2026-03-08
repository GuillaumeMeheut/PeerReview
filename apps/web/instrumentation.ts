// Polyfill __name for Cloudflare Workers compatibility.
// esbuild's --keep-names transform injects __name(fn, "name") calls that
// aren't defined in the Workers runtime.
if (typeof (globalThis as Record<string, unknown>).__name === "undefined") {
    (globalThis as Record<string, unknown>).__name = (fn: unknown) => fn;
}

export function register() {
    // Instrumentation registered
}
