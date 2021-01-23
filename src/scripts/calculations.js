/*
*  This is the file where the calculation dependancies are defined and all
*  the necessary event listeners are added.
*
*  Note: The custom event "recalc" is used to signal that a field was changed
*  by the calc_dependency function.
*/

function add_calc_dependency(target_name, calc_string) {
	calc_string.replace(/{(\w|\d|[äöüß-])+}/g, item => {
		let field = $('.Edit-' + item.substr(1, item.length - 2));
		field.on("input recalc", () => {
			// console.log( "input " + item.substr(1, item.length - 2) );
			calc_dependency(target_name, calc_string);
		});
	});
}

function calc_dependency(target_name, calc_string) {
	const $target = $('.Edit-' + target_name);

	calc = calc_string.replace(/{(\w|\d|[äöüß-])+}/g, item => {
		let field = $('.Edit-' + item.substr(1, item.length - 2));
		return (field.text() === '') ? "0" : field.text();
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
	add_calc_dependency('LeP-Start', '(2 * {Konstitution-Start} + {Körperkraft-Start}) / 2 + {LeP-Mod}');
	add_calc_dependency('AuP-Start', '({Mut-Start} + {Konstitution-Start} + {Gewandheit-Start}) / 2 + {AuP-Mod}');
	add_calc_dependency('MR-Start', '({Mut-Start} + {Klugheit-Start} + {Konstitution-Start}) / 5 + {MR-Mod}');
	add_calc_dependency('INI-Start', '(2 * {Mut-Start} + {Intuition-Start} + {Gewandheit-Start}) / 5 + {INI-Mod}');
	add_calc_dependency('AT-Start', '({Mut-Start} + {Gewandheit-Start} + {Körperkraft-Start}) / 5 + {AT-Mod}');
	add_calc_dependency('PA-Start', '({Intuition-Start} + {Gewandheit-Start} + {Körperkraft-Start}) / 5 + {PA-Mod}');
	add_calc_dependency('FK-Start', '({Intuition-Start} + {Fingerfertigkeit-Start} + {Körperkraft-Start}) / 5 + {FK-Mod}');

	/******** Basis-Werte Aktuell ********/
	add_calc_dependency('LeP-Aktuell', '(2 * {Konstitution-Aktuell} + {Körperkraft-Aktuell}) / 2 + {LeP-Mod}');
	add_calc_dependency('AuP-Aktuell', '({Mut-Aktuell} + {Konstitution-Aktuell} + {Gewandheit-Aktuell}) / 2 + {AuP-Mod}');
	add_calc_dependency('MR-Aktuell', '({Mut-Aktuell} + {Klugheit-Aktuell} + {Konstitution-Aktuell}) / 5 + {MR-Mod}');
	add_calc_dependency('INI-Aktuell', '(2 * {Mut-Aktuell} + {Intuition-Aktuell} + {Gewandheit-Aktuell}) / 5 + {INI-Mod}');
	add_calc_dependency('AT-Aktuell', '({Mut-Aktuell} + {Gewandheit-Aktuell} + {Körperkraft-Aktuell}) / 5 + {AT-Mod}');
	add_calc_dependency('PA-Aktuell', '({Intuition-Aktuell} + {Gewandheit-Aktuell} + {Körperkraft-Aktuell}) / 5 + {PA-Mod}');
	add_calc_dependency('FK-Aktuell', '({Intuition-Aktuell} + {Fingerfertigkeit-Aktuell} + {Körperkraft-Aktuell}) / 5 + {FK-Mod}');

	/******** Basis-Werte max. Zukauf ********/
	// add_calc_dependency('TODO', '{Konstitution-Aktuell} / 2'); // TODO: LeP max Zukauf
	// add_calc_dependency('TODO', '{Konstitution-Aktuell}'); // TODO: AuP max Zukauf
	// add_calc_dependency('TODO', '{Mut-Aktuell} / 2'); // TODO: MR max Zukauf

	/******** Wundschwelle ********/
	// add_calc_dependency('TODO', '{Konstitution-Aktuell} / 2'); // TODO: 1. Wundschwelle
	// add_calc_dependency('TODO', '{Konstitution-Aktuell}'); // TODO: 2. Wundschwelle
	// add_calc_dependency('TODO', '3 * {Konstitution-Aktuell} / 2'); // TODO: 3. Wundschwelle
	// add_calc_dependency('TODO', '2 * {Konstitution-Aktuell}'); // TODO: 4. Wundschwelle

	// ToDo: Add more calculations

});
