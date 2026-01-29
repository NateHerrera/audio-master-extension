if (window.__audioMasterInjected) {
	console.log("Already injected");
} else {
	window.__audioMasterInjected = true;

	let audioCtx;
	let gainNode;
	let biquadFilter;

	function initAudio() {
		const video = document.querySelector("video");
		if (!video) {
			requestAnimationFrame(initAudio);
			return;
		}

		audioCtx = new AudioContext();
		biquadFilter = audioCtx.createBiquadFilter();

		document.addEventListener(
			"click",
			() => {
				if (audioCtx.state === "suspended") {
					audioCtx.resume();
				}
			},
			{ once: true },
		);

		const source = audioCtx.createMediaElementSource(video);
		gainNode = audioCtx.createGain();
		gainNode.gain.value = 1.0;

		console.log("Audio Master initialized");
	}

	initAudio();

	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "SET_VOLUME" && gainNode) {
			gainNode.gain.value = msg.value;
		}
	});
}
