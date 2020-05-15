console.log( "inserting calculations" );

function add_calc_dependency(target_name, calc_string) {
	const  $target = $('.Edit-' + target_name);
	calc = calc_string.replace(/{(\w|\d|[äöüß-])+}/g, item => {
		let field = $('.Edit-' + item.substr(1, item.length - 2));
		field.on('input', () => {
			console.log( "input " + item.substr(1, item.length - 2) );
			add_calc_dependency(target_name, calc_string);
		});
		return (field.text() === '') ? "0" : field.text();
	});
	const result = isNaN(eval(calc)) ? "X" : eval(calc);
	$('.Edit-' + target_name).text(result);



	console.log( 'target:', $target );
	console.log( 'calc_string:', calc_string );
	console.log( 'calc:', calc );
	console.log( 'result:', result );
}

$(document).ready(() => {
	add_calc_dependency('LeP-Start', '({Konstitution-Start} + {Konstitution-Start} + {Körperkraft-Start}) / 2 + {LeP-Mod}');

	$('.Edit-Mut-Start').on('input', () => {
		console.log("test");
	});
});