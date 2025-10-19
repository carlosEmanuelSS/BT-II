// Content script that runs on all pages
console.log('Content script loaded on:', window.location.href);

// Add a visual indicator that the extension is active
function addExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'extension-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  indicator.textContent = 'Extension Active';
  document.body.appendChild(indicator);
  
  // Remove indicator after 3 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 3000);
}

// Add indicator when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addExtensionIndicator);
} else {
  addExtensionIndicator();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlightLinks') {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.style.outline = '2px solid #4CAF50';
    });
    sendResponse({ success: true, count: links.length });
  }
});
