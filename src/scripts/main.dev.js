"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var export_version = "0.1";
$(document).ready(function () {
  $('body').addClass("edit-mode");
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

  var tooltip_textbox = document.getElementById("toolbar-highlight-text");
  $(".toolbar-item").on("mouseover", function (event) {
    var old_text = tooltip_textbox.textContent;
    var new_text = event.target.getAttribute("data-tool");
    tooltip_textbox.textContent = new_text;
    document.getElementById("toolbar-highlight").style.width = tooltip_textbox.offsetWidth + 1 + "px";
    tooltip_textbox.textContent = old_text;
    setTimeout(function () {
      tooltip_textbox.textContent = new_text;
    }, 150);
    $(tooltip_textbox).finish().animate({
      color: "transparent"
    }, 150).animate({
      color: "black"
    }, 200);
  });
  $("#toolbar").on("mouseleave", function () {
    tooltip_textbox.textContent = document.querySelector(".toolbar-active").getAttribute("data-tool");
    document.getElementById("toolbar-highlight").style.width = tooltip_textbox.offsetWidth + 1 + "px";
  });
  $(".toolbar-item").on("click", function (event) {
    $(".toolbar-active").removeClass("toolbar-active");
    event.target.classList.add("toolbar-active");
    var animation_time = 300;
    $('.toolarea').finish().animate({
      opacity: 0
    }, animation_time);
    $("#toolarea-" + event.target.getAttribute("data-tool-short")).finish().delay(animation_time).animate({
      opacity: 1
    }, animation_time);
  }); // Show/Change the page-settings:

  document.querySelector("#toolarea-pageSelection > select").addEventListener("change", function (event) {
    var page_nbr = Number(event.target.value);
    change_page_settings(page_nbr);
  });

  function change_page_settings(page_nbr) {
    var animation_time = 300;
    $('.toolarea-page').finish().animate({
      opacity: 0
    }, animation_time);
    $("#toolarea-page_" + page_nbr).finish().delay(animation_time).animate({
      opacity: 1
    }, animation_time);
  } // Edit all equivalent edit-fields together on focus loss:


  $('div[class^="Edit-"]').each(function () {
    var _this = this;

    var editclassname = _toConsumableArray(this.classList).find(function (el) {
      return el.startsWith("Edit-");
    });

    if ($(".".concat(editclassname)).length > 1) {
      $(this).on("focusout", function () {
        $(".".concat(editclassname)).text(_this.textContent);
      });
    }
  }); // Scale the pages on resize:

  $(window).on("resize", function () {
    var box_width = document.getElementById("document-box").offsetWidth;
    var page_width = document.querySelector(".doc-page-rotated").offsetWidth;

    if (box_width / page_width < 1.05) {
      var zoom_factor = Math.round(box_width / page_width * 100 - 5) / 100;
      $(".doc-page").css({
        zoom: zoom_factor
      });
    } else {
      $(".doc-page").css({
        zoom: 1
      });
    }
  }).trigger("resize"); // ============================== TOOLBAR: ==============================
  // Add functionality to the toggle/hide buttons:

  $('#document-box').prepend('<div id="toggle-thumbnails" class="toggle-left"></div><div id="toggle-tools" class="toggle-right"></div>');
  $('#toggle-thumbnails').on("click", function () {
    $(this).toggleClass("toggle-right").toggleClass("toggle-left");
    $('#main-frame').toggleClass("no-thumbnails");
    $(window).trigger("resize");
  });
  $('#toggle-tools').on("click", function () {
    $(this).toggleClass("toggle-right").toggleClass("toggle-left");
    $('#main-frame').toggleClass("no-tools");
    $(window).trigger("resize");
  }); // Show the toogles when hovering over the corresponding area:

  $('#thumbnail-box').on("mouseenter", function () {
    $('#toggle-thumbnails').addClass("toggle-shown");
  });
  $('#thumbnail-box').on("mouseleave", function () {
    $('#toggle-thumbnails').removeClass("toggle-shown");
  });
  $('#tool-box').on("mouseenter", function () {
    $('#toggle-tools').addClass("toggle-shown");
  });
  $('#tool-box').on("mouseleave", function () {
    $('#toggle-tools').removeClass("toggle-shown");
  }); // --------------- DOKUMENTEN-EINSTELLUNGEN: ---------------
  // Nothing here yet...
  // --------------- SEITEN EINSTELLUNGEN: ---------------
  // MSO functionality:

  $(".toolarea-mso select").on("change", function (event) {
    var mso_title = event.target.parentElement.parentElement.querySelector("h4").textContent;
    var $mso = $("._idGenMSO[data-mso_title=\"".concat(mso_title, "\"]"));
    $mso.children("._idGenCurrentState").removeClass("_idGenCurrentState");
    $mso.children("[data-idgenobjectstate=\"".concat(event.target.value, "\"]")).removeClass("_idGenStateHide").addClass("_idGenCurrentState");
  }); // --------------- BEARBEITEN: ---------------
  // Toggle dark mode:

  $("#toolarea-edit").append('<button type="button" id="toggle_edit_mode">Bearbeitsmodus umschalten</button><br>');
  $("#toggle_edit_mode").on("click", function () {
    $('body').toggleClass("edit-mode");
  }); // --------------- IMPORTIEREN / EXPORTIEREN: ---------------
  // Import / Export:

  $("#toolarea-export").append('<a type="button" id="export_btn">Export</a><br><button type="button" id="import_btn">Import</button>');
  $("#export_btn").on("click", function () {
    // set export version
    var hero_json = {
      "export_version": export_version
    }; // generate json

    $('div[class^="Edit-"]').each(function () {
      hero_json[_toConsumableArray(this.classList).find(function (el) {
        return el.startsWith("Edit-");
      })] = $(this).text();
    });
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hero_json)); // make it downloadable

    this.setAttribute("href", "data:" + data);
    this.setAttribute("download", "hero_" + export_version + ".json");
  });
  $("#import_btn").on("click", function () {// ToDo: Import
    // 1. version check
    // 2. import JSON
    // 2.1 change JSON to newer version
    // 3. apply to document
  }); // --------------- GENERELLE EINSTELLUNGEN: ---------------
  // Nothing here yet...
  // --------------- EXPERIMENTELLE EINSTELLUNGEN: ---------------
  // Toggle dark mode:

  $("#toolarea-experimentalSettings").append('<button type="button" id="toggle_dark_mode">Dark Mode</button><br>');
  $("#toggle_dark_mode").on("click", function () {
    $('body').toggleClass("dark-mode");
  }); // Create thumbnail images:

  $("#toolarea-experimentalSettings").append('<button type="button" id="create_thumbnails">Thumbnail erstellen</button>');
  $("#create_thumbnails").on("click", function () {
    create_all_thumbnails();
  });
});

function create_all_thumbnails() {
  var edit_mode_active;
  return regeneratorRuntime.async(function create_all_thumbnails$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // ToDo: Show progress-bar
          // ToDo: Make input field non-editable (transparent instead of yellow)
          edit_mode_active = $('body').hasClass("edit-mode");
          if (edit_mode_active) $('body').removeClass("edit-mode");
          create_thumbnail(Array.from(document.querySelectorAll(".doc-page"))).then(function () {
            console.log("done");
          });
          console.log("done?");
          if (edit_mode_active) $('body').addClass("edit-mode");

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function create_thumbnail(pages) {
  console.log("creating thumbnail");
  var page = pages.shift();
  domtoimage.toJpeg(page, {
    quality: 0.5,
    bgcolor: "#6A5037",
    style: {
      "zoom": 1
    }
  }).then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    document.getElementById("thumbnail-" + page.id.substr(15)).style.backgroundImage = "url(" + img.src + ")";
    if (pages.length > 0) create_thumbnail(pages);
  })["catch"](function (error) {
    console.error("Error while creating image!", error);
  });
}

function scroll_to_page(id) {
  return regeneratorRuntime.async(function scroll_to_page$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          $("#document-box").animate({
            scrollTop: $("#document-box").scrollTop() + $(id).offset().top - 8
          }, 600);

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function fill_demo() {
  $('div[class^="Edit-"]').each(function () {
    if ($(this).height() < 20 || $(this).hasClass("Edit-WS")) {
      $(this).text("10");
    } else {
      $(this).html("Lorem<div>Ipsum</div><div>dolor</div><div>sit</div><div>amet</div>");
    }

    $(this).trigger("input");
  });
}