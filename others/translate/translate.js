/**
 * 实时翻译功能
 * 实现输入实时翻译功能
 */

// 全局翻译API服务（通过script标签引入）
// TranslateAPI, GoogleTranslateAPI, LocalTranslate 将在全局作用域中可用

const TranslateApp = {
    // 元素引用
    elements: {
        sourceText: null,
        translatedText: null,
        sourceLanguage: null,
        targetLanguage: null,
        swapButton: null,
        clearSource: null,
        copySource: null,
        copyTranslation: null,
        speakTranslation: null,
        statusIndicator: null,
        statusText: null,
        apiStatusDiv: null,
        apiConfigModal: null,
        modalClose: null,
        apiConfigTabs: null,
        apiServiceConfigs: null,
        currentServiceSelect: null,
        saveApiConfigBtn: null,
        cancelApiConfigBtn: null
    },

    // 当前使用的翻译服务
    currentService: 'baidu', // 默认使用百度翻译

    // 所有支持的翻译服务
    translateServices: {
        baidu: TranslateAPI,
        google: GoogleTranslateAPI,
        local: LocalTranslate
    },

    // 翻译延迟计时器
    translateTimer: null,

    // 上次翻译的文本
    lastTranslatedText: '',

    // 上次使用的语言对
    lastLanguagePair: '',

    // 语音合成器
    speechSynthesis: window.speechSynthesis,

    // API状态
    apiStatus: 'online',

    // 初始化应用
    init() {
        this.initElements();
        this.initEventListeners();
        this.loadApiConfig();
        this.loadPreferences();

        // 检查API状态
        this.checkApiStatus();

        // 显示欢迎消息
        this.elements.translatedText.value = 'Bitte geben Sie den zu übersetzenden Text auf der linken Seite ein. Die Übersetzung wird in Echtzeit angezeigt...';

        // 初始化API配置对话框
        this.initApiConfigModal();
    },

    // 初始化API配置对话框
    initApiConfigModal() {
        // 点击API状态指示器打开配置对话框
        if (this.elements.apiStatusDiv) {
            this.elements.apiStatusDiv.addEventListener('click', () => {
                this.openApiConfigModal();
            });
        } else {
            console.warn('API-Statusindikator-Element nicht gefunden');
        }

        // 关闭对话框
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => {
                this.closeApiConfigModal();
            });
        } else {
            console.warn('Schließen-Button-Element des Dialogs nicht gefunden');
        }

        // 点击对话框外部关闭对话框
        window.addEventListener('click', (event) => {
            if (this.elements.apiConfigModal && event.target === this.elements.apiConfigModal) {
                this.closeApiConfigModal();
            }
        });

        // 切换API配置选项卡
        if (this.elements.apiConfigTabs && this.elements.apiConfigTabs.forEach) {
            this.elements.apiConfigTabs.forEach(tab => {
                if (tab && tab.dataset) {
                    tab.addEventListener('click', () => {
                        this.switchApiConfigTab(tab.dataset.tab);
                    });
                }
            });
        } else {
            console.warn('API-Konfigurationstab-Element nicht gefunden');
        }

        // 保存API配置
        if (this.elements.saveApiConfigBtn) {
            this.elements.saveApiConfigBtn.addEventListener('click', () => {
                this.saveAllApiConfig();
            });
        } else {
            console.warn('Button zum Speichern der API-Konfiguration nicht gefunden');
        }

        // 取消API配置
        if (this.elements.cancelApiConfigBtn) {
            this.elements.cancelApiConfigBtn.addEventListener('click', () => {
                this.closeApiConfigModal();
            });
        } else {
            console.warn('Button zum Abbrechen der API-Konfiguration nicht gefunden');
        }

        // 填充当前配置到表单
        this.fillApiConfigForm();
    },

    // 加载API配置
    loadApiConfig() {
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig'));
            if (apiConfig) {
                // 设置当前服务
                if (apiConfig.service) {
                    this.currentService = apiConfig.service;
                    if (apiConfig.service === 'baidu' || apiConfig.service === 'youdao') {
                        TranslateAPI.setService(apiConfig.service);
                    }
                }

                // 设置百度翻译API密钥
                if (apiConfig.baidu && apiConfig.baidu.appId && apiConfig.baidu.secretKey) {
                    TranslateAPI.setApiKey('baidu', apiConfig.baidu.appId, apiConfig.baidu.secretKey);
                }

                // 设置有道翻译API密钥
                if (apiConfig.youdao && apiConfig.youdao.appId && apiConfig.youdao.secretKey) {
                    TranslateAPI.setApiKey('youdao', apiConfig.youdao.appId, apiConfig.youdao.secretKey);
                }

                // 设置Google翻译API密钥
                if (apiConfig.google && apiConfig.google.apiKey) {
                    GoogleTranslateAPI.setApiKey(apiConfig.google.apiKey);
                }
            }
        } catch (e) {
            console.error('API-Konfiguration konnte nicht geladen werden:', e);
        }
    },

    // 保存API配置
    saveApiConfig(service, provider, appId, secretKey) {
        try {
            let apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 更新配置（运行时对象可包含敏感字段，不做持久化）
            if (service === 'current') {
                apiConfig.service = provider;
                this.currentService = provider;
            } else {
                if (!apiConfig[provider]) {
                    apiConfig[provider] = {};
                }

                if (provider === 'google') {
                    // Google翻译只需要一个apiKey（仅运行时使用）
                    apiConfig[provider].apiKey = appId;
                } else {
                    // 百度和有道翻译需要appId和secretKey（仅运行时使用）
                    apiConfig[provider].appId = appId;
                    apiConfig[provider].secretKey = secretKey;
                }
            }

            // 仅持久化非敏感字段，避免明文存储密钥
            const persistedConfig = { service: apiConfig.service || this.currentService };
            if (apiConfig.baidu && apiConfig.baidu.appId) {
                persistedConfig.baidu = { appId: apiConfig.baidu.appId };
            }
            if (apiConfig.youdao && apiConfig.youdao.appId) {
                persistedConfig.youdao = { appId: apiConfig.youdao.appId };
            }
            localStorage.setItem('translateApiConfig', JSON.stringify(persistedConfig));

            return true;
        } catch (e) {
            console.error('API-Konfiguration konnte nicht gespeichert werden:', e);
            return false;
        }
    },

    // 保存所有API配置
    saveAllApiConfig() {
        try {
            // 获取当前所选服务
            const currentService = this.elements.currentServiceSelect?.value || 'google';

            // 获取百度翻译API配置
            const baiduAppId = document.getElementById('baidu-app-id')?.value?.trim() || '';
            const baiduSecretKey = document.getElementById('baidu-secret-key')?.value?.trim() || '';

            // 获取有道翻译API配置
            const youdaoAppId = document.getElementById('youdao-app-id')?.value?.trim() || '';
            const youdaoSecretKey = document.getElementById('youdao-secret-key')?.value?.trim() || '';

            // 获取Google翻译API配置
            const googleApiKey = document.getElementById('google-api-key')?.value?.trim() || '';

            // 验证必填字段
            if (currentService === 'baidu' && (!baiduAppId || !baiduSecretKey)) {
                this.showNotification('Bitte füllen Sie die vollständige Konfiguration der Baidu-Übersetzungs-API aus');
                return false;
            }
            
            if (currentService === 'youdao' && (!youdaoAppId || !youdaoSecretKey)) {
                this.showNotification('Bitte füllen Sie die vollständige Konfiguration der Youdao-Übersetzungs-API aus');
                return false;
            }
            
            if (currentService === 'google' && !googleApiKey) {
                this.showNotification('Bitte füllen Sie den Google-Übersetzungs-API-Schlüssel aus');
                return false;
            }

            // 创建配置对象
            let apiConfig = {};

            // 设置当前服务
            apiConfig.service = currentService;
            this.currentService = currentService;

            // 设置百度翻译API配置
            if (baiduAppId && baiduSecretKey) {
                apiConfig.baidu = {
                    appId: baiduAppId,
                    secretKey: baiduSecretKey
                };
                TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
            }

            // 设置有道翻译API配置
            if (youdaoAppId && youdaoSecretKey) {
                apiConfig.youdao = {
                    appId: youdaoAppId,
                    secretKey: youdaoSecretKey
                };
                TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
            }

            // 设置Google翻译API配置
            if (googleApiKey) {
                apiConfig.google = {
                    apiKey: googleApiKey
                };
                GoogleTranslateAPI.setApiKey(googleApiKey);
            }

            // 如果是百度或有道翻译，设置当前服务
            if (currentService === 'baidu' || currentService === 'youdao') {
                TranslateAPI.setService(currentService);
            }

            // 保存到本地存储（仅持久化非敏感字段，避免明文持久化密钥）
            const safeApiConfig = {
                service: currentService
            };
            if (baiduAppId) {
                safeApiConfig.baidu = {
                    appId: baiduAppId
                };
            }
            if (youdaoAppId) {
                safeApiConfig.youdao = {
                    appId: youdaoAppId
                };
            }
            localStorage.setItem('translateApiConfig', JSON.stringify(safeApiConfig));

            // 更新API状态
            this.checkApiStatus();

            // 显示成功提示
            this.showNotification('API-Konfiguration gespeichert');

            // 关闭对话框
            this.closeApiConfigModal();

            return true;
        } catch (e) {
            console.error('API-Konfiguration konnte nicht gespeichert werden:', e);
            this.showNotification('API-Konfiguration konnte nicht gespeichert werden');
            return false;
        }
    },

    // 保存所有API配置
    saveAllApiConfig() {
        try {
            // 获取当前所选服务
            const currentService = this.elements.currentServiceSelect.value;

            // 获取百度翻译API配置
            const baiduAppId = document.getElementById('baidu-app-id').value.trim();
            const baiduSecretKey = document.getElementById('baidu-secret-key').value.trim();

            // 获取有道翻译API配置
            const youdaoAppId = document.getElementById('youdao-app-id').value.trim();
            const youdaoSecretKey = document.getElementById('youdao-secret-key').value.trim();

            // 获取Google翻译API配置
            const googleApiKey = document.getElementById('google-api-key').value.trim();

            // 创建配置对象
            let apiConfig = {};

            // 设置当前服务
            apiConfig.service = currentService;
            this.currentService = currentService;

            // 设置百度翻译API配置
            if (baiduAppId && baiduSecretKey) {
                apiConfig.baidu = {
                    appId: baiduAppId,
                    secretKey: baiduSecretKey
                };
                TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
            }

            // 设置有道翻译API配置
            if (youdaoAppId && youdaoSecretKey) {
                apiConfig.youdao = {
                    appId: youdaoAppId,
                    secretKey: youdaoSecretKey
                };
                TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
            }

            // 设置Google翻译API配置
            if (googleApiKey) {
                apiConfig.google = {
                    apiKey: googleApiKey
                };
                GoogleTranslateAPI.setApiKey(googleApiKey);
            }

            // 如果是百度或有道翻译，设置当前服务
            if (currentService === 'baidu' || currentService === 'youdao') {
                TranslateAPI.setService(currentService);
            }

            // 保存到本地存储
            localStorage.setItem('translateApiConfig', JSON.stringify(apiConfig));

            // 更新API状态
            this.checkApiStatus();

            // 显示成功提示
            this.showNotification('API-Konfiguration gespeichert');

            // 关闭对话框
            this.closeApiConfigModal();

            return true;
        } catch (e) {
            console.error('API-Konfiguration konnte nicht gespeichert werden:', e);
            this.showNotification('API-Konfiguration konnte nicht gespeichert werden');
            return false;
        }
    },

    // 检查API状态
    async checkApiStatus() {
        let isAvailable = false;

        // 根据当前服务检查API状态
        if (this.currentService === 'baidu' || this.currentService === 'youdao') {
            isAvailable = await TranslateAPI.checkApiStatus();
        } else if (this.currentService === 'google') {
            isAvailable = await GoogleTranslateAPI.checkApiStatus();
        } else if (this.currentService === 'local') {
            // 本地翻译始终可用
            isAvailable = true;
        }

        this.updateApiStatus(isAvailable ? 'online' : 'offline');
    },

    // 打开API配置对话框
    openApiConfigModal() {
        // 填充表单
        this.fillApiConfigForm();

        // 显示对话框
        if (this.elements.apiConfigModal) {
            this.elements.apiConfigModal.style.display = 'block';
        } else {
            console.warn('API-Konfigurationsmodal-Element nicht gefunden');
        }

        // 设置当前选项卡
        this.switchApiConfigTab(this.currentService);
    },

    // 关闭API配置对话框
    closeApiConfigModal() {
        if (this.elements.apiConfigModal) {
            this.elements.apiConfigModal.style.display = 'none';
        } else {
            console.warn('API-Konfigurationsmodal-Element nicht gefunden');
        }
    },

    // 切换API配置选项卡
    switchApiConfigTab(tabId) {
        // 更新选项卡状态
        if (this.elements.apiConfigTabs && this.elements.apiConfigTabs.forEach) {
            this.elements.apiConfigTabs.forEach(tab => {
                if (tab && tab.classList && tab.dataset) {
                    tab.classList.toggle('active', tab.dataset.tab === tabId);
                } else {
                    console.warn('API-Konfigurationstab-Element oder dessen Eigenschaften existieren nicht');
                }
            });
        }

        // 更新内容显示
        if (this.elements.apiServiceConfigs && this.elements.apiServiceConfigs.forEach) {
            this.elements.apiServiceConfigs.forEach(config => {
                if (config && config.id) {
                    const configId = config.id.replace('-config', '');
                    config.style.display = configId === tabId ? 'block' : 'none';
                } else {
                    console.warn('API-Dienstkonfigurationselement oder dessen ID-Eigenschaft existieren nicht');
                }
            });
        }
    },

    // 填充API配置表单
    fillApiConfigForm() {
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 设置当前服务
            if (apiConfig.service && this.elements.currentServiceSelect) {
                this.elements.currentServiceSelect.value = apiConfig.service;
            }

            // 填充百度翻译API配置
            if (apiConfig.baidu) {
                const baiduAppId = document.getElementById('baidu-app-id');
                const baiduSecretKey = document.getElementById('baidu-secret-key');
                if (baiduAppId) baiduAppId.value = apiConfig.baidu.appId || '';
                if (baiduSecretKey) baiduSecretKey.value = apiConfig.baidu.secretKey || '';
            }

            // 填充有道翻译API配置
            if (apiConfig.youdao) {
                const youdaoAppId = document.getElementById('youdao-app-id');
                const youdaoSecretKey = document.getElementById('youdao-secret-key');
                if (youdaoAppId) youdaoAppId.value = apiConfig.youdao.appId || '';
                if (youdaoSecretKey) youdaoSecretKey.value = apiConfig.youdao.secretKey || '';
            }

            // 填充Google翻译API配置
            if (apiConfig.google) {
                const googleApiKey = document.getElementById('google-api-key');
                if (googleApiKey) googleApiKey.value = apiConfig.google.apiKey || '';
            }
        } catch (e) {
            console.error('Ausfüllen des API-Konfigurationsformulars fehlgeschlagen:', e);
        }
    },

    // 初始化DOM元素引用
    initElements() {
        this.elements.sourceText = document.getElementById('input-text');
        this.elements.translatedText = document.getElementById('output-text');
        this.elements.sourceLanguage = document.getElementById('source-language');
        this.elements.targetLanguage = document.getElementById('target-language');
        this.elements.swapButton = document.getElementById('swap-languages');
        this.elements.clearSource = document.getElementById('clear-input');
        this.elements.copySource = document.getElementById('copy-source');
        this.elements.copyTranslation = document.getElementById('copy-output');
        this.elements.speakTranslation = document.getElementById('speak-output');
        this.elements.statusIndicator = document.getElementById('status-indicator');
        this.elements.statusText = document.getElementById('status-text');

        // API配置对话框元素 - 这些元素在HTML中不存在，添加空值检查
        this.elements.apiStatusDiv = document.querySelector('.api-status');
        this.elements.apiConfigModal = null; // HTML中没有api-config-modal元素
        this.elements.modalClose = null;
        this.elements.apiConfigTabs = Array.from(document.querySelectorAll('.api-config-tab'));
        this.elements.apiServiceConfigs = Array.from(document.querySelectorAll('.api-service-config'));
        this.elements.currentServiceSelect = document.getElementById('current-api-service');
        this.elements.saveApiConfigBtn = null;
        this.elements.cancelApiConfigBtn = null;
    },

    // 初始化事件监听器
    initEventListeners() {
        // 输入文本变化时触发翻译
        this.elements.sourceText.addEventListener('input', this.handleTextInput.bind(this));

        // 源语言变化时触发翻译
        this.elements.sourceLanguage.addEventListener('change', () => {
            this.savePreferences();
            this.translateText();
        });

        // 目标语言变化时触发翻译
        this.elements.targetLanguage.addEventListener('change', () => {
            this.savePreferences();
            this.translateText();
        });

        // 交换语言按钮
        if (this.elements.swapButton) {
            this.elements.swapButton.addEventListener('click', this.swapLanguages.bind(this));
        } else {
            console.warn('Sprachwechsel-Button-Element nicht gefunden');
        }

        // 清空源文本
        if (this.elements.clearSource) {
            this.elements.clearSource.addEventListener('click', this.clearSourceText.bind(this));
        } else {
            console.warn('Button zum Löschen des Quelltextes nicht gefunden');
        }

        // 复制源文本
        if (this.elements.copySource) {
            this.elements.copySource.addEventListener('click', () => this.copyText(this.elements.sourceText));
        } else {
            console.warn('Button zum Kopieren des Quelltextes nicht gefunden');
        }

        // 复制翻译结果
        if (this.elements.copyTranslation) {
            this.elements.copyTranslation.addEventListener('click', () => this.copyText(this.elements.translatedText));
        } else {
            console.warn('Button zum Kopieren des Übersetzungsergebnisses nicht gefunden');
        }

        // 朗读翻译结果
        if (this.elements.speakTranslation) {
            this.elements.speakTranslation.addEventListener('click', this.speakTranslation.bind(this));
        } else {
            console.warn('Button zum Vorlesen des Übersetzungsergebnisses nicht gefunden');
        }

        // 自动调整文本区高度
        if (this.elements.sourceText) {
            this.elements.sourceText.addEventListener('input', () => this.adjustTextareaHeight(this.elements.sourceText));
        } else {
            console.warn('Quelltext-Eingabefeld-Element nicht gefunden');
        }
    },

    // 处理文本输入
    handleTextInput() {
        // 使用防抖延迟翻译，提高性能
        clearTimeout(this.translateTimer);
        this.translateTimer = setTimeout(() => {
            this.translateText();
        }, 300); // 300ms延迟
    },

    // 翻译文本
    translateText() {
        if (!this.elements.sourceText || !this.elements.sourceLanguage || !this.elements.targetLanguage || !this.elements.translatedText) {
            console.warn('Für die Übersetzung erforderliche Elemente nicht gefunden');
            return;
        }

        const sourceText = this.elements.sourceText.value.trim();
        const sourceLanguage = this.elements.sourceLanguage.value;
        const targetLanguage = this.elements.targetLanguage.value;

        // 如果文本为空，清空翻译结果
        if (!sourceText) {
            this.elements.translatedText.value = '';
            return;
        }

        // 限制文本长度
        if (sourceText.length > 5000) {
            this.elements.translatedText.value = 'Text ist zu lang. Bitte auf 5000 Zeichen beschränken.';
            return;
        }

        // 如果文本和语言与上次相同，无需重新翻译
        const currentLanguagePair = `${sourceLanguage}-${targetLanguage}`;
        if (sourceText === this.lastTranslatedText && currentLanguagePair === this.lastLanguagePair) {
            return;
        }

        this.lastTranslatedText = sourceText;
        this.lastLanguagePair = currentLanguagePair;

        // 模拟翻译过程（实际项目中会调用翻译API）
        this.simulateTranslation(sourceText, sourceLanguage, targetLanguage);
    },

    /**
     * 判断是否应该重试
     * @param {Error} error - 错误对象
     * @returns {boolean} 是否应该重试
     */
    shouldRetry(error) {
        const retryableErrors = [
            'Netzwerk', 'Zeitüberschreitung', 'Anfrage fehlgeschlagen', 'API-Anfrage fehlgeschlagen', 'AbortError', 'timeout', 'network'
        ];
        
        return retryableErrors.some(keyword => 
            error.message.includes(keyword) || error.name.includes(keyword)
        );
    },

    /**
     * 判断是否应该切换到备用API
     * @param {Error} error - 错误对象
     * @returns {boolean} 是否应该切换API
     */
    shouldSwitchApi(error) {
        const switchableErrors = [
            'API-Schlüssel', 'Konfiguration', 'Authentifizierung', 'Berechtigung', 'quota', 'limit', 'invalid'
        ];
        
        return switchableErrors.some(keyword => 
            error.message.includes(keyword)
        );
    },

    /**
     * 切换到备用API
     */
    switchToFallbackApi() {
        const apis = ['baidu', 'youdao', 'google', 'local'];
        const currentIndex = apis.indexOf(this.currentService);
        
        // 尝试切换到下一个可用的API
        for (let i = 1; i < apis.length; i++) {
            const nextApi = apis[(currentIndex + i) % apis.length];
            if (this.isApiAvailable(nextApi)) {
                console.log(`切换到备用API: ${nextApi}`);
                this.currentService = nextApi;
                this.updateApiSelector();
                break;
            }
        }
    },

    /**
     * 检查API是否可用
     * @param {string} apiName - API名称
     * @returns {boolean} 是否可用
     */
    isApiAvailable(apiName) {
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');
            
            switch (apiName) {
                case 'baidu':
                    return apiConfig.baidu && apiConfig.baidu.appId && apiConfig.baidu.secretKey;
                case 'youdao':
                    return apiConfig.youdao && apiConfig.youdao.appId && apiConfig.youdao.secretKey;
                case 'google':
                    return apiConfig.google && apiConfig.google.apiKey;
                case 'local':
                    return true; // 本地翻译总是可用
                default:
                    return false;
            }
        } catch (e) {
            console.error('Überprüfung der API-Verfügbarkeit fehlgeschlagen:', e);
            return false;
        }
    },

    /**
     * 更新API选择器显示
     */
    updateApiSelector() {
        if (this.elements.currentServiceSelect) {
            this.elements.currentServiceSelect.value = this.currentService;
        }
    },

    // 使用API进行实际翻译
    async simulateTranslation(text, sourceLanguage, targetLanguage) {
        if (!this.elements.translatedText) {
            console.warn('Textbox-Element für Übersetzungsergebnis nicht gefunden');
            return;
        }

        // 设置加载状态
        this.elements.translatedText.value = 'Übersetzung läuft...';

        try {
            let translatedText = '';

            // 根据当前服务选择翻译API
            if (this.currentService === 'baidu' || this.currentService === 'youdao') {
                translatedText = await TranslateAPI.translate(text, sourceLanguage, targetLanguage);
            } else if (this.currentService === 'google') {
                translatedText = await GoogleTranslateAPI.translate(text, sourceLanguage, targetLanguage);
            } else if (this.currentService === 'local') {
                translatedText = await LocalTranslate.translate(text, sourceLanguage, targetLanguage);
            }

            // 更新翻译结果
            this.elements.translatedText.value = translatedText;

            // 更新API状态为在线
            this.updateApiStatus('online');
        } catch (error) {
            console.error('Übersetzung fehlgeschlagen:', error);
            // 更新API状态为离线
            this.updateApiStatus('offline');

            // 显示错误信息
            this.elements.translatedText.value = `翻译服务暂不可用: ${error.message}`;

            // 如果API服务不可用，使用本地模拟翻译作为后备
            this.fallbackTranslation(text, sourceLanguage, targetLanguage);
        } finally {
            // 调整文本区域高度
            this.adjustTextareaHeight(this.elements.translatedText);
        }
    },

    // 本地模拟翻译（作为API不可用时的后备方案）
    async fallbackTranslation(text, sourceLanguage, targetLanguage) {
        if (!this.elements.translatedText) {
            console.warn('Textbox-Element für Übersetzungsergebnis nicht gefunden');
            return;
        }

        try {
            // 使用本地翻译模块（同步函数，不需要await）
            const translatedText = LocalTranslate.translate(text, sourceLanguage, targetLanguage);

            // 如果本地翻译有结果，更新UI
            if (translatedText && this.elements.translatedText.value.includes('Übersetzungsdienst vorübergehend nicht verfügbar')) {
                this.elements.translatedText.value = `${translatedText}\n(使用本地翻译，API服务不可用)`;
            }
        } catch (error) {
            console.error('Lokale Übersetzung fehlgeschlagen:', error);
        }
    },

    // 交换语言
    swapLanguages() {
        if (!this.elements.sourceLanguage || !this.elements.targetLanguage || !this.elements.sourceText || !this.elements.translatedText) {
            console.warn('Für den Sprachwechsel erforderliche Elemente nicht gefunden');
            return;
        }

        // 只有当源语言不是自动检测时才能交换
        if (this.elements.sourceLanguage.value === 'auto') {
            this.showNotification('Sprachwechsel im automatischen Erkennungsmodus nicht möglich');
            return;
        }

        // 保存当前语言值
        const sourceLanguage = this.elements.sourceLanguage.value;
        const targetLanguage = this.elements.targetLanguage.value;

        // 交换语言选择
        this.elements.sourceLanguage.value = targetLanguage;
        this.elements.targetLanguage.value = sourceLanguage;

        // 交换文本内容
        const sourceText = this.elements.sourceText.value;
        this.elements.sourceText.value = this.elements.translatedText.value;

        // 触发翻译
        this.savePreferences();
        this.translateText();

        // 显示动画效果
        if (this.elements.swapButton && this.elements.swapButton.classList) {
            this.elements.swapButton.classList.add('active');
            setTimeout(() => {
                if (this.elements.swapButton && this.elements.swapButton.classList) {
                    this.elements.swapButton.classList.remove('active');
                } else {
                    console.warn('Sprachwechsel-Button-Element oder dessen classList-Eigenschaft existieren nicht');
                }
            }, 500);
        } else {
            console.warn('Sprachwechsel-Button-Element nicht gefunden');
        }
    },

    // 清空源文本
    clearSourceText() {
        if (!this.elements.sourceText || !this.elements.translatedText) {
            console.warn('Zum Löschen des Textes erforderliche Elemente nicht gefunden');
            return;
        }

        this.elements.sourceText.value = '';
        this.elements.translatedText.value = '';
        this.elements.sourceText.focus();
        this.adjustTextareaHeight(this.elements.sourceText);
        this.adjustTextareaHeight(this.elements.translatedText);
    },

    // 复制文本到剪贴板
    copyText(textArea) {
        if (!textArea.value) return;

        navigator.clipboard.writeText(textArea.value).then(
            () => {
                this.showNotification('In die Zwischenablage kopiert');
            },
            (err) => {
                console.error('Kopieren des Textes fehlgeschlagen: ', err);
                this.showNotification('Kopieren fehlgeschlagen, bitte manuell kopieren.');
            }
        );
    },

    // 朗读翻译结果
    speakTranslation() {
        if (!this.elements.translatedText.value) return;

        // 检查浏览器是否支持语音合成
        if (!this.speechSynthesis) {
            this.showNotification('Ihr Browser unterstützt die Sprachsynthese nicht.');
            return;
        }

        // 停止任何正在进行的朗读
        this.speechSynthesis.cancel();

        // 创建语音对象
        const utterance = new SpeechSynthesisUtterance(this.elements.translatedText.value);

        // 设置语言
        utterance.lang = this.getLanguageCode(this.elements.targetLanguage.value);

        // 开始朗读
        this.speechSynthesis.speak(utterance);
    },

    // 获取语言代码
    getLanguageCode(langValue) {
        const langMap = {
            'zh': 'zh-CN',
            'en': 'en-US',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES',
            'ru': 'ru-RU'
        };

        return langMap[langValue] || 'en-US';
    },

    // 调整文本区域高度
    adjustTextareaHeight(textarea) {
        if (!textarea) {
            console.warn('Textbereich-Element nicht gefunden.');
            return;
        }
        
        // 重置高度
        if (textarea && textarea.style) {
            textarea.style.height = 'auto';

            // 设置新高度（最小200px）
            const newHeight = Math.max(200, textarea.scrollHeight);
            textarea.style.height = newHeight + 'px';
        } else {
            console.warn('Textarea-Element oder dessen Style-Attribut fehlt.');
        }
    },

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        if (notification && notification.className !== undefined) {
            notification.className = `notification ${type}`;
            notification.textContent = message;
        } else {
            console.warn('Benachrichtigungs-Element oder dessen className-Attribut fehlt.');
            return;
        }

        document.body.appendChild(notification);

        // 显示动画
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (notification && notification.style) {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(-50%) translateY(0)';
                } else {
                    console.warn('Benachrichtigungs-Element oder dessen Style-Attribut fehlt.');
                }
            });
        });

        // 根据类型设置不同的自动隐藏时间
        const hideTime = type === 'error' ? 5000 : type === 'warning' ? 3000 : 2000;

        // 自动隐藏
        setTimeout(() => {
            if (notification && notification.style) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                console.warn('Benachrichtigungs-Element oder dessen Style-Attribut fehlt.');
            }

            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, hideTime);
    },

    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     * @param {string} type - 消息类型 ('error', 'warning', 'success')
     */
    showError(message, type = 'error') {
        this.showNotification(message, type);
    },

    // 检测文本是否为英文
    isEnglish(text) {
        // 简单检查：如果包含英文字符，则认为是英文
        return /[a-zA-Z]/.test(text);
    },

    // 检测文本是否为中文
    isChinese(text) {
        // 检查是否包含中文字符
        return /[\u4E00-\u9FFF]/.test(text);
    },

    // 模拟英译中
    fakeTranslateToZh(text) {
        const translations = {
            'hello': 'Hallo',
            'world': 'Welt',
            'good': 'Okay',
            'morning': 'Morgen',
            'evening': 'Abend',
            'welcome': 'Willkommen',
            'thanks': 'Danke',
            'thank you': 'Danke dir',
            'translate': 'Übersetzen',
            'language': 'Sprache',
            'english': 'Englisch',
            'chinese': 'Chinesisch',
            'programming': 'Programmierung',
            'website': 'Webseite',
            'code': 'Code',
            'developer': 'Entwickler',
            'user': 'Benutzer',
            'interface': 'Benutzeroberfläche',
            'experience': 'Erlebnis',
            'design': 'Design',
            'feature': 'Funktion',
            'application': 'Anwendung',
            'real-time': 'Echtzeit',
            'service': 'Dienst'
        };

        // 简单替换
        let result = text.toLowerCase();

        Object.keys(translations).forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            result = result.replace(regex, translations[key]);
        });

        // 如果没有变化，添加提示信息
        if (result === text.toLowerCase()) {
            result = `${text} (这是模拟翻译，实际应用中请接入翻译API)`;
        }

        return result;
    },

    // 模拟中译英
    fakeTranslateToEn(text) {
        const translations = {
            'Hallo': 'hello',
            'Welt': 'world',
            'Okay': 'good',
            'Morgen': 'morning',
            'Abend': 'evening',
            'Willkommen': 'welcome',
            'Danke': 'thanks',
            'Danke dir': 'thank you',
            'Übersetzen': 'translate',
            'Sprache': 'language',
            'Englisch': 'english',
            'Chinesisch': 'chinese',
            'Programmierung': 'programming',
            'Webseite': 'website',
            'Code': 'code',
            'Entwickler': 'developer',
            'Benutzer': 'user',
            'Benutzeroberfläche': 'interface',
            'Erlebnis': 'experience',
            'Design': 'design',
            'Funktion': 'feature',
            'Anwendung': 'application',
            'Echtzeit': 'real-time',
            'Dienst': 'service'
        };

        // 简单替换
        let result = text;

        Object.keys(translations).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), translations[key]);
        });

        // 如果没有变化，添加提示信息
        if (result === text) {
            result = `${text} (This is a simulated translation, please connect to a translation API in actual application)`;
        }

        return result;
    },

    // 更新API状态
    updateApiStatus(status) {
        this.apiStatus = status;
        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.className = status === 'online' ? 'status-online' : 'status-offline';
        }
        if (this.elements.statusText) {
            this.elements.statusText.textContent = status === 'online' ? 'API-Dienst funktioniert einwandfrei' : 'API-Dienst ist fehlerhaft';
        }
    },

    // 保存用户偏好设置
    savePreferences() {
        const preferences = {
            sourceLanguage: this.elements.sourceLanguage.value,
            targetLanguage: this.elements.targetLanguage.value
        };

        localStorage.setItem('translatePreferences', JSON.stringify(preferences));
    },

    // 加载用户偏好设置
    loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('translatePreferences'));
            if (preferences) {
                this.elements.sourceLanguage.value = preferences.sourceLanguage || 'de';
                this.elements.targetLanguage.value = preferences.targetLanguage || 'zh';
            }
        } catch (e) {
            console.error('Laden der Voreinstellungen fehlgeschlagen:', e);
        }
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化翻译应用
    TranslateApp.init();

    // 添加通知和API设置对话框样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-light);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        }

        .api-config-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        .api-config-dialog.active {
            opacity: 1;
            visibility: visible;
        }

        .api-config-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .api-config-dialog.active .api-config-content {
            transform: translateY(0);
        }

        .api-config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .api-config-header h2 {
            margin: 0;
            color: var(--primary-color);
        }

        .api-config-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
        }

        .api-config-form {
            display: flex;
            flex-direction: column;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }

        .form-group select,
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .form-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .form-actions button {
            padding: 10px 15px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .save-btn {
            background-color: var(--primary-color);
            color: white;
        }

        .cancel-btn {
            background-color: #f1f1f1;
            color: #333;
        }
    `;
    document.head.appendChild(style);

    // 创建API设置对话框
    const apiConfigDialog = document.createElement('div');
    if (apiConfigDialog && apiConfigDialog.className !== undefined) {
        apiConfigDialog.className = 'api-config-dialog';
    } else {
        console.warn('apiConfigDialog-Element oder dessen className-Attribut fehlt.');
        return;
    }
    apiConfigDialog.innerHTML = `
        <div class="api-config-content">
            <div class="api-config-header">
                <h2>翻译API设置</h2>
                <button class="api-config-close">&times;</button>
            </div>
            <div class="api-config-form">
                <div class="form-group">
                    <label for="api-service">当前使用的翻译服务</label>
                    <select id="api-service">
                        <option value="baidu">百度翻译</option>
                        <option value="youdao">有道翻译</option>
                    </select>
                </div>

                <div class="api-service-config" id="baidu-config">
                    <h3>百度翻译设置</h3>
                    <div class="form-group">
                        <label for="baidu-app-id">百度应用ID (AppID)</label>
                        <input type="text" id="baidu-app-id" placeholder="Bitte geben Sie die AppID der Baidu-Übersetzungs-API ein.">
                    </div>
                    <div class="form-group">
                        <label for="baidu-secret-key">百度密钥 (SecretKey)</label>
                        <input type="password" id="baidu-secret-key" placeholder="Bitte geben Sie den SecretKey der Baidu-Übersetzungs-API ein.">
                    </div>
                </div>

                <div class="api-service-config" id="youdao-config" style="display: none;">
                    <h3>有道翻译设置</h3>
                    <div class="form-group">
                        <label for="youdao-app-id">有道应用ID (AppID)</label>
                        <input type="text" id="youdao-app-id" placeholder="Bitte geben Sie die AppID der Youdao-Übersetzungs-API ein.">
                    </div>
                    <div class="form-group">
                        <label for="youdao-secret-key">有道密钥 (SecretKey)</label>
                        <input type="password" id="youdao-secret-key" placeholder="Bitte geben Sie den SecretKey der Youdao-Übersetzungs-API ein.">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="cancel-btn">取消</button>
                    <button class="save-btn">保存设置</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(apiConfigDialog);

    // 初始化API设置对话框事件
    const apiService = document.getElementById('api-service');
    const baiduConfig = document.getElementById('baidu-config');
    const youdaoConfig = document.getElementById('youdao-config');
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const closeBtn = document.querySelector('.api-config-close');

    // 切换API服务显示
    apiService.addEventListener('change', () => {
        if (baiduConfig && youdaoConfig) {
            if (apiService.value === 'baidu') {
                baiduConfig.style.display = 'block';
                youdaoConfig.style.display = 'none';
            } else {
                baiduConfig.style.display = 'none';
                youdaoConfig.style.display = 'block';
            }
        } else {
            console.warn('API-Konfigurationselement nicht gefunden.');
        }
    });

    // 保存API设置
    saveBtn.addEventListener('click', () => {
        if (!apiConfigDialog || !apiConfigDialog.classList) {
            console.warn('API-Konfigurationsdialog-Element nicht gefunden.');
            return;
        }

        const service = apiService.value;

        // 保存当前服务选择
        TranslateApp.saveApiConfig('current', service);
        TranslateAPI.setService(service);

        // 保存百度API配置
        const baiduAppIdElement = document.getElementById('baidu-app-id');
        const baiduSecretKeyElement = document.getElementById('baidu-secret-key');
        if (baiduAppIdElement && baiduSecretKeyElement) {
            const baiduAppId = baiduAppIdElement.value;
            const baiduSecretKey = baiduSecretKeyElement.value;
            if (baiduAppId && baiduSecretKey) {
                // 不在本地存储中持久化密钥，仅在当前运行时设置
                TranslateApp.saveApiConfig('api', 'baidu', baiduAppId, '');
                TranslateAPI.setApiKey('baidu', baiduAppId, baiduSecretKey);
            }
        }

        // 保存有道API配置
        const youdaoAppIdElement = document.getElementById('youdao-app-id');
        const youdaoSecretKeyElement = document.getElementById('youdao-secret-key');
        if (youdaoAppIdElement && youdaoSecretKeyElement) {
            const youdaoAppId = youdaoAppIdElement.value;
            const youdaoSecretKey = youdaoSecretKeyElement.value;
            if (youdaoAppId && youdaoSecretKey) {
                // 不在本地存储中持久化密钥，仅在当前运行时设置
                TranslateApp.saveApiConfig('api', 'youdao', youdaoAppId, '');
                TranslateAPI.setApiKey('youdao', youdaoAppId, youdaoSecretKey);
            }
        }

        // 关闭对话框
        if (apiConfigDialog && apiConfigDialog.classList) {
            apiConfigDialog.classList.remove('active');
        } else {
            console.warn('apiConfigDialog-Element oder dessen classList-Attribut fehlt.');
            return;
        }

        // 检查API状态
        TranslateApp.checkApiStatus();

        // 显示通知
        TranslateApp.showNotification('API-Einstellungen wurden gespeichert.');
    });

    // 取消按钮
    cancelBtn.addEventListener('click', () => {
        if (apiConfigDialog && apiConfigDialog.classList) {
            apiConfigDialog.classList.remove('active');
        } else {
            console.warn('API-Konfigurationsdialog-Element nicht gefunden.');
        }
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
        if (apiConfigDialog && apiConfigDialog.classList) {
            apiConfigDialog.classList.remove('active');
        } else {
            console.warn('API-Konfigurationsdialog-Element nicht gefunden.');
        }
    });

    // 点击状态指示器打开API设置
    document.querySelector('.api-status').addEventListener('click', () => {
        // 加载当前配置到表单
        try {
            const apiConfig = JSON.parse(localStorage.getItem('translateApiConfig') || '{}');

            // 设置当前服务
            apiService.value = apiConfig.service || 'baidu';

            // 切换显示对应服务配置
            if (baiduConfig && youdaoConfig) {
                if (apiService.value === 'baidu') {
                    baiduConfig.style.display = 'block';
                    youdaoConfig.style.display = 'none';
                } else {
                    baiduConfig.style.display = 'none';
                    youdaoConfig.style.display = 'block';
                }
            } else {
                console.warn('API-Konfigurationselement nicht gefunden.');
            }

            // 设置百度API密钥
            if (apiConfig.baidu) {
                const baiduAppId = document.getElementById('baidu-app-id');
                const baiduSecretKey = document.getElementById('baidu-secret-key');
                if (baiduAppId) baiduAppId.value = apiConfig.baidu.appId || '';
                if (baiduSecretKey) baiduSecretKey.value = apiConfig.baidu.secretKey || '';
            }

            // 设置有道API密钥
            if (apiConfig.youdao) {
                const youdaoAppId = document.getElementById('youdao-app-id');
                const youdaoSecretKey = document.getElementById('youdao-secret-key');
                if (youdaoAppId) youdaoAppId.value = apiConfig.youdao.appId || '';
                if (youdaoSecretKey) youdaoSecretKey.value = apiConfig.youdao.secretKey || '';
            }
        } catch (e) {
            console.error('Laden der API-Konfiguration ins Formular fehlgeschlagen:', e);
        }

        // 显示对话框
        if (apiConfigDialog && apiConfigDialog.classList) {
            apiConfigDialog.classList.add('active');
        } else {
            console.warn('API-Konfigurationsdialog-Element nicht gefunden.');
        }
    });
});
