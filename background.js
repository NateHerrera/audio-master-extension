// background/service worker to handle the storage
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({
		volumeSlider: 50,
		bassSlider: 50,
		midSlider: 50,
		trebleSlider: 50,
		isOn: false,
	});
});
