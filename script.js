/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

function renderMenu() {
	$('#content').empty();
	$('#list').empty();

	$('#list').append('<li><a class="openable" href="http://delicious.com/' + localStorage['username'] + '">Delicious.com Profile</a></li>');
	$('#list').append('<li><a onclick="renderTags()" href="#">Browse by tag</a></li>');
	//$('#list').append('<li><a onclick="renderStacks()" href="">Browse by stack</a></li>'); //@TODO
	$('#list').append('<hr />');
	$('#list').append('<li><a onclick="renderInsertForm()" href="#">Add/edit the current webpage</a></li>');

	openLinksNewTab('.openable');
}

function renderTags() {
	clear();
	$('#list').append('<li><a onclick="renderMenu()" href="">Menu</a></li>');
	$('#list').append('<hr />');

	api('https://api.del.icio.us/v1/tags/get', function(xml) {
		$(xml).find('tag').each(function() {
			var tag = $(this).attr('tag');
			var link = $('<a href="#">'+tag+'</a>').click(function() {
				var tags = [$(this).text()];
				renderBookmarks(tags);
				return false;
			});
			var item = $('<li class="item"></li>');
			item.append(link);
			$('#list').append(item);
		});
	});

	$('#content').empty().append('<input type="text" id="search" placeholder="Search..." />');
	$('#search').keypress(function(event) {
		if ( event.which == 13 ) {
    		event.preventDefault();
		}
	}).keyup(function(event) { quickSearch($('#search').val()); });
}

function renderBookmarks(tags, stack) {
	clear();
	if(stack === undefined || stack == false) {
		$('#list').append('<li><a onclick="renderTags()" href="#">Back</a></li>');
	} else {
		$('#list').append('<li><a onclick="renderStacks()" href="#">Back</a></li>');
	}
	$('#list').append('<hr />');

	say('Loading...');

	for(var i in tags) {
		api('https://api.del.icio.us/v1/posts/all?&tag='+tags[i], function(xml) {
			$(xml).find('post').each(function() {
				var link = $('<a href="'+$(this).attr('href')+'">'+$(this).attr('description')+'</a>').click(function() {
					chrome.tabs.create({'url' : $(this).attr('href')});
					return false;
				});
				var item = $('<li class="item"></li>');
				item.append(link);
				$('#list').append(item);
			});
		});
		delay(5000);
	}

	$('#content').empty().append('<input type="text" id="search" placeholder="Search..." />');
	$('#search').keypress(function(event) {
		if ( event.which == 13 ) {
    		event.preventDefault();
		}
	}).keyup(function(event) { quickSearch($('#search').val()); });
}

function renderInsertForm() {
	chrome.tabs.getSelected(null, function(tab) {
		f = 'http://www.delicious.com/save?url=' + encodeURIComponent(tab.url) + '&title=' + encodeURIComponent(tab.title) + '&v=6&';
		a = function() {
			var center = 'top=' + (screen.height/2 - 630/2) + ',left=' + (screen.width/2 - 710/2);
		    if(!window.open(f+'noui=1&jump=doclose','deliciousuiv6','location=1,links=0,scrollbars=0,toolbar=0,titlebar=0,width=710,height=660,'+center)) {
			    tab.url = f + 'jump=yes';
			}
		};
		a();
	});
}

function quickSearch(query) {
	$(".item").each(function() {
		var title = $(this).find('a').text();
		var re = new RegExp(query, 'i');
		if(title.search(re) != -1) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
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

function delay(ms) {
	var wait = true;
	setTimeout(function(wait){
		wait = false;
	}, ms);
	while(wait) { break; }
}