if (window.__audioMasterInjected) {
	//console.log("Already injected");
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
		biquadFilter = audioCtx.createBiquadFilter();
		biquadFilter.type = "lowshelf";
		biquadFilter.frequency.setValueAtTime(200, audioCtx.currentTime);
		biquadFilter.gain.value = 0; // neutral
		gainNode.gain.value = 1.0;

		// connect nodes: source -> biquad -> gain -> destination
		source.connect(biquadFilter);
		biquadFilter.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		console.log("Audio Master initialized");
	}

	initAudio();

	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "SET_VOLUME" && gainNode) {
			gainNode.gain.value = msg.value;
		}
		if (msg.type === "SET_BASS" && biquadFilter) {
			biquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
	});
}
