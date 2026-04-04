// Download Page - Simplified
const DownloadPage = (function() {
    let currentDownloadLink = null;
    
    const userAgent = navigator.userAgent;
    const isWindows = userAgent.indexOf('Win') !== -1;
    const isMac = userAgent.indexOf('Mac') !== -1;
    
    function handleDownloadButtons() {
        const downloadItems = document.querySelectorAll('.download-item');
        if (downloadItems.length === 0) return;
        
        if (isWindows) {
            downloadItems.forEach(item => {
                const platform = item.querySelector('.download-platform');
                if (platform && !platform.textContent.includes('Windows')) {
                    item.style.display = 'none';
                }
            });
        } else if (isMac) {
            downloadItems.forEach(item => {
                const platform = item.querySelector('.download-platform');
                if (platform && !platform.textContent.includes('macOS')) {
                    item.style.display = 'none';
                }
            });
        }
    }
    
    function setupDownloadConfirmation() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.download-button')) {
                e.preventDefault();
                const link = e.target.closest('.download-button');
                currentDownloadLink = link.href;
                showDownloadConfirmation();
            }
        });
    }
    
    function showDownloadConfirmation() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            backdropFilter: 'blur(5px)'
        });
        
        const confirmBox = document.createElement('div');
        Object.assign(confirmBox.style, {
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        });
        
        confirmBox.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #333;">Download Confirmation</h3>
            <p style="margin-bottom: 1.5rem; color: #666; line-height: 1.5;">
                You are about to download PyQuick. Please confirm you have read and agree to the GPL v3 license.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="download-cancel-btn" style="
                    padding: 0.5rem 1.5rem;
                    border: 1px solid #ddd;
                    background: #f8f9fa;
                    border-radius: 6px;
                    cursor: pointer;
                ">Cancel</button>
                <button id="download-confirm-btn" style="
                    padding: 0.5rem 1.5rem;
                    border: none;
                    background: #007BFF;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                ">Download</button>
            </div>
        `;
        
        overlay.appendChild(confirmBox);
        document.body.appendChild(overlay);
        
        document.getElementById('download-cancel-btn').addEventListener('click', function() {
            document.body.removeChild(overlay);
            currentDownloadLink = null;
        });
        
        document.getElementById('download-confirm-btn').addEventListener('click', function() {
            if (currentDownloadLink) {
                window.location.href = currentDownloadLink;
            }
            document.body.removeChild(overlay);
            currentDownloadLink = null;
        });
    }
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }
        
        function initPage() {
            handleDownloadButtons();
            setupDownloadConfirmation();
        }
    }
    
    return { init: init };
})();

DownloadPage.init();
