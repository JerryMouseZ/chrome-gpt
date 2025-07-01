# Academic Prompts for Gemini

This is a Chrome extension that adds a floating button with preset academic prompts to the Gemini website (`gemini.google.com`). This helps streamline academic research and writing tasks.

## Features

- **Floating, Collapsible UI:** A clean, unobtrusive button that expands to show a panel of prompts.
- **Preset Prompts:** A set of predefined prompts for common academic tasks like summarizing, translating, and improving writing.
- **Context-Aware:** Automatically appends any selected text on the page to the chosen prompt.
- **Modern UI:** A beautiful and modern interface that integrates well with the Gemini website.

## How to Install

1.  **Download the files:** Make sure you have all the files from this project (`manifest.json`, `content.js`, `styles.css`, `icon.png`) in a single folder.
2.  **Get an Icon:** You will need a 48x48 pixel icon named `icon.png` in the same folder. You can create your own or find one online.
3.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
4.  **Enable Developer Mode:** In the top right corner, turn on the "Developer mode" toggle.
5.  **Load Unpacked:** Click the "Load unpacked" button that appears on the top left.
6.  **Select the Folder:** In the file dialog, select the folder where you saved the extension files.
7.  **Done!** The extension should now be installed. Navigate to [gemini.google.com](https://gemini.google.com) to see the floating button at the bottom right of the page.

## Customization

You can customize the prompts by editing the `prompts` object at the top of the `content.js` file.
