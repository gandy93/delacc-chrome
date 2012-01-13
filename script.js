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