const button = document.getElementById("run");
const duration = document.getElementById("duration");
const delay = document.getElementById("delay");
const cubicBezier = document.getElementById("cubic-bezier");

const errorContainer = document.getElementById("error");

const heightContainer = document.getElementById("height");
const heightButton = document.getElementById("heightButton");

let boolHeight = false;

window.addEventListener("load", async () => {
	try {
		const durationBuffer = await browser.storage.local.get("duration");
		duration.value = durationBuffer.duration;

		const delayBuffer = await browser.storage.local.get("delay");
		delay.value = delayBuffer.delay;

		const cubicBezierBuffer = await browser.storage.local.get("cubicBezier");
		cubicBezier.value = cubicBezierBuffer.cubicBezier;
	} catch (error) {
		console.log(error);
	}
})


heightButton.addEventListener('click',async () => {
	const tabs = await browser.tabs.query({"currentWindow": true, "active": true});
	const msg = await browser.tabs.sendMessage(tabs[0].id, {updateHeightPopUp: true});
	heightContainer.innerHTML = `Hauteur : ${msg.height}px`;
	heightContainer.innerHTML += "<br>"
	boolHeight = true;
})




button.addEventListener("click", () => {
	errorContainer.innerHTML = "";
	if (checkDuration() && checkDelay() && checkBezier() && checkHeight()) {
		sendParams();
	}
})

async function sendParams() {
	try {
		const tabs = await browser.tabs.query({"currentWindow": true, "active": true});
		const msg = await browser.tabs.sendMessage(tabs[0].id, {
			"duration": `${duration.value}`,
			"delay": `${delay.value}`,
			"cubicBezier": `${cubicBezier.value}`,
			init: true
		});

		let contentToStore = {};
		contentToStore["duration"] = duration.value;
		contentToStore["delay"] = delay.value;
		contentToStore["cubicBezier"] = cubicBezier.value;

		browser.storage.local.set(contentToStore);

		window.close();
	} catch (error) {
		console.log(error)
	}
}

function checkDuration() {
	let bool = true;
	if (duration.value < 100) {
		errorContainer.innerHTML += "Duration too short. Minimum value is 100ms !"
		errorContainer.innerHTML += "<br>"

		bool = false;
	}
	if (!Number.isInteger(parseInt(duration.value))) {
		errorContainer.innerHTML += 'Duration is not an integer !';
		errorContainer.innerHTML += "<br>"
		bool = false;
	}
	return bool;
}

function checkDelay() {
	let bool = true;
	if (delay.value < 0) {
		errorContainer.innerHTML += "Delay can't be lower than 0 !"
		errorContainer.innerHTML += "<br>"
		bool = false;
	}
	if (!Number.isInteger(parseInt(delay.value))) {
		errorContainer.innerHTML += "Delay is not an integer !";
		errorContainer.innerHTML += "<br>"
		bool = false;
	}
	return bool;
}

function checkBezier() {
	let bool = true;
	if (cubicBezier.value.split(',').length != 4) {
		errorContainer.innerHTML += "Cubic Bezier values has to be separated by ',' !"
		errorContainer.innerHTML += "<br>"
		bool = false;
	}
	if (cubicBezier.value.length < 7) {
		errorContainer.innerHTML += "Cubic Bezier has missing values !"
		errorContainer.innerHTML += "<br>"
		bool = false;
	}

	return bool;
}

function checkHeight() {
	let bool = true;
	if (!boolHeight) {
		errorContainer.innerHTML += "You must update height with the button"
		errorContainer.innerHTML += "<br>"

		bool = false;
	}
	return bool;
}
