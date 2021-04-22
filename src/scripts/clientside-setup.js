/*
*  This file is used to change the documents DOM in preparation for all
*  the other functions.
*/

let pages_laoded = 0;

$(document).ready(() => {
	// Create the thumbnails and the page-containers and insert them into the document:
	let thumnails_html = "";
	let pages_html = "";
	let page_selection_html = "";
	let toolarea_pages = "";
	for (let i = 1; i <= PAGES; i++) {
		thumnails_html += `<a id='thumbnail-${i}' onclick="scroll_to_page('#Heldendokument-${i}')"></a>`;
		pages_html += `
			<div id="doc-wrapper-${i}">
				<section id="Heldendokument-${i}" class="doc-page" style="width:595px;height:842px">
					<div id="doc-page-wrapper-${i}" class="doc-page-wrapper" data-include="Heldendokument-${i}.xhtml"></div>
				</section>
			</div>
		`;
		page_selection_html += `<option value='${i}'>Seite ${i}</option>`;
		toolarea_pages += `<div class='toolarea-page' id='toolarea-page_${i}'></div>`;
	}
	$("#thumbnail-innerbox").append(thumnails_html);
	$("#document-box").append(pages_html);
	$("#toolarea-pageSelection select").append(page_selection_html);
	$("#toolarea-pageSettings").append(toolarea_pages);

	// Get the page contents and put them into the page-containers:
	let includes = $('[data-include]')
	$.each(includes, function () {
		let file = '/' + $(this).data('include');
		$.ajax({
			url: file,
			type: "get",
			async: false,
			success: (html) => {
				let $parsed_html = $.parseHTML(html);
				$(this).html($($parsed_html).filter('div[id^="_idContainer"]'));
				$(document).trigger("page_loaded");
			}
		});
	});
});

$(document).on("page_loaded", () => {
	pages_laoded++;
	if (pages_laoded >= PAGES) $(document).trigger("all_pages_loaded");
});

$(document).on("all_pages_loaded", () => {
	// Rotate the landscape pages:
	$("#document-box > div > section > .doc-page-wrapper").each((index, wrapper) => {
		$section = $(wrapper).parent();
		if (!$(wrapper).children("div:first-child").css("transform").startsWith("matrix(1,")) {
			const width = $section.width();
			$section.width($section.height());
			$section.height(width);
			$section[0].classList.add("doc-page-rotated");
			// Also rotate the thumbnail:
			document.getElementById("thumbnail-" + (index + 1)).classList.add("thumbnail-rotated");
		}
	});

	// Make the text boxes editable:
	$('div[class^="Edit-"]')
		.empty()
		.attr("contenteditable", "true")
		.attr("autocomplete", "off")
		.attr("autocorrect", "off")
		.attr("autocapitalize", "off")
		.attr("spellcheck", "false");

	// Delete the useless images in the calc fields:
	$('div[class^="Calc-"]')
		.empty();

	// Scan for MSO:
	$(".doc-page").each((page_i, page) => {
		const mso_wrapper = document.createElement("div");
		mso_wrapper.classList = "toolarea-mso_wrapper";
		const $MSOs = $(page).find("._idGenMSO");
		if ($MSOs.length > 0) {
			$MSOs.each((mso_i, mso) => {
				const mso_box = document.createElement("div");
				mso_box.classList = "toolarea-mso";
				const mso_name = document.createElement("h4");
				const x_elem = $(mso).children('div[class*="MSO-"]')[0];
				let mso_title = `[Unbenannt-${mso_i}]`;
				if (x_elem !== undefined) mso_title = x_elem.classList.value.split(" ").filter(x => x.startsWith("MSO-"))[0].substr(4).replace(/_/g, " ");
				const textnode = document.createTextNode(mso_title);
				const select_box = document.createElement("div");
				select_box.classList = "select-dropdown";
				const select = document.createElement("select");
				$(mso).children().each((state_i, state) => {
					const option = document.createElement("option");
					const option_text = state.getAttribute("data-idgenobjectstate");
					if (option_text !== "X") {
						option.setAttribute("value", option_text);
						const textnode = document.createTextNode(option_text);
						option.appendChild(textnode);
						select.appendChild(option);
					}
				});
				select_box.appendChild(select);
				mso_name.appendChild(textnode);
				mso_box.appendChild(mso_name);
				mso_box.appendChild(select_box);
				mso_wrapper.appendChild(mso_box);
			});
		} else {
			const no_mso_box = document.createElement("div");
			no_mso_box.classList = "toolarea-no_mso";
			mso_wrapper.appendChild(no_mso_box);
		}
		document.getElementById("toolarea-page_" + (page_i + 1)).appendChild(mso_wrapper);
	});

	// Remove the class helper from the MSOs:
	$("._idGenMSO").each((mso_i, mso) => {
		const x_elem = $(mso).children('div[class*="MSO-"]')[0];
		let mso_title = `[Unbenannt-${mso_i}]`;
		if (x_elem !== undefined) {
			mso_title = x_elem.classList.value.split(" ").filter(x => x.startsWith("MSO-"))[0].substr(4).replace(/_/g, " ");
			$(x_elem).remove();
		}
		mso.setAttribute("data-mso_title", mso_title);
	});

	// Make all select dropdowns to jQueryUI selectmenus:
	$('select').selectmenu();

	// Reverse tab order:
	const $edit_fields = $('div[class^="Edit-"]');
	$edit_fields.each((index, item) => {
		$(item).on('keydown', event => {
			if (event.which === 9) {
				event.preventDefault();
				if (event.shiftKey) $edit_fields[Math.min(index + 1, $edit_fields.length - 1)].focus();
				else 				$edit_fields[Math.max(index - 1, 0)].focus();
			}
		});
	});

	// Show the name of the active tool in the toolbar highlight:
	const textbox = document.getElementById("toolbar-highlight-text");
	textbox.textContent = document.querySelector(".toolbar-active").getAttribute("data-tool");
	document.getElementById("toolbar-highlight").style.width = (textbox.offsetWidth + 1) + "px";

	// Show only the active toolarea:
	$(".toolarea").css("opacity", "0");
	$("#toolarea-" + document.querySelector(".toolbar-active").getAttribute("data-tool-short")).css("opacity", "1");

	// Show the page settings for the first page:
	document.getElementById("toolarea-page_1").style.opacity = 1;
});
