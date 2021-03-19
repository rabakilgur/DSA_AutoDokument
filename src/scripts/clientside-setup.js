/*
*  This file is used to change the documents DOM in preparation for all
*  the other functions.
*/

$(document).ready(() => {
	$("#document-box > div > section").each((index, section) => {
		// Rotate the landscape pages:
		if (!$(section).children("div:first-child").css("transform").startsWith("matrix(1,")) {
			const width = $(section).width();
			$(section).width($(section).height());
			$(section).height(width);
			section.classList.add("doc-page-rotated");
			document.getElementById("thumbnail-" + (index + 1)).classList.add("thumbnail-rotated");
		}
		// Add everything from the sections to another div:
		$(section)
			.append(`<div id="doc-page-wrapper-${index + 1}" class="doc-page-wrapper"></div>`)
			.children(":not(.doc-page-wrapper)")
			.appendTo(`#doc-page-wrapper-${index + 1}`);
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
		mso_wrapper.classList = "toolare-mso_wrapper";
		$(page).find("._idGenMSO").each((mso_i, mso) => {
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
