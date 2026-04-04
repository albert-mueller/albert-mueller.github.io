// Theme Manager - Simplified
const ThemeManager = {
    currentTheme: null,
    toggleBtn: null,

    init() {
        this.createToggleButton();
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            this.setTheme(savedTheme);
        } else {
            const systemPreference = this.checkSystemPreference();
            if (systemPreference) {
                this.setTheme(systemPreference);
            } else {
                this.setThemeByTime();
            }
        }
        
        this.listenForSystemPreferenceChanges();
    },

    createToggleButton() {
        const toggleBtn = document.createElement('div');
        toggleBtn.classList.add('theme-toggle');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        toggleBtn.setAttribute('title', 'Toggle theme');
        
        toggleBtn.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(toggleBtn);
        this.toggleBtn = toggleBtn;
    },

    setThemeByTime() {
        const hour = new Date().getHours();
        const theme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
        this.setTheme(theme);
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    },

    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            this.updateThemeColor('#1a1a2e');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
            this.updateThemeColor('#f3f9ff');
        }
    },

    updateThemeColor(color) {
        const themeColorMeta = document.getElementById('theme-color');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', color);
        }
    },

    checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return null;
    },

    listenForSystemPreferenceChanges() {
        if (window.matchMedia) {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeMediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
};

// Email Popup - Simplified
const EmailPopup = {
    popup: null,
    isVisible: false,

    init() {
        const emailIcon = document.getElementById('email-icon');
        if (emailIcon) {
            emailIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.show(e);
            });
        }

        document.addEventListener('click', (e) => {
            if (this.popup && !this.popup.contains(e.target) && e.target.id !== 'email-icon') {
                this.hide();
            }
        });
    },

    show(e) {
        if (this.isVisible) return;
        this.isVisible = true;

        const target = e.target.closest('#email-icon') || e.target;
        const popup = document.createElement('div');
        popup.classList.add('email-popup');

        const iconRect = target.getBoundingClientRect();
        const popupTop = iconRect.top - 220 < 10 ? iconRect.top + iconRect.height + 10 : iconRect.top - 220;

        Object.assign(popup.style, {
            position: 'fixed',
            top: `${popupTop}px`,
            left: `${iconRect.left + (iconRect.width / 2)}px`,
            transform: 'translateX(-50%)',
            opacity: '0'
        });

        popup.innerHTML = `
            <div class="email-popup-header">
                <i class="fas fa-envelope"></i>
                <h3>Contact Me</h3>
            </div>
            <div class="email-content">
                <div class="email-main">
                    <div class="email-address">
                        <span class="email-label">Email:</span>
                        <div class="email-value">
                            <span class="email-text">fairzlq@gmail.com</span>
                            <button class="copy-button" data-email="fairzlq@gmail.com">
                                <i class="fas fa-copy"></i>
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                    <div class="email-info">
                        <i class="fas fa-info-circle"></i>
                        <span>Click copy button to copy email</span>
                    </div>
                </div>
            </div>
            <div class="email-popup-footer">
                <button class="close-button">
                    <i class="fas fa-times"></i>
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(popup);
        this.popup = popup;

        requestAnimationFrame(() => {
            popup.style.opacity = '1';
        });

        popup.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                const email = button.dataset.email;
                navigator.clipboard.writeText(email).then(() => {
                    this.showNotification('Email copied');
                });
            });
        });

        popup.querySelector('.close-button').addEventListener('click', () => this.hide());
    },

    hide() {
        if (!this.isVisible || !this.popup) return;
        this.popup.style.opacity = '0';
        
        let popup = this.popup;
        setTimeout(() => {
            if (popup && popup.parentNode) {
                document.body.removeChild(popup);
            }
            this.popup = null;
            this.isVisible = false;
        }, 200);
    },

    showNotification(message) {
        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'var(--primary-color)',
            color: 'white',
            borderRadius: '5px',
            zIndex: '1001',
            opacity: '0',
            transition: 'opacity 0.2s ease'
        });
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 200);
        }, 1500);
    }
};

// Throttle function - Single definition
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    EmailPopup.init();

    // Simple fade in animation
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '1';
        }, 50);
    }

    // Card reveal
    const cards = document.querySelectorAll('.card');
    setTimeout(() => {
        cards.forEach(card => {
            card.style.opacity = '1';
        });
    }, 200);
});
