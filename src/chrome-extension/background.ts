// // Background script to handle authentication state
// chrome.runtime.onInstalled.addListener(() => {
//     // Initialize the auth state
//     chrome.storage.local.set({ isLoggedIn: false }, () => {
//         console.log('Authentication state initialized');
//     });
// });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'LOGIN') {
        // Here you would typically validate credentials with your backend
        // For demo purposes, we're just setting the state
        chrome.storage.local.set({ isLoggedIn: true, user: message.data }, () => {
            sendResponse({ success: true });
        });
        return true; // Required for async sendResponse
    }

    if (message.type === 'LOGOUT') {
        chrome.storage.local.set({ isLoggedIn: false, user: null }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.type === 'CHECK_AUTH') {
        chrome.storage.local.get(['isLoggedIn', 'user'], (result) => {
            sendResponse({
                isLoggedIn: result.isLoggedIn || false,
                user: result.user || null
            });
        });
        return true;
    }
}); 