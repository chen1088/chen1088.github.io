"use strict";

(() => {
  // Keep addresses out of the initial page; reveal only the requested address.
  const addressCodes = {
    "school": [
        99,
        104,
        101,
        110,
        120,
        117,
        64,
        98,
        117,
        102,
        102,
        97,
        108,
        111,
        46,
        101,
        100,
        117
    ],
    "backup": [
        99,
        104,
        101,
        110,
        120,
        117,
        49,
        48,
        56,
        56,
        64,
        103,
        109,
        97,
        105,
        108,
        46,
        99,
        111,
        109
    ]
};

  document.querySelectorAll(".email-reveal").forEach((button) => {
    // Pages cached before data-email was added contain only the school address.
    const key = button.getAttribute("data-email") ?? "school";
    const codes = addressCodes[key];
    if (!Array.isArray(codes)) return;

    button.hidden = false;
    button.addEventListener("click", () => {
      const address = String.fromCharCode(...codes);
      const link = document.createElement("a");
      link.href = "mail" + "to:" + address;
      link.textContent = address;
      const wasFocused = document.activeElement === button;
      button.replaceWith(link);
      if (wasFocused) link.focus();
    }, { once: true });
  });
})();
