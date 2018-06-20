jQuery(document).ready(function(){

	// set a coordinate point
	jQuery('#mapContainer').click(function(e) {
		setCoordinates(e, 1);
		e.preventDefault();
	});
	//FIND & BIND
	//top control buttons 
	jQuery('#top_control_pills>li.add').click(function(){
		jQuery('#top_controls').addClass('inactive');
		jQuery('#main_title').fadeOut(function(){ jQuery(this).html(''); });
		jQuery('#main_txt label').first().addClass('active').fadeIn();
		jQuery('input[name="main_name"]').removeClass('inactive').focus();//set first input & label active 
	});
	jQuery('input[name="main_name"]').keyup(function(e) {
		let valid = validate_name(this.value);
		if( valid ){ is_valid(this); } else { not_valid(this); }
	  });
	jQuery('#edit_name').keyup(function(e) {
		let valid = validate_name(this.value);
		if( valid ){ 
			is_valid_edit(this);
			check_button(this);
			} else { 
				not_valid_edit(this);
				check_button(this);
				}
	});  
	jQuery('input[name="main_url"]').keyup(function(e) {
	let valid = validate_url(this.value);
	if( valid ){ is_valid(this); } else { not_valid(this); }
	});
	jQuery('#edit_url').keyup(function(e) {
		let valid = validate_url(this.value);
		if( valid ){ 
			is_valid_edit(this); 
			check_button(this);
		} else { 
			not_valid_edit(this); 
			check_button(this);
			}
	});
	// left control buttons
	jQuery('#new_area').click(function() {
		jQuery('#coordsText').val('');
	});

	jQuery('#clear_area').click(function() {
		jQuery('#coordsText').val('');
		jQuery('#mapContainer').find('area:last').remove();
		highlight();
		
		// update textarea	
		var textareaVal = jQuery('#areaText').val();
		var tmpArr = textareaVal.split('<area');
		var lastCoords = tmpArr[tmpArr.length - 1].split('/>')[0];
		textarea = textareaVal.replace('<area' + lastCoords+'/>\n    ', '');
		jQuery('#areaText').val(textarea);
	});

	jQuery('#area_done').click(function() {
		let html = jQuery('#areaText').val();
		html = html.substring(html.indexOf('<map name="Map"') + 25, html.length - 6 );
		html = html.replace('[...]','').trim();

		current_map.innerHTML += html;

		jQuery('#coordsText').val('');
		jQuery('#areaText').val('');
		jQuery('#mapContainer').find('map').empty();
		jQuery('#dots').empty();
		highlight();
		textarea = "";

		let list_item = document.createElement("li");
		list_item.classList.add('area');
		list_item.id = current_group.name;
		list_item.innerHTML = '<span class="layer_delete"><i class="far fa-times-circle"></i></span> <span class="layer_edit"><i class="far fa-edit"></i></span> <span class="layer_title">'+current_group.title +'</span><span class="hidden_code">'+html+'</span>';
		jQuery('#groups_list').append(list_item);
		jQuery('.layer_delete').click(function(e){ layer_delete(e); });
		jQuery('.layer_edit').click(function(e){ layer_edit(e); });
		current_group.title = ''; current_group.url = ''; current_group.name = '';
		jQuery('#top_controls').removeClass('inactive');
		jQuery('#side_control_buttons').addClass('inactive');
		jQuery('#mapContainer').addClass('inactive');
		jQuery('#main_txt>h2').text('Add New Set Piece').fadeIn();
		jQuery('input[name="main_name"]').val('');
		jQuery('input[name="main_url"]').val('');
		jQuery('#all_done').removeClass('inactive');
	});
	/*/ - edit center /*/
	jQuery('#edit_save_changes').click(function(){ save_edits(); })
	jQuery('#close_edit_center').click(function(e) {
		jQuery('#edit_name').val('');
		jQuery('#edit_url').val('');
		let center = jQuery(e.currentTarget).parent();
		center.children('.status').remove();
		center.attr('data-editing','');
		center.removeClass('active');
	});
	jQuery('#view_code').click(function(){
		jQuery('#coords_area').addClass('active');
		
	});
	/*/ - view code area /*/
	jQuery('#view_close').click(function(){
		jQuery('#coords_area').find('.status').html('');
		jQuery('#coords_area').removeClass('active');
	});
	jQuery('#view_copy').click(function(){
		let markup = jQuery('#areaText').val().replace('[...]', '');
		var temp_el = document.createElement('textarea');
		temp_el.value = markup;
		temp_el.style = 'position: fixed; top:9999px;'
		document.body.appendChild(temp_el);
		temp_el.select();
		document.execCommand('copy');
		document.body.removeChild(temp_el);
		jQuery('#coords_area').find('.status').html('<i class="fas fa-check"></i>');
	});
	jQuery('#view_all').click(function(){ map_preview(); });
	jQuery('#all_done').click(function(){
		if(jQuery(this).hasClass('inactive') ) return false;
		if(jQuery('#groups_list').children('li').length ){
			let markup = '<img class="project-image" id="bt_imagemap" src="'+img_url+'" alt="" usemap="#Map" />\n'
				+ '<map name="Map" id="Map">';
			let list_markup = '<ul class="set_piece_list" id="set_list">';
			jQuery('#groups_list').children('li').each(function(){
				markup+= jQuery(this).find('.hidden_code').html();
				let tit = jQuery(this).find('span.layer_title').html();
				list_markup+= '<li class="set_piece_li" data-key="'+tit.replace(/ /g,"_").toLowerCase()+'">'+tit+'</li>';
			});
			markup+= '</map>';
			list_markup+='</ul>';
			console.log(list_markup);
			jQuery('#map_data').val(markup);
			jQuery('#list_data').val(list_markup);
			jQuery('.tgm-open-media').first().addClass('disabled').html('Project Loaded');
			done_editing = true;
			jQuery.featherlight.close();
		} else { alert("You must add at least one set piece to the project") }
	});
	// ..
	jQuery('#clear_all').click(function() {
		jQuery('#coordsText').val('');
		jQuery('#areaText').val('');
		jQuery('#mapContainer').find('map').empty();
		jQuery('#dots').empty();
		highlight();
		textarea = "";
	});
});	
current_group = {
	title: '',
	name: '',
	url: ''
};
current_map = document.createElement("map");
img_url = document.getElementById('main').src;
var timeoutIdShow = 0;
var timeoutIdHide = 0;

var counter = 1;
var coordsLength = 0;
var textarea = '';
var done_editing = false;

function setCoordinates(e, status) {
	if( jQuery('#mapContainer').hasClass('inactive') ) return false;
	var x = e.pageX;
	var y = e.pageY;
	jQuery('#dots').append('<img class="dot" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAACFJREFUGFdj9J/6KomBgUEYiN8yADmlQPwfRIM4SVCBJAAiRREoec4ImAAAAABJRU5ErkJggg==" style="left: '+ (x-1) +'px; top: '+ (y-1) +'px;" />');
	var offset = jQuery('#imagemap4posis img').offset();
	x -= parseInt(offset.left);
	y -= parseInt(offset.top);
	if(x < 0) { x = 0; }
	if(y < 0) { y = 0; }
	
	var value = jQuery('#coordsText').val();
	if(value == '') {
		value = x+','+y;
		coordsLength = value.length;
		counter++;
	} else {
		value = value+','+x+','+y;
		coordsLength = value.length;
	}
	if(status)
    jQuery('#coordsText').val(value);
	
	if(jQuery('#area'+counter).length != 0)
        jQuery('#area'+counter).remove();
        var countKomma = value.split(',').length;
        var shape = (countKomma <= 4) ? 'rect' : 'poly';
	if(countKomma >= 4) {
		var html = '<area shape="'+shape+'" id="area'+counter+'" class="'+current_group.name+'" coords="'+value+'" href="'+current_group.url+'" alt="'+current_group.title+'" title="'+current_group.title+'">';
		jQuery('map').append(html);
	}
	
	jQuery('#mapContainer').append(jQuery('.imgmapMainImage'));
	jQuery('#mapContainer').children('div').remove();
	jQuery('.imgmapMainImage').removeClass('maphilighted');
	//$('canvas').remove();

	highlight();
	
	var area = '<area alt="'+current_group.title+'" title="'+current_group.title+'" name="'+current_group.name+'" class="'+current_group.name+'" href="'+current_group.url+'" shape="'+shape+'" coords="'+value+'" />\n';
	//var textarea = $('#areaText').val();
	if(textarea == '')
	{
		// create textarea context
		textarea = '<img class="project-image" id="bt_imagemap" src="'+img_url+'" alt="" usemap="#Map" />\n'
				+ '<map name="Map" id="Map">\n'
				+ '    ' + area
				+ '    [...]\n'
				+ '</map>';
	}
	else 
	{
		if(countKomma == 2)
		{
			// new <area> context
			textarea = textarea.replace('[...]', area + '    [...]');
		}
		else 
		{
			// edit / update <area> context
			var arr = value.split(',');
			var oldCoor = '';
			for(var i = 0; i < arr.length -2; i++)
			{
				if(i >= 1)
					oldCoor += ',';
				oldCoor += arr[i];
			}
			textarea = textarea.replace('shape="rect" coords="'+oldCoor, 'shape="'+shape+'" coords="'+oldCoor);
			textarea = textarea.replace(oldCoor, value);
		}
	}
	jQuery('#areaText').val(textarea);
}

function highlight() {
	jQuery('.imgmapMainImage').maphilight({
		strokeColor: '4F95EA',
		alwaysOn: true,
		fillColor: '365E71',
		fillOpacity: 0.2,
		shadow: true,
		shadowColor: '000000',
		shadowRadius: 5,
		shadowOpacity: 0.6,
		shadowPosition: 'outside'
	});
}
/*
function save_the_data(){
	let markup = '';
	let data = jQuery('#groups_list').children('li').each(function(){
		let frag = this.innerHTML;
		markup+= frag;
	});
}
*/
function validate_url(eval_url){
	//let regex = /^((http?|https):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
	let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regex.test(eval_url);
}
function validate_name(eval_name){
	let regex = /^[a-z\d\-_\s]+$/i ;
	if(eval_name.length > 3) return regex.test(eval_name);
return false;
}
function is_valid(elem){
	//add valid button & bind
	jQuery('.nextstep').remove();
	jQuery('.nonextstep').remove();
	let nextstep = document.createElement('span');
	nextstep.classList.add('nextstep');
	jQuery(nextstep).on("click", function(e){next_step(e); });
	nextstep.innerHTML = '<i class="fas fa-check"></i>'
	jQuery(elem).after(nextstep);
}
function not_valid(elem){
	jQuery('.nextstep').remove();
	jQuery('.nonextstep').remove();
	let nonextstep = document.createElement('span');
	nonextstep.classList.add('nonextstep');
	jQuery(nonextstep).on("click", function(){abort_step(); });
	nonextstep.innerHTML = '<i class="fas fa-times"></i>'
	jQuery(elem).after(nonextstep);

}
function abort_step(){
	current_group.title = ''; current_group.url = ''; current_group.name = '';
	jQuery('#top_controls').removeClass('inactive');
	jQuery('#side_control_buttons').addClass('inactive');
	jQuery('#mapContainer').addClass('inactive');
	jQuery('input[name="main_name"]').val('');
	jQuery('input[name="main_url"]').val('');
	jQuery('#main_txt input').addClass('inactive');
	jQuery('#main_txt label').removeClass('active');
	jQuery('#main_txt>h2').text('Add New Set Piece').fadeIn();
	jQuery('#all_done').removeClass('inactive');
}
function next_step(e){
	console.log(e);
	console.log(e.currentTarget);
	var check= jQuery(e.currentTarget);
	var this_input = jQuery(check).prev('input');
	var v = jQuery(this_input).val();

	var this_label = jQuery(this_input).prev('label');
	if(typeof v == 'undefined'){
		jQuery(this_label).focus();//take focus off input then put it back on...works for some reason
		jQuery(this_input).focus();
		v = jQuery(this_input).val();
	}
	
	if( v.indexOf('http') == -1 && current_group.title == ''){
		this_label.removeClass('active');
		this_input.addClass('inactive');
		current_group.title = v;
		current_group.name = v.replace(/ /g,"_").toLowerCase();
		let next_input = jQuery('input[name="main_url"]');
		let next_label = jQuery(next_input).prev('label');
		let nonextstep = document.createElement('span');
			nonextstep.classList.add('nonextstep');
			nonextstep.innerHTML = '<i class="fas fa-times"></i>'
		jQuery('.nextstep').remove();
		next_label.addClass('active');
		next_input.removeClass('inactive').focus();
		next_input.after(nonextstep);
		
	} else if( v.indexOf('http') == 0 && current_group.url == '' ){
		current_group.url = v;
			jQuery('.nextstep').remove();
			jQuery('.nonextstep').remove();
			jQuery('.top_label').removeClass('active');
			jQuery('#main_txt>input').addClass('inactive');
		if(current_group.title !== '' && current_group.url !== ''){
			jQuery('#side_control_buttons').removeClass('inactive');
			jQuery('#mapContainer').removeClass('inactive');
			jQuery('#main_txt>h2').text('Editing: '+current_group.title).fadeIn();
		} else { console.log('There was a problem adding This field name'); }

	} else { console.log('Step Error'); }
}
/* EDIT CENTER FUNCTIONS */
function layer_delete(ev){
	let li = jQuery(ev.currentTarget).parent();
	let killit = true;
	killit = confirm('Delete ' + li.text().trim() + '?');
	if(killit) li.remove();
}
function layer_edit(ev){
	let li = jQuery(ev.currentTarget).parent();
	let id = li.attr('id');
	let url = find_url(id);
	let offset_x = find_offset(id);
	console.log(offset_x);
	jQuery('#edit_center').attr('data-editing', id);
	jQuery('#edit_center').attr('style','top: ' + (offset_x + 195) + 'px;' );
	jQuery('#edit_center').addClass('active');
	jQuery('#edit_name').val( jQuery('#groups_list').find('#'+id).text().trim() );
	jQuery('#edit_url').val(url);
	/* @TODO put in logic to activate edit map button */
}
function find_url(s){
	s = '#'+s;
	let li = jQuery('#groups_list').find(s);
	console.log( li );
	let markup = jQuery(li).find('.hidden_code').html();
	let left = markup.indexOf('href="') + 6;
	let right = markup.indexOf('"', left );
	let link = markup.substring(left, right).trim();
	if(typeof link == 'undefined' || link.length == 0 ) link = false;
	if(debug)console.log('returning url:' + link);
	return link;
}
function find_offset(id){
	let ele = document.getElementById(id);
	let off_x = ele.offsetTop;
	console.log('off_x: ' + off_x );
	if( typeof off_x == 'undefined' || off_x < 0 ) off_x = 0;
	return off_x;
}
function is_valid_edit(elem){
	//add valid button & bind
	let okay = document.createElement('span');
	let the_id = elem.id;
	okay.classList.add('status');
	jQuery(okay).attr('data-field', the_id );
	okay.innerHTML = '<i class="fas fa-check"></i>'
	jQuery(elem).addClass('edited');
	jQuery('.status[data-field="'+ the_id + '"]').remove();
	jQuery(elem).after(okay);
}
function not_valid_edit(elem){
	let nope = document.createElement('span');
	let the_id = elem.id;
	nope.classList.add('status');
	jQuery(nope).attr('data-field', the_id );
	nope.innerHTML = '<i class="fas fa-times"></i>'
	jQuery(elem).removeClass('edited');
	jQuery('.status[data-field="'+ the_id + '"]').remove();
	jQuery(elem).after(nope);
}
function check_button(elem){
	let area = jQuery(elem).parent();
	if(jQuery(area).find('.edited').length ){
		jQuery('#edit_save_changes').attr('disabled',false);
		jQuery('#edit_save_changes').removeClass('inactive');
	} else {
			jQuery('#edit_save_changes').attr('disabled',true);
			jQuery('#edit_save_changes').addClass('inactive');
			}
}

function save_edits(){
	let ec = jQuery('#edit_center');
	let lid = ec.attr('data-editing');
	let title = false;
	let name = false;
	let url = false;
	jQuery('.edited').each(function(){
		if(this.id == 'edit_name'){
			title = this.value.trim();
			name =  title.replace(/ /g,"_").toLowerCase();
		} else if( this.id == 'edit_url'){
			url = this.value.trim();
		}
	});
	var list_item = jQuery('#groups_list').find( '#'+ lid );
	var code = jQuery(list_item).find('.hidden_code');
	var markup = code.html();
	if( name && title ) {
		let left = markup.indexOf('alt="') + 5;
		let right = markup.indexOf('"', left);
		var old_title = markup.substring(left, right);
		var old_name = old_title.replace(/ /g,"_").toLowerCase();
		let rx_t = new RegExp(old_title, "g");
		let rx_n = new RegExp(old_name, "g");
		markup = markup.replace(rx_t, title).replace(rx_n, name);
		var itm = document.getElementById(lid);
		itm.id = name;
		jQuery(itm).find('.layer_title').text(title);
		
	}
	if(url){
		let left = markup.indexOf('href="') + 6;
		let right = markup.indexOf('"', left);
		let old_url = markup.substring(left,right);
		let rx_u = new RegExp(old_url, "g");
		markup = markup.replace(rx_u, url);
	}
code.html(markup);
code.find('.layer_delete').click(function(e){ layer_delete(e); });
code.find('.layer_edit').click(function(e){ layer_edit(e); });
jQuery('#edit_center').attr('data-editing', '');
jQuery('#edit_center').removeClass('active');
}

function map_preview(){
	let function_counter = 0;
	let this_layer = '';
	let color_fill = [
		['407F7F','9BC1C1'],
		['2E4372','7887AB'],
		['0E563B','73AC96'],
		['1E6A12','97D38D'],
		['497A18','C4E7A0'],
		['76841A','EFF9AC'],
		['87821B','FFFBB1'],
		['87621B','FFE4B1'],
		['87431B','FFCEB1'],
		['7B1932','EAA2B4']
	];
	if(jQuery('#groups_list').children('li').length ){
		let map = document.getElementById('map');
		var inner = '';
		jQuery('#groups_list').children('li').each(function(){
			let this_markup = jQuery(this).find('.hidden_code').html();
			console.log( this_markup );
			let left = this_markup.indexOf('name="') + 6;
			let right = this_markup.indexOf('"', left);
			let step_layer = this_markup.substring(left, right);
			console.log(step_layer);
			if( step_layer !== this_layer ) function_counter > 9 ? function_counter = 0 : function_counter++;
			console.log( function_counter );
			let area_array = this_markup.split('>');
			jQuery(area_array).each(function(){
				if(this.toString().length > 1 ) {
				new_area = this.toString() + 'data-maphilight=\'{"strokeColor":"' + color_fill[function_counter][0] + '","fillColor":"' + color_fill[function_counter][1] + '", "groupBy":"alt", "alwaysOn": true, "fillOpacity": 0.4}\' >';
				} else {
					new_area = '';
				}
				inner += new_area;
			});
		
		});
	map.innerHTML = inner;
	let exit_p = document.createElement('span');
	exit_p.id = 'exit_preview';
	jQuery(exit_p).html('<i class="far fa-times-circle"></i> CLICK TO EXIT PREVIEW');

	jQuery('#mapContainer').addClass('inactive');
	jQuery('.imgmapMainImage').maphilight();

	console.log(exit_p);
	jQuery("#coords_area").after(exit_p);
	jQuery('#exit_preview').click(function(){ exit_preview(); });
	} else {alert('No saved groups to preview')};
}
function exit_preview(){
	jQuery('#coordsText').val('');
	jQuery('#areaText').val('');
	jQuery('#mapContainer').find('map').empty();
	jQuery('#dots').empty();
	jQuery('.imgmapMainImage').removeClass('maphilighted');
	jQuery('#mapContainer').removeClass('inactive');
	current_group.title = ''; current_group.url = ''; current_group.name = '';
	jQuery('#top_controls').removeClass('inactive');
	jQuery('#side_control_buttons').addClass('inactive');
	jQuery('#mapContainer').addClass('inactive');
	jQuery('#main_txt>h2').text('Add New Set Piece').fadeIn();
	jQuery('input[name="main_name"]').val('');
	jQuery('input[name="main_url"]').val('');
	jQuery('#all_done').removeClass('inactive');
	jQuery('canvas').remove();
	jQuery('#exit_preview').remove();

}
