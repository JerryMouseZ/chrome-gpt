
(function() {
    // --- Site-specific Configurations ---
    const siteConfigs = {
        "gemini.google.com": {
            inputSelector: 'div.ql-editor p',
            waitForSelector: 'div.ql-editor p'
        },
        "aistudio.google.com": {
            inputSelector: 'textarea, div[contenteditable="true"], div.ql-editor p, input[type="text"], [data-testid*="input"], [placeholder*="prompt"]',
            waitForSelector: 'textarea, div[contenteditable="true"], div.ql-editor p, input[type="text"], [data-testid*="input"], [placeholder*="prompt"]'
        },
        "chatgpt.com": {
            inputSelector: '#prompt-textarea',
            waitForSelector: '#prompt-textarea'
        },
        "claude.ai": {
            inputSelector: 'div[contenteditable="true"], textarea, input[type="text"], [data-testid*="input"], [placeholder*="message"], [role="textbox"]',
            waitForSelector: 'div[contenteditable="true"], textarea, input[type="text"], [data-testid*="input"], [placeholder*="message"], [role="textbox"]'
        },
        "www.blackbox.ai": {
            inputSelector: 'textarea, div[contenteditable="true"], input[type="text"]',
            waitForSelector: 'textarea, div[contenteditable="true"], input[type="text"]'
        },
        "blackbox.ai": {
            inputSelector: 'textarea, div[contenteditable="true"], input[type="text"]',
            waitForSelector: 'textarea, div[contenteditable="true"], input[type="text"]'
        },
        "grok.com": {
            inputSelector: 'textarea, div[contenteditable="true"], input[type="text"]',
            waitForSelector: 'textarea, div[contenteditable="true"], input[type="text"]'
        },
        "x.com": {
            inputSelector: 'textarea, div[contenteditable="true"], input[type="text"]',
            waitForSelector: 'textarea, div[contenteditable="true"], input[type="text"]'
        },
        "twitter.com": {
            inputSelector: 'textarea, div[contenteditable="true"], input[type="text"]',
            waitForSelector: 'textarea, div[contenteditable="true"], input[type="text"]'
        }
    };

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

    let currentSiteConfig = null;

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
        if (!currentSiteConfig) {
            console.error("Academic Prompts: No site configuration found.");
            return;
        }

        const inputElement = document.querySelector(currentSiteConfig.inputSelector);

        if (inputElement) {
            const selectedText = window.getSelection().toString();
            const fullText = text + selectedText;

            // Clear the input first and focus
            inputElement.focus();
            
            // Try different methods to set the value for better React compatibility
            if (inputElement.tagName.toLowerCase() === 'textarea' || inputElement.tagName.toLowerCase() === 'input') {
                // For textarea and input elements
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value') ||
                                              Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
                
                if (nativeInputValueSetter && nativeInputValueSetter.set) {
                    nativeInputValueSetter.set.call(inputElement, fullText);
                } else {
                    inputElement.value = fullText;
                }
            } else if (inputElement.contentEditable === 'true' || inputElement.getAttribute('contenteditable') === 'true') {
                // For contenteditable elements
                inputElement.innerHTML = '';
                inputElement.textContent = fullText;
                
                // Try to set the cursor at the end
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(inputElement);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // Fallback
                inputElement.textContent = fullText;
            }

            // Dispatch multiple events to ensure the site detects the change
            const events = ['input', 'change', 'keyup', 'keydown', 'focus', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                inputElement.dispatchEvent(event);
            });
            
            // Additional React-specific events
            const reactEvents = ['onChange', 'onInput'];
            reactEvents.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                inputElement.dispatchEvent(event);
            });
            
            // Additional event for contenteditable elements
            if (inputElement.contentEditable === 'true' || inputElement.getAttribute('contenteditable') === 'true') {
                const textEvent = new Event('textInput', { bubbles: true, cancelable: true });
                inputElement.dispatchEvent(textEvent);
            }
            
            // Keep focus on the input
            inputElement.focus();
            
            console.log(`Academic Prompts: Successfully inserted text into ${inputElement.tagName} element`);
        } else {
            console.error(`Academic Prompts: Could not find the input field with selector: ${currentSiteConfig.inputSelector}`);
            
            // Try to find any input-like element as fallback
            const fallbackSelectors = [
                'textarea',
                'input[type="text"]',
                'div[contenteditable="true"]',
                '[role="textbox"]',
                '[data-testid*="text"]',
                '[placeholder*="message"]',
                '[placeholder*="ask"]',
                '[placeholder*="chat"]'
            ];
            
            let fallbackElement = null;
            for (const selector of fallbackSelectors) {
                fallbackElement = document.querySelector(selector);
                if (fallbackElement) {
                    console.log(`Academic Prompts: Found fallback element with selector: ${selector}`);
                    break;
                }
            }
            
            if (fallbackElement) {
                // Try to use the fallback element
                fallbackElement.focus();
                if (fallbackElement.tagName.toLowerCase() === 'textarea' || fallbackElement.tagName.toLowerCase() === 'input') {
                    fallbackElement.value = text + window.getSelection().toString();
                } else {
                    fallbackElement.textContent = text + window.getSelection().toString();
                }
                
                const event = new Event('input', { bubbles: true, cancelable: true });
                fallbackElement.dispatchEvent(event);
                fallbackElement.focus();
            } else {
                alert("Could not find the text input field on the page. The site structure may have changed.");
            }
        }
    }

    // --- Initialization ---
    function init() {
        const { toggleButton, panel } = createUI();
        setupEventListeners(toggleButton, panel);
    }

    // --- Site Detection and Initialization ---
    function detectSiteAndInit() {
        const hostname = window.location.hostname;
        
        // First try exact match, then try includes for compatibility
        currentSiteConfig = siteConfigs[hostname];
        
        if (!currentSiteConfig) {
            for (const site in siteConfigs) {
                if (hostname.includes(site)) {
                    currentSiteConfig = siteConfigs[site];
                    break;
                }
            }
        }

        if (currentSiteConfig) {
            console.log(`Academic Prompts: Detected site: ${hostname}, waiting for selector: ${currentSiteConfig.waitForSelector}`);
            
            let initAttempts = 0;
            const maxAttempts = 3;
            
            const tryInit = () => {
                const targetNode = document.querySelector(currentSiteConfig.waitForSelector);
                if (targetNode) {
                    console.log(`Academic Prompts: Found target element, initializing UI`);
                    init();
                    return true;
                }
                return false;
            };
            
            // Try to initialize immediately if element already exists
            if (tryInit()) {
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                if (tryInit()) {
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Set up a timeout with retry mechanism
            const retryInit = () => {
                initAttempts++;
                console.log(`Academic Prompts: Retry attempt ${initAttempts}/${maxAttempts}`);
                
                if (tryInit()) {
                    observer.disconnect();
                    return;
                }
                
                if (initAttempts < maxAttempts) {
                    setTimeout(retryInit, 2000); // Wait 2 seconds before next retry
                } else {
                    console.log(`Academic Prompts: Failed to find target element after ${maxAttempts} attempts`);
                    observer.disconnect();
                }
            };
            
            // First retry after 3 seconds
            setTimeout(retryInit, 3000);
        } else {
            console.log(`Academic Prompts: No configuration found for hostname: ${hostname}`);
        }
    }

    detectSiteAndInit();

})();

