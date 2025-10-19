document.addEventListener('DOMContentLoaded', function() {
  const testButton = document.getElementById('testButton');
  const status = document.getElementById('status');

  testButton.addEventListener('click', function() {
    // Simulate extension functionality
    status.textContent = 'Extension is working! ✅';
    status.className = 'success';
    
    // Store test result
    chrome.storage.local.set({ 'extensionTested': true, 'timestamp': Date.now() });
  });

  // Check if extension was already tested
  chrome.storage.local.get(['extensionTested'], function(result) {
    if (result.extensionTested) {
      status.textContent = 'Extension was already tested! ✅';
      status.className = 'success';
    }
  });
});
