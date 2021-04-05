const export_version = "1.1";

function set_startup_loader(value) {
	document.querySelector('#startup-loader .startup-mask')?.style.setProperty('--app-loaded', value);
}
function inc_startup_loader() {
	const MASK = document.querySelector('#startup-loader .startup-mask');
	const cur_state = Number(MASK?.style.getPropertyValue('--app-loaded'));
	const new_state = Math.min((cur_state + 1) / 2, cur_state + 0.2);
	MASK?.style.setProperty('--app-loaded', new_state);
}
let startup_interval;


$(document).ready(() => {
	$('body').addClass("edit-mode");

	setTimeout(() => inc_startup_loader(), 100);
	startup_interval = setInterval(() => inc_startup_loader(), 800);

	/*$(".doc-page").each((index, page) => {
		console.log("creating thumbnail");
		domtoimage.toJpeg(page, { quality: 0.5 })
			.then(function (dataUrl) {
				const img = new Image();
				img.src = dataUrl;
				document.getElementById("thumbnail-" + (index + 1)).style.backgroundImage = "url(" + img.src + ")";
			})
			.catch(error => { console.error("Error while creating thumbnail " + (index + 1), error); });
	});*/

	/*
	domtoimage.toPng(node)
		.then(function (dataUrl) {
			var img = new Image();
			img.src = dataUrl;
			document.getElementById("thumbnail-box").appendChild(img);
		})
		.catch(error => { console.error("Error while creating image!", error); });
	*/

	// ============================== ALGEMEINES SETUP: ==============================

	// Toolbar:
	const tooltip_textbox = document.getElementById("toolbar-highlight-text");
	$(".toolbar-item").on("mouseover", event => {
		const old_text = tooltip_textbox.textContent;
		const new_text = event.target.getAttribute("data-tool");
		tooltip_textbox.textContent = new_text;
		document.getElementById("toolbar-highlight").style.width = (tooltip_textbox.offsetWidth + 1) + "px";
		tooltip_textbox.textContent = old_text;
		setTimeout(() => {
			tooltip_textbox.textContent = new_text;
		}, 150);
		$(tooltip_textbox).finish().animate({ color: "transparent" }, 150).animate({ color: "black" }, 200);
	});
	$("#toolbar").on("mouseleave", () => {
		tooltip_textbox.textContent = document.querySelector(".toolbar-active").getAttribute("data-tool");
		document.getElementById("toolbar-highlight").style.width = (tooltip_textbox.offsetWidth + 1) + "px";
	});
	$(".toolbar-item").on("click", event => {
		$(".toolbar-active").removeClass("toolbar-active");
		event.target.classList.add("toolbar-active");
		const animation_time = 300;
		$('.toolarea').finish().animate({ opacity: 0 }, animation_time);
		$("#toolarea-" + event.target.getAttribute("data-tool-short")).finish().delay(animation_time).animate({ opacity: 1 }, animation_time);
	});

	// Show/Change the page-settings:
	let current_page_nbr = 1;
	$("#toolarea-pageSelection > select").on('selectmenuchange change', async (event) => {
		const page_nbr = Number(event.target.value);
		change_page_settings(page_nbr);
	});
	async function change_page_settings(page_nbr) {
		const animation_time = 300;
		const default_top = 100;
		let animation_travel = 25;
		if (current_page_nbr > page_nbr) animation_travel = 0 - animation_travel;
		$("#toolarea-page_" + current_page_nbr)
				.finish()
				.animate({ opacity: 0, top: default_top - animation_travel }, animation_time)
		$("#toolarea-page_" + page_nbr)
				.finish()
				.css({ top: default_top + animation_travel })
				.delay(0.67 * animation_time)
				.animate({ opacity: 1, top: default_top }, animation_time);
		current_page_nbr = page_nbr;
	}

	// Edit all equivalent edit-fields together on focus loss:
	$('div[class^="Edit-"]').each(function() {
		const editclassname = [...this.classList].find(el => el.startsWith("Edit-"));
		if ($(`.${editclassname}`).length > 1) {
			$(this).on("focusout" ,() => {
				// $(`.${editclassname}`).text(this.textContent);
				$(`.${editclassname}`).html($(this).html());
			});
		}
	});

	// Activate the zoom functionality for the buttons:
	const ZOOM_LEVELS = {
		"25":  0.278,
		"50":  0.5,
		"75":  0.73,
		"100": 1,
		"125": 1.225,
		"150": 1.445,
		"175": 1.67,
		"200": 2,
		"225": 2.225,
		"250": 2.445,
		"275": 2.67,
		"300": 3,
		"325": 3.225,
		"350": 3.445,
		"375": 3.67,
		"400": 4
	};
	let zoom_cur = 150;
	function change_zoom(zoom_new, $label) {
		$label.text(zoom_new);
		$(".doc-page").css({ zoom: ZOOM_LEVELS[String(zoom_new)] });
		zoom_cur = zoom_new;
	}
	change_zoom(150, $('#btns-zoom > .btn-group-label'));  // set the initial zoom level
	$('#btns-zoom > .btn-minus').on("click", function() {
		change_zoom(Math.max(zoom_cur - 25, 25), $(this).next());
	});
	$('#btns-zoom > .btn-plus').on("click", function() {
		change_zoom(Math.min(zoom_cur + 25, 400), $(this).prev());
	});

	// Scale the pages on resize:
	/*
	$(window).on("resize", () => {
		const box_width = document.getElementById("document-box").offsetWidth;
		const page_width = document.querySelector(".doc-page-rotated").offsetWidth;
		if ((box_width / page_width) < 1.05) {
			const zoom_factor = Math.round((box_width / page_width) * 100 - 5) / 100;
			$(".doc-page").css({ zoom: zoom_factor });
		} else {
			$(".doc-page").css({ zoom: 1 });
		}
	}).trigger("resize");
	*/



	// ============================== TOOLBAR: ==============================

	// Add functionality to the toggle/hide buttons:
	$('#document-box').prepend('<div id="toggle-thumbnails" class="toggle-left"></div><div id="toggle-tools" class="toggle-right"></div>');
	$('#toggle-thumbnails').on("click", function() {
		$(this).toggleClass("toggle-right").toggleClass("toggle-left");
		$('#main-frame').toggleClass("no-thumbnails");
		$(window).trigger("resize");
	});
	$('#toggle-tools').on("click", function() {
		$(this).toggleClass("toggle-right").toggleClass("toggle-left");
		$('#main-frame').toggleClass("no-tools");
		$(window).trigger("resize");
	});

	// Show the toogles when hovering over the corresponding area:
	$('#thumbnail-box').on("mouseenter", () => {
		$('#toggle-thumbnails').addClass("toggle-shown");
	});
	$('#thumbnail-box').on("mouseleave", () => {
		$('#toggle-thumbnails').removeClass("toggle-shown");
	});
	$('#tool-box').on("mouseenter", () => {
		$('#toggle-tools').addClass("toggle-shown");
	});
	$('#tool-box').on("mouseleave", () => {
		$('#toggle-tools').removeClass("toggle-shown");
	});

	// Switch the toolarea when scrolling:
	$('#document-box').on("scroll", async function() {
		let section_scroll_positions = [];
		$('#document-box > div > section').each((i, el) => {
			if ($(el).offset().top > ($(window).height() / 4)) {
				const $PAGE_SELECT = $('#toolarea-pageSelection > select');
				if ($PAGE_SELECT[0].selectedIndex !== (i - 1)) $PAGE_SELECT.val(i).selectmenu('refresh').trigger("change");
				return false;
			}
		});
	});

	// --------------- DOKUMENTEN-EINSTELLUNGEN: ---------------

	// Toggle mason mode:
	$("#toolarea-documentSettings").append(`
		<h4>Textfeld-Font ändern</h4>
		<p><a class="btn" id="toggle_font_mode_mason">Mason-Font umschalten</a></p>
		<p><i>Hiermit kann der Font der in den Textfeldern (den im Bearbeitsmodus farblich hervorgehobenen Feldern) auf dem Dokument benutzt wird, zu "Mason" geändert werden. Mason ist auch der Font, welcher für die Überschriften benutzt wird.</i></p>
	`);
	$("#toggle_font_mode_mason").on("click",() => {
		$('body').toggleClass("font-mode-mason");
	});

	// --------------- SEITEN EINSTELLUNGEN: ---------------

	// MSO functionality:
	$(".toolarea-mso select").on('selectmenuchange change', async (event) => {
		const mso_title = event.target.parentElement.parentElement.querySelector("h4").textContent;
		const $mso = $(`._idGenMSO[data-mso_title="${mso_title}"]`);
		$mso.children("._idGenCurrentState").removeClass("_idGenCurrentState");
		$mso.children(`[data-idgenobjectstate="${event.target.value}"]`).removeClass("_idGenStateHide").addClass("_idGenCurrentState");
	});

	// --------------- BEARBEITEN: ---------------

	// Toggle edit mode:
	$("#toolarea-edit").append(`
		<h4>Bearbeitungsmodus</h4>
		<p><a class="btn" id="toggle_edit_mode">Bearbeitungsmodus umschalten</a></p>
		<p><i>Dieser Modus hebt alle ausfüllbaren Felder farblich hervor und macht sie bearbeitbar. Außerdem werden alle Felder, dessen Inhalt sich automatisch anhand von anderen Felder berechnet, ebenfalls farblich hervorgehoben.</i></p>
	`);
	$("#toggle_edit_mode").on("click",() => {
		$('body').toggleClass("edit-mode");
	});

	// Toggle edit-all mode:
	$("#toolarea-edit").append(`
		<br>
		<p><a class="btn" id="toggle_edit_all_mode">Super-Bearbeitungsmodus umschalten</a></p>
		<p><i>Der Super-Bearbeitungsmodus macht JEDEN Text auf dem Dokument bearbeitbar.<br><b>Vorsicht:</b> Änderungen außerhalb von den farbigen Textfeldern werden nicht abgespeichert/exportiert.</i></p>
	`);
	$("#toggle_edit_all_mode").on("click",() => {
		$('body').toggleClass("edit-all-mode");
		if ($('#document-box').attr("contenteditable")) {
			$('#document-box').removeAttr("contenteditable")
		} else {
			$('#document-box').attr("contenteditable", "true")
		}
	});

	// --------------- IMPORTIEREN / EXPORTIEREN: ---------------

	function camelize(str) {
		return str
			.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
			.replace(/\s/g, '');
	}

	// Export:
	$("#toolarea-export").append(`
		<h4>Export</h4>
		<p><a class="btn" id="export_btn">Export</a></p>
	`);
	$("#export_btn").on("click",function () {
		// Set export version and date:
		const export_time = new Date();
		let hero_json = {
			"export_version": export_version,
			"export_time": export_time,
			"hero_name": $(".Edit-Name")[0].textContent,
			"fields": {}
		};

		// Generate JSON:
		$('div[class^="Edit-"]').each(function() {
			hero_json["fields"][[...this.classList].find(el => el.startsWith("Edit-")).substr(5)] = $(this).html();
		});
		let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hero_json));

		// Make it downloadable:
		this.setAttribute("href", "data:"+data);
		let time_string = `${export_time.getFullYear()}${export_time.getMonth()}${export_time.getDate()}-${export_time.getHours()}${export_time.getMinutes()}${export_time.getSeconds()}`;
		this.setAttribute("download", `Heldenexport_${camelize(hero_json["hero_name"])}_${time_string}.json`);
	});

	// Import:
	$("#toolarea-export").append(`
		<hr />
		<h4>Import</h4>
		<p><input class="btn" type="file" id="import_select_files" value="Import" accept="json" /></p>
		<p id="import-info"></p>
		<p><a class="btn d-none" id="import_btn">Import</a></p>
	`);
	let imported_json;
	$("#import_select_files").on("change", function(e) {
		if (this.files.length <= 0) return false;
		// Read and parse file to JSON:
		let fr = new FileReader();
		fr.onload = (e) => {
			const result = JSON.parse(fr.result);
			imported_json = result;
			const $import_info = $('#import-info');
			$import_info.empty();
			if (result.hero_name) $import_info.append(`<div><b>Name des Helden:</b> ${result.hero_name}</div>`);
			if (result.export_time) {
				console.log(result.export_time);
				export_time = new Date(result.export_time);
				const time_string = `${export_time.getDate()}.${export_time.getMonth()}.${export_time.getFullYear()} ${export_time.getHours()}:${export_time.getMinutes()}:${export_time.getSeconds()}`;
				$import_info.append(`<div><b>Zeit des Exportes:</b> ${time_string}</div>`);
			}
			if (result.export_version) $import_info.append(`<div><b>Export-Version:</b> ${result.export_version}</div>`);
			$('#import_btn').removeClass("d-none");
		}
		fr.readAsText(this.files.item(0));
	});
	$("#import_btn").on("click", () => {
		if (imported_json) {
			for (let key in imported_json.fields) {
				$(`.Edit-${key}`).html(imported_json.fields[key]).trigger("recalc");
			}
		} else {
			console.log("Select a file first");
			// ToDo: Show an error popup
		}

		// version check
		// import JSON
		// change JSON to newer version
		// apply to document

	});

	// --------------- GENERELLE EINSTELLUNGEN: ---------------

	// Nothing here yet...

	// --------------- EXPERIMENTELLE EINSTELLUNGEN: ---------------

	// Toggle dark mode:
	$("#toolarea-experimentalSettings").append(`
		<h4>Dark Mode</h4>
		<p><a class="btn" id="toggle_dark_mode">Dark Mode umschalten</a></p>
		<p><i>Der Dark Mode ist noch ziemlich simpel und nicht ausgereift. Außerdem wird er aktuell noch nicht abgespeichert.</i></p>
	`);
	$("#toggle_dark_mode").on("click",() => {
		$('body').toggleClass("dark-mode");
	});
	// Create thumbnail images:
	$("#toolarea-experimentalSettings").append(`
		<hr />
		<h4>Seiten-Thumbnails erstellen</h4>
		<p><a class="btn" id="create_thumbnails">Thumbnail erstellen</a></p>
		<p><i>Diese Funktion ist aktuell ausgelagert, da sie sehr lange dauert und so extrem viel Leistung zieht, dass sie die gesamte Seite praktisch unbenutzbar macht.</i></p>
	`);
	$("#create_thumbnails").on("click",() => {
		create_all_thumbnails()
	});

});

async function create_all_thumbnails() {
	// ToDo: Show progress-bar
	// ToDo: Make input field non-editable (transparent instead of yellow)
	let edit_mode_active = $('body').hasClass("edit-mode");
	// if (edit_mode_active) $('body').removeClass("edit-mode");
	create_thumbnail(Array.from(document.querySelectorAll(".doc-page")));
	// if (edit_mode_active) $('body').addClass("edit-mode");
}

function create_progress_bar(steps = 100, enable_edit = false) {

}
function increase_progress_bar(steps = 1) {

}

async function create_thumbnail(pages) {
	console.log("creating thumbnail");
	const page = pages.shift();
	domtoimage.toJpeg(page, { quality: 0.5, bgcolor: "#6A5037", style: { "zoom": 1 } })
		.then(function (dataUrl) {
			const img = new Image();
			img.src = dataUrl;
			document.getElementById("thumbnail-" + page.id.substr(15)).style.backgroundImage = "url(" + img.src + ")";
			if (pages.length > 0) create_thumbnail(pages);
		})
		.catch(error => { console.error("Error while creating image!", error); });
}

async function scroll_to_page(id) {
	$("#document-box").animate({
		scrollTop: $("#document-box").scrollTop() + $(id).offset().top - 8
	}, 600);
}

function fill_demo() {
	$('div[class^="Edit-"]').each(function() {
		if ($(this).height() < 20 || $(this).hasClass("Edit-WS")) {
			$(this).text("10");
		} else {
			$(this).html("Lorem<div>Ipsum</div><div>dolor</div><div>sit</div><div>amet</div>");
		}
		$(this).trigger("input");
	});
}

window.addEventListener('load', function () {
	clearInterval(startup_interval);
	set_startup_loader(1.1);
	$('#main-frame').css({ opacity: 1 });
	$('#startup-loader').addClass("startup-done");
	console.log("%cStartup is done", "background: #D4EDDA; color: #155724; border: 1px solid #C3E6CB; border-radius: 4px; padding: .75rem 1.25rem; font-size: 150%;")
});
