(function() {
    // --- Prompts Definition ---
    const prompts = {
        "总结": "请用300字总结以下论文的关键发现。请用中文回答: ",
        "主题": "这篇论文的主要主题和研究问题是什么？请用中文回答: ",
        "背景": "请提供这篇论文的研究背景和上下文。请用中文回答: ",
        "创新": "这项工作的主要创新或贡献是什么？请用中文回答: ",
        "挑战": "这篇论文中提到的主要挑战或局限性是什么？请用中文回答: ",
        "展望": "这项研究的未来前景或潜在应用是什么？请用中文回答: ",
        "翻译": "将以下摘要翻译成中文: ",
        "润色": "请帮我改进以下段落的写作，使其更清晰、简洁，并符合学术语气。请用中文回答: "
    };

    const buttonStyles = {
        "总结": "prompt-summary",
        "主题": "prompt-topic",
        "背景": "prompt-background",
        "创新": "prompt-innovations",
        "挑战": "prompt-challenges",
        "展望": "prompt-outlook",
        "翻译": "prompt-translate",
        "润色": "prompt-improve-writing"
    };

    // --- UI Creation ---
    function createUI() {
        const container = document.createElement('div');
        container.id = 'academic-prompts-container';

        const toggleButton = document.createElement('button');
        toggleButton.id = 'academic-prompts-toggle';
        toggleButton.textContent = '学';

        const panel = document.createElement('div');
        panel.id = 'academic-prompts-panel';

        Object.entries(prompts).forEach(([label, promptText]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.className = 'prompt-button';
            button.classList.add(buttonStyles[label] || 'prompt-default');
            button.dataset.prompt = promptText;
            panel.appendChild(button);
        });

        container.appendChild(toggleButton);
        container.appendChild(panel);
        document.body.appendChild(container);

        return { container, toggleButton, panel };
    }

    // --- Event Handling ---
    function setupEventListeners(toggleButton, panel) {
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
        });

        panel.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.classList.contains('prompt-button')) {
                const prompt = e.target.dataset.prompt;
                insertPrompt(prompt);
                panel.style.display = 'none';
            }
        });

        document.addEventListener('click', () => {
            if (panel.style.display === 'flex') {
                panel.style.display = 'none';
            }
        });
    }

    // --- Prompt Insertion Logic ---
    function insertPrompt(text) {
        // This selector is for Gemini's rich text editor.
        // It might change if Google updates their site.
        const inputElement = document.querySelector('div.ql-editor p');

        if (inputElement) {
            const selectedText = window.getSelection().toString();
            const fullText = text + selectedText;

            inputElement.textContent = fullText;

            const event = new Event('input', { bubbles: true, cancelable: true });
            inputElement.dispatchEvent(event);
            
            inputElement.focus();
        } else {
            console.error("Academic Prompts: Could not find Gemini's input field.");
            alert("Could not find the text input field on the page. The site structure may have changed.");
        }
    }

    // --- Initialization ---
    function init() {
        const { toggleButton, panel } = createUI();
        setupEventListeners(toggleButton, panel);
    }
    
    // The Gemini interface loads dynamically, so we can't just run on window.load.
    // We'll use a MutationObserver to wait for the input field to appear.
    const observer = new MutationObserver((mutations, obs) => {
        const inputField = document.querySelector('div.ql-editor p');
        if (inputField) {
            // Found the target, initialize the UI
            init();
            // Disconnect the observer once we're done
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
