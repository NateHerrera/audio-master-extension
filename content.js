if (window.__audioMasterInjected) {
	//console.log("Already injected");
} else {
	window.__audioMasterInjected = true;

	let audioCtx;
	let gainNode;
	let source;
	let lowShelfBiquadFilter;
	let highShelfBiquadFilter;
	let midShelfBiquadFilter;

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

		// video source node
		source = audioCtx.createMediaElementSource(video);

		// gain node
		gainNode = audioCtx.createGain();
		gainNode.gain.value = 1.0;

		// low shelf (bass)
		lowShelfBiquadFilter = audioCtx.createBiquadFilter();
		lowShelfBiquadFilter.type = "lowshelf";
		lowShelfBiquadFilter.frequency.setValueAtTime(100, audioCtx.currentTime); // 100 Hz/Frequency
		lowShelfBiquadFilter.gain.value = 0;

		// mid shelf (mids)
		midShelfBiquadFilter = audioCtx.createBiquadFilter();
		midShelfBiquadFilter.type = "peaking";
		midShelfBiquadFilter.frequency.setValueAtTime(2500, audioCtx.currentTime); // 2.5k Hz/Frequency
		midShelfBiquadFilter.gain.value = 0;

		// top shelf (treble)
		highShelfBiquadFilter = audioCtx.createBiquadFilter();
		highShelfBiquadFilter.type = "highshelf";
		highShelfBiquadFilter.frequency.setValueAtTime(10000, audioCtx.currentTime); // 10k Hz/Frequency
		highShelfBiquadFilter.gain.value = 0;

		// connect nodes: source -> lowShelf(bass) -> midShelf(mids) -> highShelf(treble) -> gain -> destination
		source.connect(lowShelfBiquadFilter);
		lowShelfBiquadFilter.connect(midShelfBiquadFilter);
		midShelfBiquadFilter.connect(highShelfBiquadFilter);
		highShelfBiquadFilter.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		console.log("Audio Master initialized");
	}

	initAudio();

	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "SET_VOLUME" && gainNode) {
			gainNode.gain.value = msg.value * 2;
		}
		if (msg.type === "SET_BASS" && lowShelfBiquadFilter) {
			lowShelfBiquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
		if (msg.type === "SET_MID" && midShelfBiquadFilter) {
			midShelfBiquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
		if (msg.type === "SET_TREBLE" && highShelfBiquadFilter) {
			highShelfBiquadFilter.gain.value = (msg.value - 0.5) * 25;
		}
		if (msg.type === "TOGGLE_EXTENSION") {
			if (msg.isOn) {
				source.disconnect();
				source.connect(lowShelfBiquadFilter);
			} else {
				source.disconnect();
				source.connect(audioCtx.destination);
			}
		}
	});
}
