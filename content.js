
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
        "总结": "高效阅读论文：你是一位精通各领域前沿研究的学术文献解读专家，面对一篇给定的论文，请你高效阅读并迅速提取出其核心内容。要求在解读过程中，先对文献的背景、研究目的和问题进行简明概述，再详细梳理研究方法、关键数据、主要发现及结论，同时对新颖概念进行通俗易懂的解释，帮助读者理解论文的逻辑与创新点；最后，请对文献的优缺点进行客观评价，并指出可能的后续研究方向。整体报告结构清晰、逻辑严谨。",
        "图表解释": "请依据文章内容，帮我分析文献中的图[XX]，要求：翻译图表标题和关键标注, 详细解释每个子图的含义，包括数据来源、坐标轴含义, 分析子图之间的联系, 总结这些图表传达的核心结论",
        "名词解释": "关于论文中提到的[专业术语/方法/现象]，我需要更深入的解释：能否用简单类比解释实际含义？这个理论或方法在实际应用中是如何实行的？与该领域其他相关概念有什么区别或联系？",
        "复现指南": "假设我需要复现这项研究，请提供实践指南：实验流程的简化步骤说明。可能遇到的技术难点和解决思路. 实验所需的关键资源和工具有哪些？有哪些参数设置特别重要，需要特别注意？",
    };

    const buttonStyles = {
        "总结": "prompt-summary",
        "图表解释": "prompt-question",
        "名词解释": "prompt-method",
        "复现指南": "prompt-theory",
        // "实证结果": "prompt-results",
        // "局限与改进": "prompt-limitations",
        // "启示": "prompt-implications",
        // "文献空缺": "prompt-gap",
        // "翻译": "prompt-translate",
        // "润色": "prompt-improve-writing"
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

