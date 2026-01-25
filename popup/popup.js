const volumeSlider = document.getElementById("volumeSlider");

async function ensureInjected() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content.js"],
	});

	return tab.id;
}

volumeSlider.addEventListener("input", async () => {
	const tabId = await ensureInjected(); // inject first

	chrome.tabs.sendMessage(tabId, {
		type: "SET_VOLUME",
		value: volumeSlider.value / 50,
	});
});
