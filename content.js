(function() {
    // --- Prompts Definition ---
    const prompts = {
        "总结": "请用300字以内的学术语言总结该论文的核心观点、研究方法、主要发现与结论。中文回答：",
        "研究问题": "请概述该论文试图解决的具体研究问题或假设，并说明其学术价值。中文回答：",
        "研究方法": "请批判性地描述该论文采用的研究设计、方法与数据来源，包括其可靠性与局限性。中文回答：",
        "理论贡献": "请分析该论文在理论上的贡献及其与现有文献的关系。中文回答：",
        "实证结果": "请总结该论文的关键实证结果及其统计显著性。中文回答：",
        "局限与改进": "请指出该研究的主要局限，并提出未来研究可能的改进方向。中文回答：",
        "启示": "请讨论该研究对学术界或实践领域的潜在启示与应用价值。中文回答：",
        "文献空缺": "请分析该论文试图填补的文献空缺，并评估其有效性。中文回答：",
    };

    const buttonStyles = {
        "总结": "prompt-summary",
        "研究问题": "prompt-question",
        "研究方法": "prompt-method",
        "理论贡献": "prompt-theory",
        "实证结果": "prompt-results",
        "局限与改进": "prompt-limitations",
        "启示": "prompt-implications",
        "文献空缺": "prompt-gap",
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
