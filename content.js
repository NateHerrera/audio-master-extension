if (window.__audioMasterInjected) {
	//console.log("Already injected");
} else {
	window.__audioMasterInjected = true;

	let audioCtx;
	let gainNode;
	let lowShelfBiquadFilter;
	let highShelfBiquadFilter;

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
			{ once: true }
		);

		const source = audioCtx.createMediaElementSource(video);
		gainNode = audioCtx.createGain();
		gainNode.gain.value = 1.0;
		lowShelfBiquadFilter = audioCtx.createBiquadFilter();
		lowShelfBiquadFilter.type = "lowshelf";
		lowShelfBiquadFilter.frequency.setValueAtTime(135, audioCtx.currentTime); // 135 Hz/Frequency
		lowShelfBiquadFilter.gain.value = 0;
		highShelfBiquadFilter = audioCtx.createBiquadFilter();
		highShelfBiquadFilter.type = "highshelf";
		highShelfBiquadFilter.frequency.setValueAtTime(6000, audioCtx.currentTime); // 6k Hz/Frequency
		highShelfBiquadFilter.gain.value = 0;

		// connect nodes: source -> lowShelf(bass) -> highShelf(treble) -> gain -> destination
		source.connect(lowShelfBiquadFilter);
		lowShelfBiquadFilter.connect(highShelfBiquadFilter);
		highShelfBiquadFilter.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		console.log("Audio Master initialized");
	}

	initAudio();

	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "SET_VOLUME" && gainNode) {
			gainNode.gain.value = msg.value;
		}
		if (msg.type === "SET_BASS" && lowShelfBiquadFilter) {
			lowShelfBiquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
		if (msg.type === "SET_TREBLE" && highShelfBiquadFilter) {
			highShelfBiquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
	});
}
