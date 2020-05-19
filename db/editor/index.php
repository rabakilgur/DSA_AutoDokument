<!doctype html>
<html lang="de">
<head>
	<title>JSON Editor</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css">
	<link rel="stylesheet" href="style.css">
	<meta charset="utf-8">
</head>

<body>

	<div>

		<div id='input_container' class='col-md-12'>
			<label for="select_json">JSON Datei auswählen:</label>
			<div class="select_box">
				<select name="select_json" id="select_json" class="form-control">
					<?php
					$files = array_diff(scandir("../"), array('.', '..', 'test.html', 'editor'));
					foreach ($files as $file) echo "<option value='$file'>$file</option>";
					?>
				</select>
				<button id='json_to_table_btn' type="button" class="btn btn-secondary"><i class="fas fa-redo-alt"></i>Tabelle neu laden</button>
			</div>

			<textarea class="form-control" id="Textarea1" rows="8">
				<?php
				echo file_get_contents("../" . array_values($files)[0]);
				?>
			</textarea>
		</div>

		<div class="row mt-3">
			<div id='table_container' class='col-md-12'></div>
		</div>

		<div class="text-right mr-1" style="margin-top: -10px;">
			<button id='add_row_btn' type="button" class="btn btn-secondary btn-sm"><i class="fas fa-plus"></i>Zeile hinzufügen</button>
		</div>

		<div class="text-center py-2">
			<button id='table_to_json_btn' type="button" class="btn btn-secondary btn-lg"><i class="fas fa-file-export"></i>Tabelle zu JSON konvertieren</button>
			<button id='save_btn' type="button" class="btn btn-primary btn-lg"><i class="fas fa-save"></i>Tabelle konvertieren und speichern</button>
		</div>

		<div class="row mt-3">
			<textarea id="result_container" class="form-control col-md-12 mb-5" rows="8" disabled></textarea>
		</div>

	</div>

		<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

		<script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>

		<script src="./jsoneditor.js"></script>

		<script>
			$(document).ready(() => {
				jsonEditorInit('table_container', 'Textarea1', 'result_container', 'json_to_table_btn', 'table_to_json_btn');
				$("#json_to_table_btn").click()
			});
		</script>



</body>

</html>