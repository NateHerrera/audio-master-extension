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

// light/dark mode colors
document.addEventListener("DOMContentLoaded", () => {
	const lightDarkMode = document.getElementById("lightDarkModeIcon");
	const iconColor = document.getElementById("iconColor");
	const titleColor = document.getElementById("titleColor");
	const dropdownColor = document.getElementById("dropdownColor");

	lightDarkMode.addEventListener("click", () => {
		if (lightDarkMode.classList.contains("fa-moon")) {
			// get rid of the moon icon
			lightDarkMode.classList.remove("fas");
			lightDarkMode.classList.remove("fa-moon");
			// add sun icon
			lightDarkMode.classList.add("fas");
			lightDarkMode.classList.add("fa-sun");
			// change color of the icon
			iconColor.classList.remove("has-text-link");
			iconColor.classList.add("has-text-warning");
			// change color of title
			titleColor.classList.remove("has-text-warning");
			titleColor.classList.add("has-text-link");
			// change color of dropdown
			dropdownColor.classList.remove("is-warning");
			dropdownColor.classList.add("is-link");
			// change theme
			document.documentElement.setAttribute("data-theme", "light");
		} else {
			// get rid of the sun icon
			lightDarkMode.classList.remove("fas");
			lightDarkMode.classList.remove("fa-sun");
			// add moon icon
			lightDarkMode.classList.add("fas");
			lightDarkMode.classList.add("fa-moon");
			// change color of the icon
			iconColor.classList.remove("has-text-warning");
			iconColor.classList.add("has-text-link");
			// change color of title
			titleColor.classList.remove("has-text-link");
			titleColor.classList.add("has-text-warning");
			// change color of dropdown
			dropdownColor.classList.remove("is-link");
			dropdownColor.classList.add("is-warning");
			// change theme
			document.documentElement.setAttribute("data-theme", "dark");
		}
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
		chrome.tabs.sendMessage(tabId, {
			type: "TOGGLE_EXTENSION",
			isOn: toggleSwitch.classList.contains("fa-toggle-on"),
		});
	});
});
