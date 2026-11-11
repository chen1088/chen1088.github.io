# Matrix filling prompt set: 50 variations

These fifty prompts follow the conversational example supplied by the website owner. Each introduces the same matrix filling question and asks the model to formulate the conjecture and prove or disprove it. The wording and length vary naturally. No solutions or later poster answers are included.

All versions keep the given bits fixed, forbid the same ordered diagonal rectangle on any two rows and columns, and start with at least one blank and no already-completed forbidden rectangle. Each blank initially allows both bits when checked against the original filled entries; this is an individual three-corner check, not a requirement that later choices remain unrestricted.

The filename identifies the variant. No variant ID or benchmark label is included in the text copied into a model. Record the filename together with the model/version and run settings when comparing results. `manifest.json` records the prompt-set version and each prompt hash.

The big blue button opens one text file in a new tab. It draws from a shuffled bag: each browser receives all fifty before the next cycle, and adjacent cycles do not repeat the same variant back-to-back. The state stays in browser storage. If storage is unavailable, the cycle is maintained for that page visit. Different visitors or browsers may receive the same variant; fifty versions do not guarantee global uniqueness. Opening the context menu counts as requesting a variant.

A versioned URL is refreshed on every activation to avoid old cached text. The original `the-big-blue-button.txt` address remains an alias containing variant 01.
