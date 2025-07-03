const families = [];

function createFallback(fonts, fallback) {
	let text = "";

	for (let i = 0; i < fonts.length; i++) {
		text += "    <alias>\n" +
			"        <family>" + fonts[i] + "</family>\n" +
			"        <prefer><family>" + fallback + "</family></prefer>\n" +
			"    </alias>";

		if (i < fonts.length - 1) {
			text += "\n";
		}
	}

	return text;
}

const text = createFallback(families, "[fallback]");

console.log(text);
