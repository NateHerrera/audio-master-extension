const volumeSlider = document.getElementById("volumeSlider");
const bassSlider = document.getElementById("bassSlider");
const midSlider = document.getElementById("midSlider");
const trebleSlider = document.getElementById("trebleSlider");

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
		value: volumeSlider.value / 100,
	});
});

bassSlider.addEventListener("input", async () => {
	const tabId = await ensureInjected(); // inject first

	chrome.tabs.sendMessage(tabId, {
		type: "SET_BASS",
		value: bassSlider.value / 100,
	});
});

midSlider.addEventListener("input", async () => {
	const tabId = await ensureInjected(); // inject first

	chrome.tabs.sendMessage(tabId, {
		type: "SET_MID",
		value: midSlider.value / 100,
	});
});

trebleSlider.addEventListener("input", async () => {
	const tabId = await ensureInjected(); /// inject first

	chrome.tabs.sendMessage(tabId, {
		type: "SET_TREBLE",
		value: trebleSlider.value / 100,
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const dropdown = document.querySelector(".dropdown");
	const dropdownTrigger = dropdown.querySelector(".dropdown-trigger button");

	dropdownTrigger.addEventListener("click", (event) => {
		event.stopPropagation();
		dropdown.classList.toggle("is-active");
	});

	document.addEventListener("click", () => {
		dropdown.classList.remove("is-active");
	});
});
