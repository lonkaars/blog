{
	let now = Date.now() / 1000;
	document.querySelectorAll("[x-unhide-after]").forEach(el => {
		if (now > el.getAttribute("x-unhide-after"))
			el.classList.remove("hidden");
	});
}

