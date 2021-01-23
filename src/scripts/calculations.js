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
	const result = isNaN(eval(calc)) ? "X" : eval(calc);
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
	// Page 1 calculations:
	add_calc_dependency('LeP-Start', '({Konstitution-Start} + {Konstitution-Start} + {Körperkraft-Start}) / 2 + {LeP-Mod}');
	add_calc_dependency('AuP-Start', '({Mut-Start} + {Konstitution-Start} + {Gewandheit-Start}) / 2 + {AuP-Mod}');
	// ToDo: Add more calculations

});
