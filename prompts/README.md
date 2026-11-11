# Matrix filling prompt set, v2

These ten prompts follow the conversational example supplied by the website owner. Each introduces the matrix filling problem, explains immediate forcing through three already-filled corners, and asks whether having at least one blank and no initially forced blanks guarantees a completion. They invite the model to formulate the conjecture and prove or disprove it. The narration varies; the displayed ordered pattern and the question stay the same. No solutions or later poster answers are included.

The filename identifies the variant. No variant ID or benchmark label is included in the text copied into a model. Record the filename together with the model/version and run settings when comparing results. `manifest.json` records the prompt-set version and each prompt hash.

The big blue button opens one text file in a new tab. It draws from a shuffled bag: each browser receives all ten before the next cycle, and adjacent cycles do not repeat the same variant back-to-back. The state stays in browser storage. If storage is unavailable, the cycle is maintained for that page visit. Different visitors or browsers may receive the same variant; ten versions do not guarantee global uniqueness. Opening the context menu counts as requesting a variant.

A versioned URL is refreshed on every activation to avoid old cached text. The original `the-big-blue-button.txt` address remains an alias containing variant 01.
