/*
*  This is the file where the calculation dependancies are defined and all
*  the necessary event listeners are added.
*
*  Note: The custom event "recalc" is used to signal that a field was changed
*  by the calc_dependency function.
*/

function add_calc_dependency(target_name, calc_string) {
	calc_string.replace(/{(\w|\d|[äöüß-])+}/g, item => {
		const $field = $('.Edit-' + item.substr(1, item.length - 2));
		$field.on("input recalc", () => {
			// console.log( "input " + item.substr(1, item.length - 2) );
			calc_dependency(target_name, calc_string);
		});
	});
}

function calc_dependency(target_name, calc_string) {
	const $target = $('.Calc-' + target_name);

	calc = calc_string.replace(/{(\w|\d|[äöüß-])+}/g, item => {
		const $field = $('.Edit-' + item.substr(1, item.length - 2)).first();
		return ($field.text() === '') ? "0" : $field.text();
	});
	const result = isNaN(eval(calc)) ? "X" : Math.round(eval(calc));
	$target.text(result);
	$target.trigger("recalc");

	/*
	console.log( 'target:', $target );
	console.log( 'calc_string:', calc_string );
	console.log( 'calc:', calc );
	console.log( 'result:', result );
	*/
}

$(document).ready(() => {
	/***********************************/
	/**********  BASIS-WERTE  **********/
	/***********************************/

	/******** Basis-Werte Start ********/
	add_calc_dependency('LeP-Start', '(2 * {KO-Start} + {KK-Start}) / 2 + {LeP-Mod}');
	add_calc_dependency('AuP-Start', '({MU-Start} + {KO-Start} + {GE-Start}) / 2 + {AuP-Mod}');
	// add_calc_dependency('AsP-Start', '({MU-Start} + {IN-Start} + {CH-Start}) / 2 + {AsP-Mod}'); // TODO: nur bei Zauberer
	// add_calc_dependency('KaP-Start', 'TODO'); // TODO: nur bei Geweihten
	add_calc_dependency('MR-Start', '({MU-Start} + {KL-Start} + {KO-Start}) / 5 + {MR-Mod}');
	add_calc_dependency('INI-Start', '(2 * {MU-Start} + {IN-Start} + {GE-Start}) / 5 + {INI-Mod}');
	add_calc_dependency('AT-Start', '({MU-Start} + {GE-Start} + {KK-Start}) / 5 + {AT-Mod}');
	add_calc_dependency('PA-Start', '({IN-Start} + {GE-Start} + {KK-Start}) / 5 + {PA-Mod}');
	add_calc_dependency('FK-Start', '({IN-Start} + {FF-Start} + {KK-Start}) / 5 + {FK-Mod}');

	/******** Basis-Werte Aktuell ********/
	add_calc_dependency('LeP', '(2 * {KO} + {KK}) / 2 + {LeP-Mod} + {LeP-Zugekauft}');
	add_calc_dependency('AuP', '({MU} + {KO} + {GE}) / 2 + {AuP-Mod} + {AuP-Zugekauft}');
	// add_calc_dependency('AsP', '({MU} + {IN} + {CH}) / 2 + {AsP-Mod} + {AsP-Zugekauft}'); // TODO: nur bei Zauberer
	// add_calc_dependency('KaP', 'TODO'); // TODO: nur bei Geweihten
	add_calc_dependency('MR', '({MU} + {KL} + {KO}) / 5 + {MR-Mod}');
	add_calc_dependency('INI', '(2 * {MU} + {IN} + {GE}) / 5 + {INI-Mod}');
	add_calc_dependency('AT', '({MU} + {GE} + {KK}) / 5 + {AT-Mod}');
	add_calc_dependency('PA', '({IN} + {GE} + {KK}) / 5 + {PA-Mod}');
	add_calc_dependency('FK', '({IN} + {FF} + {KK}) / 5 + {FK-Mod}');

	/******** Basis-Werte max. Zukauf ********/
	// add_calc_dependency('TODO', '{KO} / 2'); // TODO: LeP max Zukauf
	// add_calc_dependency('TODO', '{KO}'); // TODO: AuP max Zukauf
	// add_calc_dependency('TODO', '{MU} / 2'); // TODO: MR max Zukauf

	/******** Wundschwelle ********/
	// add_calc_dependency('TODO', '{KO} / 2'); // TODO: 1. Wundschwelle
	add_calc_dependency('WS-2', '{KO} + ({WS} - Math.ceil({KO} / 2))'); // 2. Wundschwelle
	add_calc_dependency('WS-3', '1.5 * {KO} + ({WS} - Math.ceil({KO} / 2))'); // 3. Wundschwelle
	// add_calc_dependency('TODO', '2 * {KO}'); // TODO: 4. Wundschwelle

	// ToDo: Add more calculations

});
