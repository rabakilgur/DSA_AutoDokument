<?php
header('Content-Type:text/html; charset=UTF-8');

// Detect Mobile Devices:
/*
require_once '../../../include/php_library/Mobile_Detect.php';
$detect = new Mobile_Detect;
$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'computer');
$scriptVersion = $detect->getScriptVersion();

If (isset($_GET['deviceType'])) {
	If ($_GET['deviceType'] == 'tablet') { $deviceType = 'tablet'; }
	elseif ($_GET['deviceType'] == 'computer') { $deviceType = 'computer'; }
	elseif ($_GET['deviceType'] == 'phone') { $deviceType = 'phone'; }
}
*/


/*
function getbody($filename) {
	$file = file_get_contents($filename);
	$dom = new DOMDocument;
	$dom->loadHTML($file);
	$bodies = $dom->getElementsByTagName('body');
	$body = $bodies->item(0);
	return $body;
}
function changeTagName($node, $name) {
	$childnodes = array();
	foreach ($node->childNodes as $child){
		$childnodes[] = $child;
	}
	$newnode = $node->ownerDocument->createElement($name);
	foreach ($childnodes as $child){
		$child2 = $node->ownerDocument->importNode($child, true);
		$newnode->appendChild($child2);
	}
	foreach ($node->attributes as $attrName => $attrNode) {
		if (($attrName == "id") || ($attrName == "style")) {
			$attrName = $attrNode->nodeName;
			$attrValue = $attrNode->nodeValue;
			$newnode->setAttribute($attrName, $attrValue);
		}
		$newnode->setAttribute("class", "doc-page");
	}
	$node->parentNode->replaceChild($newnode, $node);
	return $newnode;
}
*/

function getPage($filename) {
	// Load the bpdy of the xhtml file:
	$file = file_get_contents($filename);
	$dom = new DOMDocument;
	$dom->loadHTML($file);
	$bodies = $dom->getElementsByTagName('body');
	$page = $bodies->item(0);
	// Change its tag to 'section' and modify it a bit:
	$childnodes = array();
	foreach ($page->childNodes as $child){
		$childnodes[] = $child;
	}
	$newnode = $page->ownerDocument->createElement("section");
	foreach ($childnodes as $child){
		$child2 = $page->ownerDocument->importNode($child, true);
		$newnode->appendChild($child2);
	}
	foreach ($page->attributes as $attrName => $attrNode) {
		if (($attrName == "id") || ($attrName == "style")) {
			$attrName = $attrNode->nodeName;
			$attrValue = $attrNode->nodeValue;
			$newnode->setAttribute($attrName, $attrValue);
		}
		$newnode->setAttribute("class", "doc-page");
	}
	$page->parentNode->replaceChild($newnode, $page);
	// Convert the new node to printable HTML:
	$newdoc = new DOMDocument;
	$newnode = $newdoc->importNode($newnode, true);
	$newdoc->appendChild($newnode);
	$page_html = $newdoc->saveHTML();
	return $page_html;
}

function sort_pages($a, $b) {
	if ($a == $b) return 0;
	$a_nbr = (int)substr($a, 15, 2);
	$b_nbr = (int)substr($b, 15, 2);
	return ($a_nbr < $b_nbr) ? -1 : 1;
}

?>

<!--
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!                                                    !!!
!!!   Diese Datei wird (mithilfe von indem.php) kom-   !!!
!!!   piliert und sollte daher nicht geändert werden!  !!!
!!!                                                    !!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-->

<!DOCTYPE html>
<html lang="de" xml:lang="de" dir="ltr">
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta charset="utf-8">
	<meta name="author" content="Robin Garbe">
	<meta name="keywords" content="DSA, Heldendokument, Charakter, Das Schwarze Auge, Robin Garbe">
	<meta name="description" content="Ein interaktives DSA 4.1 Heldendokument">
	<meta property="og:type" content="website">
	<meta property="og:title" content="DSA 4.1 Heldendokument von Robin Garbe">
	<meta property="og:description" content="Interaktives DSA 4.1 Heldendokument">

	<title>DSA 4.1 AutoDokument</title>

	<!-- <link rel="stylesheet" href="./Heldendokument-web-resources/css/idGeneratedStyles.css" type="text/css" /> -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" type="text/css" />
	<link rel="stylesheet" href="https://www.robin-garbe.de/include/css_library/click.css" type="text/css" />
	<link rel="stylesheet" href="https://www.robin-garbe.de/include/css_library/design-variables.css" />
	<link rel="stylesheet" href="https://www.robin-garbe.de/include/css_library/design.css" />
	<link rel="stylesheet" href="./css/idGeneratedStyles.css" type="text/css" />
	<link rel="stylesheet" href="./font/stylesheet.css" type="text/css" />
	<link rel="stylesheet" href="./src/styles/doc_fixes.css" type="text/css" />
	<link rel="stylesheet" href="./src/styles/main.css" type="text/css" />

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="https://code.jquery.com/color/jquery.color.plus-names-2.1.2.min.js" integrity="sha256-Wp3wC/dKYQ/dCOUD7VUXXp4neLI5t0uUEF1pg0dFnAE=" crossorigin="anonymous"></script>
	<script src="https://robin-garbe.de/include/js_library/design.js"></script>
	<script src="https://robin-garbe.de/include/js_library/click.js"></script>
	<script src="https://use.fontawesome.com/releases/v5.8.1/js/all.js"></script>
	<!-- <script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
	<script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons/ionicons.dkb1z4hj.js"></script> -->
	<script src="https://robin-garbe.de/include/js_library/element_queries/ResizeSensor.js"></script>
	<script src="https://robin-garbe.de/include/js_library/element_queries/ElementQueries.js"></script>
	<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script> -->
	<script src="./src/scripts/clientside-setup.js"></script>
	<script src="./src/scripts/modified-dom-to-image.min.js"></script>
	<script src="./src/scripts/main.js"></script>
	<script src="./src/scripts/calculations.js"></script>
</head>
<body>

<?php
$pages = array_diff(scandir("./"), array('.', '..', '.git', 'css', 'db', 'font', 'image', 'src', '.gitignore', '.htaccess', 'index.html', 'index.php', 'README.md'));
usort($pages, "sort_pages");
?>

<div id="main-frame">
	<div id="thumbnail-box">
		<div id="thumbnail-innerbox">
			<?php
			$page_counter = 1;
			foreach ($pages as $page) echo "<a id='thumbnail-" . $page_counter . "' onclick=\"scroll_to_page('#Heldendokument-" . $page_counter++ . "')\"></a>";
			?>
		</div>
	</div>
	<div id="document-box">
		<?php
		$page_counter = 1;
		foreach ($pages as $page) echo "<div id='doc-wrapper-" . $page_counter++ . "'>" . getPage($page) . "</div>";
		?>
	</div>
	<div id="tool-box">
		<div id="toolbar">
			<div class="toolbar-item" data-tool="Dokumenten-Einstellungen" data-tool-short="documentSettings">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 465.416 465.417" xml:space="preserve">
						<path d="M406.854,82.06c0.462-3.1-0.406-6.432-3.291-9.344c-14.091-14.213-16.274-28.192-2.92-43.871
							c0.665-0.779,1.184-1.587,1.615-2.409c4.991-6.521,2.026-19.02-8.907-19.5c-84.396-3.712-186.422-4.034-270.846-6.814
							c-0.488-0.015-0.919,0.056-1.384,0.092c-0.19-0.021-0.363-0.076-0.566-0.092c-27.84-1.686-57.054,14.206-60.037,44.209
							c-0.328,3.316-0.224,6.421,0.129,9.384c-0.914,1.607-1.498,3.522-1.47,5.84c1.122,110.535-2.029,220.831-2.912,331.298
							c-0.109,0.889-0.132,1.833-0.01,2.868c3.9,33.805,24.859,58.661,59.245,63.887c1.12,0.173,2.168,0.157,3.189,0.061
							c0.602,0.147,1.201,0.3,1.866,0.36c81.014,7.409,162.294,6.86,243.563,6.825h24.395c6.784,2.052,15.523-1.498,15.549-10.72
							c0.294-123.761,9.252-247.455,2.925-371.189C406.971,82.621,406.885,82.357,406.854,82.06z M83.798,45.473
							c2.854-17.555,21.411-22.899,36.757-21.975c0.536,0.033,1.008-0.031,1.508-0.056c0.15,0.01,0.287,0.051,0.442,0.056
							c77.685,2.564,172.963,3.155,250.641,6.106c-5.743,13.02-5.981,26.258-0.513,38.963c-78.476-3.57-174.528-2.077-253.056-0.257
							c-0.259,0.005-0.467,0.069-0.724,0.089c-1.455-0.68-3.151-1.081-5.126-1.061C100.484,67.463,80.96,62.923,83.798,45.473z
							M319.609,90.292c-1.858,28.122-3.605,56.241-4.905,84.394c-5.124-5.241-10.318-10.41-15.772-15.313
							c-3.849-3.463-8.409-3.354-11.979-1.427c-1.046,0.203-2.103,0.521-3.179,1.104c-9.39,5.065-18.951,9.602-28.787,13.581
							c1.798-27.596,2.976-55.218,4.017-82.855C279.361,89.766,299.684,89.916,319.609,90.292z M123.114,434.837
							c-0.853-0.076-1.711-0.127-2.564-0.203c-0.269-0.025-0.493,0.015-0.759,0.005c-22.208-3.996-37.465-17.509-40.164-40.924
							c-0.025-0.229-0.104-0.421-0.14-0.64c0.045-0.437,0.134-0.843,0.14-1.305c0.812-102.758,3.562-205.366,3.06-308.157
							c9.234,4.812,20.258,7.213,31.036,7.114c0.224,0,0.417-0.056,0.635-0.068c1.478,0.693,3.197,1.086,5.215,1.041
							c4.931-0.114,9.932-0.229,14.975-0.338C132.603,205.879,124.211,320.375,123.114,434.837z M380.81,441.454h-24.486
							c-0.021,0-0.036,0.005-0.056,0.005c-70.868,0.051-141.744,0.239-212.433-4.961c1.031-115.163,9.532-230.354,11.477-345.571
							c26.799-0.531,54.791-0.952,82.943-1.107c-1.224,32.565-2.595,65.123-4.999,97.627c-0.419,5.646,3.064,8.866,7.289,9.717
							c1.966,0.962,4.367,1.229,7.145,0.282c14.523-4.951,28.519-11.128,42.112-18.205c8.328,7.949,16.219,16.333,24.288,24.55
							c2.858,9.836,19.875,8.703,20.297-3.382c1.274-36.589,3.523-73.118,5.936-109.649c14.93,0.412,29.559,0.958,43.701,1.691
							C389.244,208.791,381.606,325.097,380.81,441.454z"/>
					</svg>
				</div>
			</div>
			<div class="toolbar-item toolbar-active" data-tool="Seiten Einstellungen" data-tool-short="pageSettings">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 467.098 467.098" xml:space="preserve">
						<path d="M399.697,108.075c-0.985-29.884-1.533-59.857-1.239-89.756c0.011-1.331-0.203-2.506-0.503-3.613
							c0.59-6.515-3.244-13.396-11.593-13.177C281.035,4.291,175.733,0.168,70.401,0C61.634-0.015,57.8,7.686,58.881,14.439
							c-0.353,1.176-0.591,2.44-0.577,3.88c1.592,125.685,5.909,306.275,6.048,431.985c0,2.813,0.799,5.109,2.079,6.917
							c0.774,5.331,4.604,10.044,11.527,9.871c45.526-1.127,91.071-1.863,136.564-4.093c40.542-1.985,91.074,0.676,129.824-12.558
							c13.721-4.688,25.999-11.613,36.521-21.643c19.235-18.337,25.802-42.949,27.457-68.888c1.594-24.912-1.341-51.039-1.925-73.991
							C404.897,226.625,401.647,167.357,399.697,108.075z M333.049,342.662c-7.408,0.041-14.574,5.83-11.263,14.716
							c6.662,17.885,9.709,40.096-0.533,57.198c-12.391,20.683-34.495,20.119-55.508,22.77c-12.857,1.62-26.517,0.762-39.476,1.133
							c-10.077,0.284-137.763,3.397-137.763,3.895c-0.302-120.998-4.301-296.891-5.918-417.871c97.248,0.421,194.466,3.76,291.709,1.681
							c-0.33,88.933,8.364,232.535,8.958,321.436c-15.087-4.753-30.676-6.769-46.778-5.692
							C335.217,342.002,334.1,342.291,333.049,342.662z M342.55,425.352c9.765-16.635,12.207-37.063,7.124-59.193
							c11.761,0.457,23.359,2.727,34.343,7.383c0.046,0.143,0.076,0.29,0.127,0.422C380.584,400.19,363.989,416.283,342.55,425.352z"/>
					</svg>
					<svg class="toolbar-extra" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 474.832 474.832" xml:space="preserve">
						<path d="M393.941,294.117c-10.552,0-21.738,1.99-32.737,5.788c-13.762-15.599-28.203-30.741-42.229-45.427
							c-15.209-15.94-30.94-32.423-45.55-49.267c-6.606-7.602-13.314-15.094-20.013-22.582c-15.53-17.341-31.59-35.282-45.706-54.157
							c-0.482-0.645-1.623-2.039-3.103-3.833c-2.008-2.428-7.328-8.864-9.97-12.629c9.465-33.411,2.315-63.959-19.894-84.317
							C154.97,9.577,128.206,0,97.345,0c-5.479,0-11.126,0.308-16.791,0.899c-7.414,0.779-12.89,6.042-13.944,13.4
							c-0.983,6.843,2.135,13.898,7.523,17.877c2.028,2.72,4.857,4.773,8.241,5.934c15.173,5.162,31.07,12.213,33.923,25.332
							c2.024,9.292-8.719,18.601-12.058,21.23c-8.47,6.673-21.053,9.417-31.463,6.808C56.37,87.356,47.156,69.937,42.85,58.847
							c-0.294-3.854-1.861-7.462-4.544-10.38c-3.405-3.696-8.188-5.819-13.114-5.819c-7.368,0-13.461,4.718-15.521,12.007l-0.203,0.765
							c-0.13,0.416-0.239,0.848-0.338,1.29c-10.44,38.953-4.212,74.374,17.555,99.77c13.571,15.828,32.306,24.196,54.187,24.196
							c10.473,0,21.582-1.955,32.504-5.695c14.944,17.072,30.633,33.69,45.859,49.82c13.294,14.079,27.043,28.643,40.081,43.287
							c5.23,5.88,10.499,11.71,15.76,17.529c17.648,19.54,35.901,39.74,51.942,61.073c0.482,0.64,1.614,2.016,3.087,3.793
							c2.021,2.427,7.368,8.866,10.034,12.624c-9.368,33.433-2.127,63.967,20.145,84.253c19.723,17.977,46.367,27.473,77.043,27.473
							c5.616,0,11.405-0.32,17.215-0.95c7.413-0.797,12.872-6.078,13.908-13.441c0.96-6.845-2.179-13.888-7.576-17.854
							c-2.041-2.728-4.88-4.773-8.262-5.911c-15.188-5.118-31.108-12.126-33.997-25.237c-2.057-9.288,8.663-18.626,11.994-21.267
							c8.455-6.698,21.033-9.486,31.438-6.896c16.422,4.073,25.689,21.465,30.026,32.551c0.305,3.839,1.884,7.443,4.565,10.349
							c3.401,3.687,8.18,5.799,13.096,5.799l0,0c7.394,0,13.497-4.737,15.528-12.024l0.208-0.803c0.127-0.406,0.239-0.833,0.335-1.27
							c10.329-38.988,3.997-74.402-17.849-99.731C434.393,302.435,415.711,294.117,393.941,294.117z M448.21,400.815
							c-9.653-20.221-24.034-33.464-41.167-37.72c-16.534-4.088-35.993,0.184-49.368,10.786c-15.508,12.288-22.577,27.619-19.393,42.046
							c4.926,22.322,26.72,32.828,40.893,38.095c-26.583,0.533-48.459-7.054-64.896-22.039c-23.998-21.86-17.174-53.847-13.127-66.592
							c2.209-6.978-1.858-12.33-15.061-28.208c-1.174-1.407-2.088-2.494-2.463-3.002c-16.605-22.068-35.176-42.624-53.129-62.505
							c-5.228-5.783-10.463-11.582-15.658-17.422c-13.238-14.868-27.096-29.549-40.497-43.739
							c-16.687-17.674-33.949-35.962-49.98-54.608l-4.925-5.726l-6.962,2.907c-10.644,4.44-21.569,6.787-31.605,6.787
							c-15.843,0-28.759-5.7-38.395-16.938c-18.903-22.046-19.108-49.573-15.818-69.116c9.605,20.243,23.935,33.535,41.058,37.831
							c16.519,4.159,35.993-0.074,49.403-10.636c15.542-12.246,22.65-27.559,19.504-41.998c-4.862-22.34-26.634-32.91-40.776-38.209
							c26.591-0.391,48.431,7.186,64.831,22.219c23.94,21.937,17.019,53.908,12.936,66.636c-2.229,6.957,1.82,12.314,14.95,28.221
							c1.181,1.424,2.097,2.516,2.485,3.037c14.67,19.613,31.039,37.902,46.873,55.581c6.629,7.403,13.266,14.82,19.801,22.343
							c14.935,17.209,30.839,33.865,46.21,49.982c15.487,16.229,31.504,33.012,46.347,50.171l4.94,5.707l6.957-2.919
							c10.699-4.494,21.683-6.871,31.773-6.871c15.762,0,28.629,5.657,38.257,16.818C451.165,353.732,451.449,381.265,448.21,400.815z"
							/>
					</svg>
				</div>
			</div>
			<div class="toolbar-item" data-tool="Bearbeiten" data-tool-short="edit">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 478.977 478.976" xml:space="preserve">
						<path d="M13.612,467.519c1.668,6.525,7.652,12.497,16.145,11.304c53.256-7.484,105.546-19.575,157.565-33.088
							c2.435-0.635,4.316-1.757,5.799-3.144c3.217-0.599,6.005-2.661,7.904-5.51c1.028-0.609,2.044-1.325,2.999-2.315
							c73.517-75.418,152.185-145.58,225.718-220.988c5.901-6.053,4.342-13.67-0.183-18.423c-0.584-0.97-1.27-1.935-2.184-2.849
							c-1.346-1.346-2.706-2.681-4.052-4.032c14.727-15.305,28.401-31.539,41.862-47.966c4.651-5.667,3.819-12.4,0.514-17.194
							c-0.533-1.122-1.179-2.229-2.087-3.291c-35.917-41.878-74.824-80.572-116.601-116.6c-6.419-5.53-14.295-3.717-19.053,0.889
							c-1.031,0.594-2.042,1.3-3.007,2.265c-15.264,15.254-30.655,30.321-47.271,44.118c-0.173,0.142-0.279,0.305-0.441,0.447
							c-1.569-1.326-3.103-2.676-4.683-3.992c-9.449-7.891-21.9-0.34-23.216,8.638C172.019,126.909,98.536,202.022,23.214,275.232
							c-0.853,0.827-1.533,1.69-2.1,2.569c-1.488,1.579-2.584,3.737-2.958,6.642c-7.718,59.788-9.798,119.739-5.159,179.867
							C13.086,465.462,13.31,466.524,13.612,467.519z M38.966,450.366c-0.604-9.896-0.972-19.794-1.244-29.695
							c9.575,8.078,18.87,16.457,27.965,25.08C56.795,447.375,47.898,448.959,38.966,450.366z M338.15,31.154
							c35.484,31.321,68.781,64.708,99.944,100.351c-10.841,13.061-21.952,25.883-33.723,38.115
							c-34.769-34.515-69.908-68.608-106.724-100.919C311.79,56.869,325.069,44.128,338.15,31.154z M266.124,76.678
							c5.886,5.047,11.726,10.135,17.52,15.269c-39.238,38.862-79.161,76.998-115.468,118.688c-11.261,12.923,7.571,31.92,18.908,18.905
							c36.612-42.036,76.903-80.465,116.456-119.663c5.179,4.732,10.288,9.552,15.411,14.34
							c-58.803,56.091-110.905,118.581-167.319,177.013c-11.966,12.391,6.927,31.32,18.905,18.905
							c56.592-58.615,108.837-121.313,167.868-177.536c7.53,7.2,14.979,14.487,22.444,21.764
							c-43.731,43.274-88.311,85.67-131.22,129.773c-12.017,12.35,6.878,31.275,18.905,18.905
							c42.97-44.158,87.615-86.62,131.402-129.956c7.171,7.084,14.346,14.163,21.475,21.287
							c-69.359,70.325-142.777,136.506-211.921,207.055c-51.316-36.257-97.394-78.485-138.337-126.122
							C122.626,215.571,192.669,144.362,266.124,76.678z M41.363,314.703c36.374,40.802,76.718,77.378,120.683,109.807
							c-21.398,5.393-42.873,10.42-64.442,14.959c-18.136-17.95-36.919-35.089-57.059-50.795c-1.003-0.782-2.044-1.355-3.093-1.823
							C37.727,362.771,38.961,338.702,41.363,314.703z"/>
					</svg>
				</div>
			</div>
			<div class="toolbar-item" data-tool="Importieren / Exportieren" data-tool-short="export">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 481.679 481.679" xml:space="preserve">
						<path d="M100.936,229.042c0.015,0.016,0.021,0.036,0.036,0.051c34.626,49.394,80.973,86.448,129.539,121.491
							c1.701,1.229,3.384,1.868,5.007,2.102c3.166,2.209,7.312,2.601,11.522-0.604c48.424-36.846,87.412-82.599,111.781-138.654
							c2.732-6.276,0.071-12.167-4.229-15.503c-2.615-2.58-6.292-4.169-10.75-3.535l-48.622,6.947
							c1.082-32.377,2.168-62.662,3.271-108.212c0.365-0.98,0.645-2.026,0.716-3.214c0.559-8.917,1.147-17.834,1.706-26.751
							c2.271-7.201-1.168-15.879-10.628-14.838c-38.263,4.199-76.484,5.733-114.96,4.474c-1.401-0.046-2.63,0.167-3.778,0.492
							c-6.325-0.497-12.908,3.286-12.647,11.456c1.379,42.563,2.793,99.387,4.212,141.955c-17.811,1.138-35.62,2.097-53.481,2.188
							c-4.237,0.021-7.269,1.879-9.173,4.509c-3.364,3.316-4.684,8.308-1.137,13.461C99.834,227.611,100.411,228.296,100.936,229.042z
							M175.323,229.79c6.807-0.457,10.587-5.449,11.342-10.75c0.406-1.249,0.655-2.61,0.604-4.179
							c-1.378-41.264-2.742-96.791-4.083-138.06c25.463,0.584,50.833-0.147,76.187-1.976c-0.487,1.127-0.822,2.376-0.898,3.818
							c-3.285,65.826-1.812,79.719-1.731,145.596c0.005,6.597,5.053,9.938,10.166,10.039c1.102,0.315,2.311,0.478,3.702,0.361
							c12.654-1.066,25.334-1.554,38.008-2.224c-19.773,34.145-44.797,64.155-74.829,90.2c-0.198,0.173-0.328,0.36-0.51,0.538
							c-36.704-26.883-72.026-55.446-100.402-90.962C147.031,231.623,161.176,230.739,175.323,229.79z"/>
						<path d="M478.164,333.969c0-0.879-0.102-1.696-0.274-2.458c2.245-6.18-0.787-14.31-9.262-14.01
							c-0.203,0.005-0.406,0.021-0.609,0.025c-0.087,0-0.168-0.025-0.254-0.025c-0.219,0-0.427,0.051-0.646,0.071
							c-25.583,0.938-51.1,2.635-76.489,5.996c-7.759,1.031-10.938,8.745-9.521,14.503c0.006,0.087-0.015,0.147-0.01,0.229
							c0.559,9.856,1.438,19.678,2.382,29.488c-95.669,0.142-191.313,2.478-286.929,5.642c1.29-15.793-1.196-31.367-2.313-47.266
							c-0.421-5.972-4.431-9.974-10.4-10.4c-23.389-1.66-46.758-2.468-70.198-1.731c-5.553,0.178-8.777,3.875-9.725,8.1
							c-1.008,1.519-1.617,3.417-1.543,5.764c0.898,30.016,2.387,60.169-2.232,89.966c-0.566,3.677,0.63,6.739,2.643,8.988
							c1.643,2.473,4.367,4.22,8.262,4.185c151.674-1.478,303.526,8.282,454.987-3.469c1.3-0.097,2.432-0.427,3.478-0.868h1.722
							c5.667,0,10.399-4.732,10.399-10.399c0-0.239-0.091-0.457-0.106-0.69c0.138-0.858,0.208-1.763,0.106-2.772
							C479.144,386.597,478.235,360.324,478.164,333.969z M21.908,410.174c2.539-23.704,2.257-47.408,1.597-71.254
							c14.305,1.035,28.625,1.797,42.957,2.438c0.056,15.879,1.595,31.615,3.887,47.377c0.018,0.117,0.059,0.203,0.079,0.314
							c0.541,4.708,3.834,9.044,9.953,9.055c104.583,0.162,209.183,4.895,313.723,0c0.965-0.046,1.843-0.219,2.666-0.457
							c5.245,0.066,10.176-3.225,9.465-9.943c-1.442-13.761-2.752-27.537-3.722-41.345c16.097-1.041,32.209-1.797,48.327-2.462
							c-0.65,21.357,0.462,42.532,3.564,63.672C310.413,417.715,166.084,409.26,21.908,410.174z"/>
					</svg>
				</div>
			</div>
			<div class="toolbar-item" data-tool="Generelle Einstellungen" data-tool-short="generalSettings">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 428.691 428.691" xml:space="preserve">
						<path d="M40.415,140.195c1.404,92.658,4.867,190.445,12.979,273.55c1.935,19.835,33.149,20.022,31.199,0
							c-8.013-82.09-11.486-178.506-12.926-270.158C61.328,145.151,50.481,143.734,40.415,140.195z"/>
						<path d="M41.283,32.379c1.915-0.711,3.931-1.234,6.053-1.462c8.29-0.894,16.13-0.346,23.415,1.427
							c-0.01-5.789-0.021-11.588-0.025-17.255c-0.005-20.119-31.205-20.119-31.199,0c0,5.738,0.01,11.613,0.025,17.483
							C40.146,32.466,40.707,32.45,41.283,32.379z"/>
						<path d="M205.286,365.291c1.216,16.585,2.58,32.784,4.108,48.454c1.935,19.835,33.148,20.022,31.199,0
							c-1.509-15.422-2.849-31.361-4.048-47.672C226.4,368.658,215.582,368.109,205.286,365.291z"/>
						<path d="M201.059,255.973c1.915-0.711,3.936-1.234,6.053-1.463c8.315-0.894,16.17-0.34,23.478,1.447
							c-3.123-82.476-3.839-167.293-3.869-240.868c-0.005-20.119-31.205-20.119-31.199,0c0.03,73.641,0.749,158.529,3.879,241.066
							C199.967,256.064,200.508,256.039,201.059,255.973z"/>
						<path d="M360.19,245.314c2.071,58.655,5.321,116.428,10.395,168.431c1.935,19.835,33.148,20.022,31.198,0
							c-4.971-50.942-8.186-107.43-10.257-164.846C381.146,250.417,370.274,248.914,360.19,245.314z"/>
						<path d="M359.515,137.844c0.65-0.137,1.249-0.132,1.879-0.213c1.914-0.706,3.93-1.229,6.053-1.458
							c7.495-0.807,14.619-0.421,21.308,0.96c-0.625-42.452-0.823-83.771-0.838-122.044c-0.005-20.119-31.204-20.119-31.199,0
							c0.015,38.623,0.218,80.359,0.858,123.212C358.22,138.159,358.864,137.986,359.515,137.844z"/>
						<path d="M28.913,123.214c3.468,2.569,7.299,4.834,11.356,6.713c9.74,4.509,20.774,6.713,31.266,5.403
							c2.419-0.305,4.816-0.751,7.149-1.442c22.6-6.723,30.757-29.802,32.185-51.176c0.441-2.234,0.383-4.544-0.49-6.764
							c-7.353-18.707-21.49-31.676-39.618-35.652c-5.865-1.29-12.146-1.646-18.756-0.935c-1.803,0.193-3.519,0.64-5.146,1.244
							c-0.536,0.066-1.046,0.061-1.597,0.178c-1.915,0.411-3.806,0.904-5.69,1.438C20.983,47.476,4.437,58.846,2.741,79.792
							C1.286,97.778,15.621,113.363,28.913,123.214z M33.93,81.646c-0.01-0.213,0.023-0.426,0.023-0.64
							c0.046-0.208,0.12-0.563,0.201-0.965c0.114-0.229,0.256-0.513,0.406-0.822c0.312-0.335,0.863-0.99,1.348-1.534
							c0.482-0.401,1.127-0.939,1.404-1.112c0.779-0.513,1.594-0.97,2.422-1.396c0.838-0.432,1.684-0.838,2.532-1.239
							c-2.298,1.082,3.344-1.066,3.933-1.244c2.412-0.757,4.893-1.295,7.363-1.828c0.586-0.122,1.069-0.34,1.604-0.513
							c5.784-0.274,11.228,0.579,15.757,3.077c3.608,1.99,6.645,5.007,8.719,9.501c-0.472,6.388-1.698,11.852-4.06,16.066
							c-0.147,0.259-0.703,1.046-1.077,1.59c-0.467,0.528-0.972,1.021-1.488,1.503c-0.348,0.224-1.206,0.863-1.851,1.3
							c-0.224,0.152-0.427,0.284-0.562,0.36c-0.035,0.021-0.035,0.021-0.068,0.041c-0.259,0.061-0.63,0.162-1.147,0.32
							c-0.396,0.117-0.812,0.167-1.214,0.259c-0.264-0.036-2.468,0.208-3.171,0.208c-0.457,0-1.747-0.143-2.575-0.224
							c-1.112-0.218-2.229-0.447-3.332-0.741c-1.135-0.295-2.247-0.676-3.354-1.051c-0.5-0.172-0.854-0.29-1.125-0.375
							c-0.046-0.041-0.19-0.132-0.65-0.346c-2.917-1.361-5.667-3.052-8.331-4.864c-0.18-0.127-0.632-0.473-1.059-0.803
							c-1.082-0.894-2.133-1.833-3.151-2.803c-0.554-0.519-1.062-1.082-1.582-1.63c-0.277-0.299-0.566-0.574-0.843-0.868
							c-0.467-0.508-0.744-0.787-0.942-0.985c-0.056-0.082-0.081-0.122-0.17-0.244c-1.107-1.508-2.034-3.138-2.892-4.793
							c-0.145-0.452-0.774-2.031-0.947-2.635c-0.056-0.219-0.086-0.3-0.134-0.468C33.925,81.696,33.93,81.696,33.93,81.646z"/>
						<path d="M183.494,346.808c6.183,4.58,13.525,8.125,21.231,10.272c9.407,2.625,19.365,3.133,28.545,0.396
							c0.914-0.27,1.758-0.609,2.621-0.93c20.591-7.688,28.197-29.731,29.563-50.252c0.442-2.233,0.386-4.544-0.487-6.764
							c-6.581-16.731-18.591-28.857-34.013-34.083c-7.408-2.509-15.597-3.453-24.364-2.503c-1.803,0.192-3.519,0.64-5.146,1.238
							c-0.536,0.071-1.046,0.066-1.597,0.183c-0.041,0.011-0.089,0.021-0.129,0.031c-20.733,4.479-40.522,15.954-42.391,38.974
							C155.867,321.372,170.197,336.956,183.494,346.808z M188.506,305.239c-0.01-0.213,0.021-0.427,0.021-0.64
							c0.048-0.208,0.122-0.563,0.203-0.965c0.114-0.229,0.256-0.513,0.406-0.822c0.312-0.336,0.863-0.99,1.346-1.534
							c0.485-0.401,1.13-0.939,1.404-1.112c1.571-1.025,3.268-1.838,4.956-2.641c-2.298,1.082,3.344-1.066,3.93-1.244
							c0.117-0.04,0.241-0.065,0.355-0.102c2.303-0.695,4.659-1.219,7.007-1.727c0.589-0.121,1.072-0.34,1.607-0.513
							c9.402-0.446,17.969,1.971,22.985,9.938c0.523,0.838,1.051,1.671,1.498,2.636c-0.188,2.555-0.543,4.916-0.995,7.15
							c-0.681,3.356-1.65,6.383-3.067,8.916c-0.147,0.26-0.7,1.047-1.076,1.59c-0.468,0.528-0.97,1.021-1.488,1.503
							c-0.467,0.3-1.863,1.361-2.417,1.661c-0.035,0.02-0.035,0.02-0.065,0.04c-0.26,0.062-0.63,0.163-1.148,0.32
							c-0.396,0.116-0.812,0.167-1.213,0.259c-0.265-0.035-2.471,0.208-3.174,0.208c-0.457,0-1.747-0.142-2.575-0.224
							c-1.112-0.218-2.229-0.446-3.332-0.741c-1.135-0.294-2.247-0.675-3.354-1.056c-0.5-0.168-0.854-0.285-1.125-0.371
							c-0.046-0.041-0.193-0.132-0.65-0.346c-2.1-0.979-4.098-2.168-6.058-3.412c-0.759-0.482-1.528-0.944-2.272-1.447
							c-0.18-0.127-0.635-0.473-1.059-0.803c-1.082-0.894-2.133-1.833-3.153-2.803c-0.841-0.802-1.633-1.65-2.422-2.498
							c-0.467-0.508-0.744-0.787-0.942-0.985c-0.056-0.081-0.081-0.122-0.17-0.243c-1.107-1.509-2.034-3.139-2.892-4.794
							c-0.145-0.452-0.774-2.031-0.947-2.636c-0.056-0.218-0.086-0.3-0.134-0.467C188.501,305.29,188.506,305.29,188.506,305.239z"/>
						<path d="M343.823,228.471c4.789,3.544,10.278,6.475,16.082,8.627c10.05,3.742,21.049,4.977,31.28,2.564
							c0.803-0.188,1.625-0.289,2.412-0.522c22.603-6.724,30.758-29.808,32.185-51.176c0.441-2.239,0.386-4.544-0.487-6.769
							c-6.911-17.569-19.825-30.051-36.384-34.799c-6.774-1.945-14.147-2.625-21.993-1.782c-1.803,0.188-3.519,0.64-5.144,1.239
							c-0.538,0.071-1.046,0.066-1.6,0.183c-0.822,0.178-1.635,0.386-2.458,0.584c-19.865,4.819-38.268,16.265-40.06,38.42
							C316.194,203.035,330.529,218.619,343.823,228.471z M348.836,186.902c-0.011-0.214,0.02-0.427,0.02-0.64
							c0.046-0.208,0.117-0.563,0.203-0.97c0.112-0.229,0.254-0.508,0.406-0.818c0.311-0.335,0.863-0.99,1.346-1.538
							c0.482-0.396,1.128-0.935,1.401-1.112c1.574-1.021,3.271-1.833,4.957-2.636c-1.229,0.584-0.173,0.229,1.157-0.244
							c1.147-0.411,2.499-0.914,2.772-1c2.417-0.751,4.896-1.295,7.363-1.823c0.589-0.127,1.071-0.345,1.609-0.513
							c7.485-0.355,14.442,1.117,19.505,5.738c1.96,1.788,3.666,4.007,4.972,6.835c-0.473,6.388-1.701,11.847-4.062,16.067
							c-0.051,0.096-0.203,0.305-0.335,0.508c-0.234,0.345-0.508,0.736-0.742,1.077c-0.467,0.528-0.97,1.021-1.487,1.503
							c-0.467,0.294-1.863,1.355-2.417,1.66c-0.036,0.021-0.036,0.021-0.066,0.041c-0.259,0.061-0.63,0.162-1.152,0.314
							c-0.392,0.122-0.808,0.173-1.209,0.265c-0.264-0.041-2.473,0.208-3.174,0.208c-0.457,0-1.747-0.143-2.574-0.224
							c-1.112-0.218-2.229-0.452-3.331-0.741c-1.133-0.295-2.244-0.676-3.352-1.057c-0.503-0.172-0.854-0.284-1.127-0.37
							c-0.046-0.046-0.193-0.132-0.65-0.346c-2.915-1.361-5.667-3.052-8.328-4.87c-0.183-0.122-0.635-0.472-1.061-0.797
							c-0.219-0.183-0.427-0.386-0.646-0.574c-0.853-0.726-1.696-1.462-2.509-2.229c-0.838-0.803-1.63-1.65-2.422-2.504
							c-0.467-0.502-0.741-0.782-0.939-0.979c-0.056-0.087-0.081-0.122-0.173-0.244c-1.106-1.508-2.031-3.138-2.889-4.793
							c-0.147-0.457-0.777-2.031-0.95-2.641c-0.056-0.218-0.086-0.294-0.132-0.462C348.836,186.953,348.841,186.953,348.836,186.902z"/>
					</svg>
				</div>
			</div>
			<div class="toolbar-item" data-tool="Experimentelle Einstellungen" data-tool-short="experimentalSettings">
				<div class="toolbar-icon">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 468.161 468.161" xml:space="preserve">
						<path d="M433.03,384.074c-0.173-1.478-0.722-3.032-1.763-4.626c-42.802-65.831-86.279-131.24-125.943-199.044
							c-0.031-0.165-0.016-0.317-0.046-0.488c-7.084-36.78-11.624-73.661-12.162-111.152c-0.01-0.967-0.137-1.874-0.335-2.727
							c4.332-0.239,8.668-0.473,13.005-0.721c0.289-0.015,0.543-0.094,0.822-0.129c0.655,0.16,1.331,0.284,2.031,0.322
							c20.668,1.008,35.871-19.037,31.601-38.344c-6.83-30.904-46.067-23.229-69.146-23.755c-25.294-0.571-78.94,0.109-79.415,0.063
							c-19.202-1.909-38.316-4.997-57.627-2.6c-41.693,5.185-40.839,48.436-2.465,59.179c-0.025,0.223-0.089,0.416-0.104,0.645
							c-2.232,36.062-1.592,71.968,1.721,107.94c0.099,1.081,0.343,2.026,0.655,2.899c-13.261,84.119-59.395,157.171-93.869,233.655
							c-0.208,0.284-0.447,0.528-0.617,0.838c-7.909,14.274-9.927,29.858-1.577,44.493c0.541,0.949,1.176,1.736,1.846,2.438
							c0.328,0.523,0.681,1.046,1.112,1.519c6.538,7.099,15.173,10.023,24.61,10.771c0.282,0.02,0.546-0.031,0.822-0.025
							c0.208,0.035,0.391,0.102,0.604,0.121c111.183,10.694,219.973-11.339,329.322-28.365c1.31-0.203,2.417-0.619,3.422-1.112
							c0.32-0.01,0.635,0.005,0.96-0.025c12.096-1.152,22.541-7.886,29.585-17.625c0.705-0.98,1.168-1.966,1.528-2.94
							c0.538-0.771,1.041-1.584,1.427-2.473c3.859-8.852,3.229-18.561,0.432-27.604C433.349,384.81,433.177,384.45,433.03,384.074z
							M126.843,31.87c-2.069-3.207-2.112-6.883-1.369-10.587c19.573-2.049,39.108-2.179,58.712-0.582
							c0.083,0.01,0.147,0.041,0.229,0.045c41.568,4.5,83.164,6.409,124.966,5.581c0.32-0.005,0.609-0.084,0.914-0.109
							c0.325,0.079,0.65,0.181,0.99,0.239c0.188,0.031,0.265,0.043,0.406,0.063c0.163,0.056,0.422,0.145,0.914,0.285
							c0.666,0.192,1.301,0.475,1.94,0.733c0.045,0.084,1.325,0.744,1.6,0.927c0.157,0.119,0.238,0.181,0.345,0.264
							c0.274,0.287,0.554,0.566,0.812,0.874c0.127,0.14,0.183,0.193,0.27,0.287c0.056,0.094,0.07,0.134,0.142,0.259
							c0.295,0.495,0.493,1.036,0.727,1.562c-0.005,0.14,0.452,1.528,0.522,1.838c0.107,0.521,0.401,4.573,0.315,2.062
							c0.01,0.315,0.071,0.617,0.102,0.925c-0.106,0.353-0.198,0.708-0.32,1.056c-0.056,0.183-0.528,1.138-0.751,1.628
							c-0.244,0.388-0.519,0.764-0.798,1.132c-0.025-0.035-0.411,0.338-0.776,0.709c-0.355,0.229-1.112,0.769-1.387,0.903
							c-0.183,0.094-0.259,0.143-0.376,0.203c-0.142,0.031-0.259,0.054-0.492,0.12c-0.686,0.188-1.396,0.261-2.097,0.353
							c0.015-0.071-1.885,0.018-2.169,0.005c-0.884-0.165-1.828-0.254-2.879-0.19c-54.924,3.136-109.857,6.188-164.331-3.458
							c-0.924-0.167-1.792-0.218-2.615-0.188C135.386,37.662,129.412,35.859,126.843,31.87z M140.805,236.543h42.071
							c13.525,0,13.525-20.967,0-20.967h-35.597c3.014-10.752,5.637-21.658,7.711-32.766h31.811c13.525,0,13.525-20.964,0-20.964
							h-31.313c-1.191-13.546-1.882-27.086-2.204-40.626h34.83c13.522,0,13.522-20.967,0-20.967h-34.975
							c0.094-12.151,0.398-24.308,1.127-36.479c38.506,5.458,77.224,5.146,115.983,3.409c0,0.016,0,0.025,0,0.041
							c0.554,38.517,4.896,76.518,12.03,114.336c-0.422,2.184-0.092,4.623,1.406,7.18c9.231,15.813,18.688,31.481,28.279,47.068
							c-55.299,30.818-118.622,45.082-179.867,24.709C135.183,252.589,138.111,244.607,140.805,236.543z M411.509,404.914
							c-0.122,0.157-0.265,0.27-0.387,0.432c-0.426,0.614-0.873,1.214-1.335,1.792c-0.111,0.122-0.224,0.234-0.391,0.406
							c-0.549,0.549-1.117,1.066-1.712,1.569c0.021-0.01-1.777,1.27-1.833,1.376c-3.372,2.047-5.52,2.483-9.938,2.905
							c-1.184,0.116-2.255,0.533-3.255,1.076c-0.376,0.025-0.731,0-1.127,0.066c-107.354,16.717-214.027,38.46-323.193,27.964
							c-0.307-0.035-0.576,0.011-0.874,0c-0.188-0.03-0.366-0.086-0.551-0.102c-1.155-0.086-2.298-0.238-3.443-0.396
							c0.135-0.051-2.247-0.584-2.658-0.722c-0.305-0.111-0.592-0.243-0.889-0.37c-0.13-0.081-0.328-0.203-0.612-0.366
							c-0.271-0.183-0.521-0.386-0.782-0.584c-0.104-0.116-0.264-0.284-0.513-0.543c-0.094-0.092-0.198-0.162-0.287-0.254
							c-3.499-6.835-3.27-13.269,0.599-20.251c0.442-0.808,0.785-1.646,1.069-2.493c0.713-0.848,1.374-1.782,1.889-2.92
							c20.19-44.91,43.767-88.402,62.909-133.521c67.197,23.395,138.171,7.657,198.859-26.339
							c28.589,45.737,58.29,90.778,87.701,136.008c0.106,0.158,0.233,0.279,0.34,0.432C412.717,395.357,413.622,399.785,411.509,404.914
							z"/>
					</svg>
				</div>
			</div>

			<div id="toolbar-highlight">
				<span id="toolbar-highlight-text"></span>
				<div id="toolbar-highlight-circle"></div>
			</div>
		</div>
		<div id="toolarea-box">
			<div class="toolarea" id="toolarea-documentSettings">
				<h3>Dokumenten-Einstellungen</h3>
			</div>
			<div class="toolarea" id="toolarea-pageSettings">
				<h3>Seiten Einstellungen</h3>


				<?php
				$page_counter = 1;
				echo '<div id="toolarea-pageSelection" class="select-dropdown"><select>';
				foreach ($pages as $page) echo "<option value='" . $page_counter . "'>Seite " . $page_counter++ . "</option>";
				echo '</select></div>';
				$page_counter = 1;
				foreach ($pages as $page) echo "<div class='toolarea-page' id='toolarea-page_" . $page_counter++ . "'></div>";
				?>


			</div>
			<div class="toolarea" id="toolarea-edit">
				<h3>Bearbeiten</h3>
			</div>
			<div class="toolarea" id="toolarea-export">
				<h3>Importieren / Exportieren</h3>
			</div>
			<div class="toolarea" id="toolarea-generalSettings">
				<h3>Generelle Einstellungen</h3>
			</div>
			<div class="toolarea" id="toolarea-experimentalSettings">
				<h3>Experimentelle Einstellungen</h3>
			</div>
		</div>
	</div>
</div>


</body>
</html>
