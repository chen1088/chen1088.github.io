"use strict";

(() => {
  const link = document.getElementById("big-blue-button");
  if (!link) return;

  const refreshLink = () => {
    const url = new URL(link.href);
    url.searchParams.set("v", String(Date.now()));
    link.href = url.href;
  };

  refreshLink();
  for (const eventName of ["click", "auxclick", "contextmenu"]) {
    link.addEventListener(eventName, refreshLink);
  }
})();
