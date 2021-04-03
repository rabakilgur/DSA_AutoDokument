const export_version = "0.2";

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
				$(`.${editclassname}`).text(this.textContent);
			});
		}
	});

	// Scale the pages on resize:
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

	// Nothing here yet...

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
	$("#toolarea-edit").append('<button type="button" id="toggle_edit_mode">Bearbeitsmodus umschalten</button><br>');
	$("#toggle_edit_mode").on("click",() => {
		$('body').toggleClass("edit-mode");
	});

	// --------------- IMPORTIEREN / EXPORTIEREN: ---------------

	function camelize(str) {
		return str
			.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
			.replace(/\s/g, '');
	}

	// Export:
	$("#toolarea-export").append('<a type="button" id="export_btn">Export</a><br>');
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
			hero_json["fields"][[...this.classList].find(el => el.startsWith("Edit-"))] = $(this).text();
		});
		let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hero_json));

		// Make it downloadable:
		this.setAttribute("href", "data:"+data);
		let time_string = `${export_time.getFullYear()}${export_time.getMonth()}${export_time.getDate()}-${export_time.getHours()}${export_time.getMinutes()}${export_time.getSeconds()}`;
		this.setAttribute("download", `Heldenexport_${camelize(hero_json["hero_name"])}_${time_string}.json`);
	});

	// Import:
	$("#toolarea-export").append('<input type="file" id="selectFiles" value="Import" accept="json" /><br>');
	$("#toolarea-export").append('<button type="button" id="import_btn">Import</button>');
	$("#import_btn").on("click", () => {
		// ToDo: Import

		// Fetch file:
		let file = $('#selectFiles')[0].files;
		if (file.length <= 0) return false;
		// ToDo: Show name of the hero and time of export

		// Read and parse file to JSON:
		let fr = new FileReader();
		let result;
		let hero_json;
		fr.onload = (e) => {
			result = JSON.parse(fr.result);
			// console.log("result", result);
			for (let key in result.fields) {
				console.log(key, result.fields[key]);
				$(`.${key}`).html(result.fields[key]);
			}
		}
		fr.readAsText(file.item(0));

		// version check
		// import JSON
		// change JSON to newer version
		// apply to document

	});

	// --------------- GENERELLE EINSTELLUNGEN: ---------------

	// Nothing here yet...

	// --------------- EXPERIMENTELLE EINSTELLUNGEN: ---------------

	// Toggle dark mode:
	$("#toolarea-experimentalSettings").append('<button type="button" id="toggle_dark_mode">Dark Mode</button><br>');
	$("#toggle_dark_mode").on("click",() => {
		$('body').toggleClass("dark-mode");
	});
	// Create thumbnail images:
	$("#toolarea-experimentalSettings").append('<button type="button" id="create_thumbnails">Thumbnail erstellen</button>');
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
