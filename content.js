if (window.__audioMasterInjected) {
	console.log("Already injected");
} else {
	window.__audioMasterInjected = true;

	let audioCtx;
	let gainNode;

	function initAudio() {
		const video = document.querySelector("video");
		if (!video) {
			requestAnimationFrame(initAudio);
			return;
		}

		audioCtx = new AudioContext();

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

		source.connect(gainNode).connect(audioCtx.destination);

		console.log("Audio Master initialized");
	}

	initAudio();

	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "SET_VOLUME" && gainNode) {
			gainNode.gain.value = msg.value;
		}
	});
}
