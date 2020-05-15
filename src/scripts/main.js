$(document).ready(() => {
	// create_thumbnail(Array.from(document.querySelectorAll(".doc-page")));
	
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

	// Toolbar:
	$(".toolbar-item").on("mouseover", event => {
		const textbox = document.getElementById("toolbar-highlight-text");
		textbox.textContent = event.target.getAttribute("data-tool");
		document.getElementById("toolbar-highlight").style.width = (textbox.offsetWidth + 1) + "px";
		$(textbox).finish().animate({ color: "transparent" }, 150).animate({ color: "black" }, 200);
	});
	$("#toolbar").on("mouseout", () => {
		const textbox = document.getElementById("toolbar-highlight-text");
		textbox.textContent = document.querySelector(".toolbar-active").getAttribute("data-tool");
		document.getElementById("toolbar-highlight").style.width = (textbox.offsetWidth + 1) + "px";
	});
	$(".toolbar-item").on("click", event => {
		$(".toolbar-active").removeClass("toolbar-active");
		event.target.classList.add("toolbar-active");
		const animation_time = 300;
		$('.toolarea').finish().animate({ opacity: 0 }, animation_time);
		$("#toolarea-" + event.target.getAttribute("data-tool-short")).finish().delay(animation_time).animate({ opacity: 1 }, animation_time);
	});

	// Show/Change the page-settings:
	document.querySelector("#toolarea-pageSelection > select").addEventListener("change", event => {
		const page_nbr = Number(event.target.value);
		change_page_settings(page_nbr);
	});
	function change_page_settings(page_nbr) {

		const animation_time = 300;
		$('.toolarea-page').finish().animate({ opacity: 0 }, animation_time);
		$("#toolarea-page_" + page_nbr).finish().delay(animation_time).animate({ opacity: 1 }, animation_time);
	}

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

	// MSO functionality:
	$(".toolarea-mso select").on("change", event => {
		const mso_title = event.target.parentElement.parentElement.querySelector("h4").textContent;
		const $mso = $(`._idGenMSO[data-mso_title="${mso_title}"]`);
		$mso.children("._idGenCurrentState").removeClass("_idGenCurrentState");
		$mso.children(`[data-idgenobjectstate="${event.target.value}"]`).removeClass("_idGenStateHide").addClass("_idGenCurrentState");
		console.log( event.target.value );
		
	});
});

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