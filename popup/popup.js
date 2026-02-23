// vars
const volumeSlider = document.getElementById("volumeSlider");
const bassSlider = document.getElementById("bassSlider");
const midSlider = document.getElementById("midSlider");
const trebleSlider = document.getElementById("trebleSlider");
const lightDarkMode = document.getElementById("lightDarkModeIcon");
const iconColor = document.getElementById("iconColor");
const titleColor = document.getElementById("titleColor");
const dropdownColor = document.getElementById("dropdownColor");

// define the presets
const presets = {
	cinema: { volume: 70, bass: 60, mid: 55, treble: 60 },
	gaming: { volume: 70, bass: 65, mid: 70, treble: 65 },
	flat: { volume: 50, bass: 50, mid: 50, treble: 50 },
	rnb: { volume: 60, bass: 70, mid: 60, treble: 45 },
	hiphop: { volume: 65, bass: 75, mid: 45, treble: 50 },
	rock: { volume: 65, bass: 60, mid: 45, treble: 65 },
	grunge: { volume: 65, bass: 65, mid: 35, treble: 55 },
};

async function ensureInjected() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	try {
		await chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ["content.js"],
		});
	} catch (e) {
		console.warn("Cannot inject into this page:", e.message);
		return null;
	}

	return tab.id;
}

volumeSlider.addEventListener("input", async () => {
	chrome.storage.local.set({ volumeSlider: Number(volumeSlider.value) });
	const tabId = await ensureInjected();
	if (!tabId) return; // if injection failed, don't send message

	chrome.tabs.sendMessage(tabId, {
		type: "SET_VOLUME",
		value: volumeSlider.value / 100,
	});
});

bassSlider.addEventListener("input", async () => {
	chrome.storage.local.set({ bassSlider: Number(bassSlider.value) });
	const tabId = await ensureInjected();
	if (!tabId) return; // if injection failed, don't send message

	chrome.tabs.sendMessage(tabId, {
		type: "SET_BASS",
		value: bassSlider.value / 100,
	});
});

midSlider.addEventListener("input", async () => {
	chrome.storage.local.set({ midSlider: Number(midSlider.value) });
	const tabId = await ensureInjected();
	if (!tabId) return; // if injection failed, don't send message

	chrome.tabs.sendMessage(tabId, {
		type: "SET_MID",
		value: midSlider.value / 100,
	});
});

trebleSlider.addEventListener("input", async () => {
	chrome.storage.local.set({ trebleSlider: Number(trebleSlider.value) });
	const tabId = await ensureInjected();
	if (!tabId) return; // if injection failed, don't send message

	chrome.tabs.sendMessage(tabId, {
		type: "SET_TREBLE",
		value: trebleSlider.value / 100,
	});
});

lightDarkMode.addEventListener("click", () => {
	const newTheme = lightDarkMode.classList.contains("fa-moon")
		? "light"
		: "dark";
	applyTheme(newTheme);
	chrome.storage.local.set({ theme: newTheme });
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

// toggle on and off
document.addEventListener("DOMContentLoaded", () => {
	const toggleSwitch = document.getElementById("switchModeIcon");
	const toggleSwitchColor = document.getElementById("iconSwitchColor");

	toggleSwitch.addEventListener("click", async () => {
		if (toggleSwitch.classList.contains("fa-toggle-off")) {
			// remove toggle off
			toggleSwitch.classList.remove("fa-solid");
			toggleSwitch.classList.remove("fa-toggle-off");
			// add toggle on
			toggleSwitch.classList.add("fa-solid");
			toggleSwitch.classList.add("fa-toggle-on");
			// change color of the icon
			toggleSwitchColor.classList.remove("has-text-grey");
			toggleSwitchColor.classList.add("has-text-success");
		} else {
			toggleSwitch.classList.remove("fa-solid");
			toggleSwitch.classList.remove("fa-toggle-on");
			// add toggle on
			toggleSwitch.classList.add("fa-solid");
			toggleSwitch.classList.add("fa-toggle-off");
			// change color of the icon
			toggleSwitchColor.classList.remove("has-text-success");
			toggleSwitchColor.classList.add("has-text-grey");
		}

		const tabId = await ensureInjected();
		if (!tabId) return;
		chrome.storage.local.set({
			isOn: toggleSwitch.classList.contains("fa-toggle-on"),
		});
		chrome.tabs.sendMessage(tabId, {
			type: "TOGGLE_EXTENSION",
			isOn: toggleSwitch.classList.contains("fa-toggle-on"),
		});
	});
});

function applyTheme(theme) {
	if (theme === "light") {
		lightDarkMode.classList.remove("fa-moon");
		lightDarkMode.classList.add("fa-sun");
		iconColor.classList.remove("has-text-link");
		iconColor.classList.add("has-text-warning");
		titleColor.classList.remove("has-text-warning");
		titleColor.classList.add("has-text-link");
		dropdownColor.classList.remove("is-warning");
		dropdownColor.classList.add("is-link");
		document.documentElement.setAttribute("data-theme", "light");
	} else {
		lightDarkMode.classList.remove("fa-sun");
		lightDarkMode.classList.add("fa-moon");
		iconColor.classList.remove("has-text-warning");
		iconColor.classList.add("has-text-link");
		titleColor.classList.remove("has-text-link");
		titleColor.classList.add("has-text-warning");
		dropdownColor.classList.remove("is-link");
		dropdownColor.classList.add("is-warning");
		document.documentElement.setAttribute("data-theme", "dark");
	}
}

chrome.storage.local.get(
	["volumeSlider", "bassSlider", "midSlider", "trebleSlider", "isOn", "theme"],
	(result) => {
		if (result.theme !== undefined) applyTheme(result.theme);
		if (result.volumeSlider !== undefined)
			volumeSlider.value = result.volumeSlider;
		if (result.bassSlider !== undefined) bassSlider.value = result.bassSlider;
		if (result.midSlider !== undefined) midSlider.value = result.midSlider;
		if (result.trebleSlider !== undefined)
			trebleSlider.value = result.trebleSlider;

		// restore the toggle switch UI
		if (result.isOn !== undefined) {
			const toggleSwitch = document.getElementById("switchModeIcon");
			const toggleSwitchColor = document.getElementById("iconSwitchColor");

			if (result.isOn) {
				toggleSwitch.classList.replace("fa-toggle-off", "fa-toggle-on");
				toggleSwitchColor.classList.replace(
					"has-text-grey",
					"has-text-success",
				);
			}
		}
	},
);
