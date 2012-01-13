function renderMenu() {
	$('#content').empty();
	$('#list').empty();

	$('#list').append('<li><a class="openable" href="http://delicious.com/' + localStorage['username'] + '">Delicious.com Profile</a></li>');
	$('#list').append('<li><a onclick="renderTags()" href="">Browse by tag</a></li>');
	$('#list').append('<li><a onclick="renderStacks()" href="">Browse by stack</a></li>');
	$('#list').append('<hr />');
	$('#list').append('<li><a onclick="renderInsertForm()" href="">Add to my bookmarks</a></li>');

	openLinksNewTab('.openable');
}


// HELPERS

function openLinksNewTab(selector) {
	$(selector).click(function(){
		chrome.tabs.create({'url' : $(this).attr('href')});
		return false;
	});
}

function clear() {
	$('#content').empty();
	$('#list').empty();
}

function api(url, success, error) {
	var user = localStorage["username"];
	var pass = localStorage["password"];

	$.ajax({
		url : url,
		contentType: 'application/xml; charset=utf-8',
		dataType : 'xml',
		beforeSend : function(xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent(user+':'+pass))));
		},
		success : success,
		error : function(xml, msg, error) {
			$('#content').empty().append('<p>An unexpected failure! '+msg+' - '+error+'.</p>');
			$('#container').css({'min-width' : '300px'});
		}
	});
}

function say(str) {
	$('#content').empty();
	$('#content').empty().append('<p>'+str+'.</p>');
}