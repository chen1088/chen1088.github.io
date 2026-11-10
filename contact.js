"use strict";

// Keep the address out of the initial page and reveal it only on request.
document.querySelectorAll(".email-reveal").forEach((button) => {
  button.hidden = false;
  button.addEventListener("click", () => {
    const address = String.fromCharCode(
      99, 104, 101, 110, 120, 117, 64, 98, 117, 102,
      102, 97, 108, 111, 46, 101, 100, 117
    );
    const link = document.createElement("a");
    link.href = "mail" + "to:" + address;
    link.textContent = address;
    const wasFocused = document.activeElement === button;
    button.replaceWith(link);
    if (wasFocused) link.focus();
  }, { once: true });
});
