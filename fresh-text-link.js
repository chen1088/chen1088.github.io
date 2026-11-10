"use strict";

(() => {
  const link = document.getElementById("big-blue-button");
  if (!link) return;

  const VERSION = "mfg-poster-1-3-v1";
  const COUNT = 10;
  const STORAGE_KEY = "chenxu:mfg-prompts:" + VERSION;
  const files = Array.from({ length: COUNT }, (_, i) =>
    "prompts/mfg-" + String(i + 1).padStart(2, "0") + ".txt"
  );
  let memory = null;
  let useStorage = true;

  const clone = state => ({
    version: VERSION, remaining: state.remaining.slice(), last: state.last
  });

  const valid = state => {
    if (!state || state.version !== VERSION || !Array.isArray(state.remaining)) return false;
    const { remaining, last } = state;
    if (remaining.length > COUNT || new Set(remaining).size !== remaining.length) return false;
    if (!remaining.every(i => Number.isInteger(i) && i >= 0 && i < COUNT)) return false;
    if (last !== null && !(Number.isInteger(last) && last >= 0 && last < COUNT)) return false;
    if (last === null && remaining.length !== 0 && remaining.length !== COUNT) return false;
    if (remaining.length && remaining[0] === last) return false;
    return remaining.length === COUNT || !remaining.includes(last);
  };

  const read = () => {
    try {
      if (useStorage) {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (valid(saved)) return clone(saved);
      }
    } catch (_) { /* Private browsing or unavailable storage: use this page's memory. */ }
    return valid(memory) ? clone(memory) : { version: VERSION, remaining: [], last: null };
  };

  const remember = state => {
    memory = clone(state);
    try { if (useStorage) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { useStorage = false; }
  };

  const randomBelow = limit => {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const word = new Uint32Array(1);
      const cutoff = 0x100000000 - (0x100000000 % limit);
      do { crypto.getRandomValues(word); } while (word[0] >= cutoff);
      return word[0] % limit;
    }
    return Math.floor(Math.random() * limit);
  };

  const fill = state => {
    if (state.remaining.length) return;
    state.remaining = Array.from({ length: COUNT }, (_, i) => i);
    for (let i = COUNT - 1; i > 0; i--) {
      const j = randomBelow(i + 1);
      [state.remaining[i], state.remaining[j]] = [state.remaining[j], state.remaining[i]];
    }
    if (state.remaining[0] === state.last) {
      const j = 1 + randomBelow(COUNT - 1);
      [state.remaining[0], state.remaining[j]] = [state.remaining[j], state.remaining[0]];
    }
  };

  const setLink = index => {
    const url = new URL(files[index], document.baseURI);
    url.searchParams.set("v", VERSION + "-" + Date.now());
    link.href = url.href;
  };

  const next = () => {
    const state = read();
    fill(state);
    const index = state.remaining.shift();
    state.last = index;
    remember(state);
    setLink(index);
  };

  // Prepare a usable native link without consuming a prompt on page load.
  const initial = read();
  fill(initial);
  remember(initial);
  setLink(initial.remaining[0]);

  // Keep the browser's normal new-tab behavior; only update its destination.
  link.addEventListener("click", next);
  link.addEventListener("auxclick", event => { if (event.button === 1) next(); });
  link.addEventListener("contextmenu", next);
})();
