Ext = {
	//interval	: ( 5 * 60 ) * 1000, 	// Update interval 5 mins
	extensions	: {},
	debug		: false,
	localTest	: false,
	maxRank		: 1000,
	'keys'		: {
		'shift'	: false
	},
	XHR			: {},
		
	intervals 	: {
		//'1'		: '1 minute',
		'5' 	: '5 mins',
		'10' 	: '10 mins',
		'15'	: '15 mins',
		'30'	: '&#189; hour',
		'60'	: 'hour',
		'120' 	: '2 hrs',
		'-1'	: '-- disabled'
	},
			
	tips		:  [
		'Hold down SHIFT when clicking to an extension\'s link in order to quick download/install the extension',
		'Click the pencil icon to go to extension\'s edit page.',
		'Columns are sortable.',
		'You can set the update interval in the options page.',
		'When an extension is updated within the last 10 hours, a NEW sign will show up in the extension row.',
		'Use  "<a href="http://bit.ly/7iEMXv" target="_blank" title="My Alerts extension">My Alerts</a> to track your extensions on Twitter, Google and Backtweets results.'
	],

	inPopup		: location.href.indexOf('popup') 		!== -1,
	inOptions	: location.href.indexOf('options') 		!== -1,
	inBg		: location.href.indexOf('background') 	!== -1,

		
	initialize	: function(force) {
		this.load();
		var tableContainer 	= $('table-container');
		
	
		
		if(this.inOptions) {
			$('wrapper').style.marginLeft = $('wrapper').style.marginRight ='auto';
			tableContainer.setHTML('<h3 style="position: absolute; top: 1px; left: 0px;">My Extensions &rarr; Options</h3><table class="table-options zy" style="display:'+(this.getTotal() >0 ? 'auto' : 'none')+'" border="0" cellspacing="0" id="table" summary="myExtensions"><thead><th colspan="2">Extension</th><td>Remove</td></tr></thead><tbody></tbody></table>');
			this.checkExtensionsCount();
			
			// Add some handlers
			var checkboxes	= Array.prototype.slice.call(document.body.getElements('input[type="checkbox"]'));
			var options  	= this.options;
			checkboxes.each(function(checkbox, index) {
				checkbox.addEventListener('change', function(event) {
					if(checkbox == checkboxes[0]) {
						options.notify.ratings = !!checkbox.checked
					}
					
					if(checkbox == checkboxes[1]) {
						options.notify.comments = !!checkbox.checked
					}
					
					if(checkbox == checkboxes[2]) {
						options.desktop.ratings = !!checkbox.checked
					}
					
					if(checkbox == checkboxes[3]) {
						options.desktop.comments = !!checkbox.checked
					}

										
									
					if(checkbox == checkboxes[4]) {
						options.compact = !!checkbox.checked
					}
					
					
					localStorage['options'] = JSON.stringify(options);
					
				}, false);
			});
			
			// Quick n' dirty
			if(!this.options.desktop) {
				this.options.desktop = {
					'comments' 	: true,
					'ratings'	: false
				}
			}
			
			if(this.options && this.options.notify) {
				if(this.options.notify['ratings']) {
					checkboxes[0].checked = true;
				}
				
				if(this.options.notify['comments']) {
					checkboxes[1].checked = true;
				}
				
				if(this.options.desktop['ratings']) {
					checkboxes[2].checked = true;
				}
				
				if(this.options.desktop['comments']) {
					checkboxes[3].checked = true;
				}

								
			}
			
			if(this.options && this.options.compact) {
				checkboxes[4].checked = true;
			}
			
			// Interval
			var interval 	= document.getElementById('interval');

			// Handle (ignore from)
			var handle		= document.getElementById('field-handle');
			handle.addEventListener('keyup', function() {
				options.ignoreFrom = handle.value.trim();
				localStorage['options'] = JSON.stringify(options);
			}, false);
			
		
			if(this.options.ignoreFrom) {
				
				handle.value = this.options.ignoreFrom;
			}

			var html 		= [];
			for(var value in this.intervals) {
				html.push ('<option '+(this.options.interval == value ? ' selected' : '') + ' value="'+value+'">'+this.intervals[value]+'</option>');
			}
			interval.innerHTML = html.join('');
			interval.addEventListener('change', function(event) {
				options.interval = interval.value;
				localStorage['options'] = JSON.stringify(options);
				
				Ext.Bg.interval()
			});
		}
		

			
		
		if(!this.extensions || this.getTotal() === 0) {
			if(this.inPopup) {
				//tableContainer.setHTML('<div id="empty"><h3>Aw Snap!</h3><p>It seems, you have not defined your extensions yet.</p><p>Go to the <a href="'+chrome.extension.getURL('options.hml')+'" target="_blank" title="Options">options page</a> to add them.</p></div>');
				tableContainer.setHTML('<div id="empty"><h3>Aw Snap!</h3><p>It seems, you have not defined your extensions yet.</p><p>Go to the <a href="javascript:void(0)" onclick="chrome.tabs.create({url:\'chrome-extension://\'+location.hostname+\'/options.html\'})">options page</a> to add them.</p></div>');
			}
		} else {
			if(this.inPopup) {
				
				if(this.options.compact) {
					document.body.className = 'compact';
				}

				tableContainer.setHTML('<div id="top-left"><a href="https://chrome.google.com/extensions/developer/dashboard"  target="_blank" title="Developer Dashboard (Gallery)" id="link-dashboard">Dashboard</a><a a href="https://chrome.google.com/extensions/detail/igejgfmbjjjjplnnlgnbejpkpdajkblm"  target="_blank" title="Feedback and comments" id="link-feedback">Feedback</a></div><div id="top-right"><a href="javascript:void(0)"  onclick="chrome.tabs.create({url:\'chrome-extension://\'+location.hostname+\'/options.html\'})" title="Extension options" id="link-options">Options</a> <span id="link-extensions" class="foo" onclick="chrome.tabs.create({url: \'chrome://extensions/\'});" title="chrome://extensions/">Extensions</span></div><table border="0" cellspacing="0" id="table" summary="myExtensions">' + 
				(!Ext.options.compact ? 
				'<thead class="thead-top"><tr><th class="cell-img"></th><th class="cell-link">&nbsp;</th><td colspan="2" class="cell-thead-asof"><dfn id="ranks-updated" title="As of: ' + Ext.getTime(Ext.ranksUpdated * 1000) + '">out of <span id="total-extensions">'+(Ext.totalExtensions || 0).toFormatted()+'</span></dfn></td><td class="cell-users"><span id="total-users">'+(Ext.getTotalUsers())+'</span></td><td class="cell-installs"></td><td class="cell-ratings"></td><td class="cell-ratings-total"></td><td class="cell-comments"></td></tr></thead>' : '' ) +
				
				(!Ext.options.compact ? 
				'<thead><th class="cell-img"></th><th class="sort sort-asc cell-link">Extension or Theme</th><td class="cell-rank-popularity sort">Popularity</td><td class="cell-rank-rating sort">Rating<td class="cell-users sort"><dfn title="(Weekly) Computed from update pings in the last week">Users</dfn></td><td class="cell-installs sort"><dfn title="Number of installs in the last week">Installs</dfn></td><td colspan="2" style="text-align: center; sort" class="sort cell-thead-ratings">Ratings</td><td class="cell-comments sort"><img src="img/cell-feedback.png" /></td></tr></thead>'  : 
				'<thead><th class="cell-img"></th><th class="sort sort-asc cell-link">Extension or Theme</th><td colspan="2" style="text-align: center;width: 135px;" class="sort cell-thead-version">Version</td><td colspan="2" style="text-align: center;" class="sort cell-thead-ratings">Ratings</td><td class="cell-comments sort"><img src="img/cell-feedback.png" /></td></tr></thead>' ) +
				
				'<tbody></tbody></table><span id="update"><div style="color: #999;overflow: hidden;margin-top: 10px;"><span style="float: left;"><button onclick="Ext.Bg.update()" title="Update extensions now" id="update-now">update now</button>  <span class="foo" id="mark" onclick="Ext.seen()">Reset badges</span></span><div style="float: right; margin-top: 5px;">' + (!Ext.options.compact && this.options.interval != -1 ? 'Auto updates every '+this.intervals[this.options.interval]+' - ' : '') +  '<span id="last-updated"></span></div></div><div id="tip">TIP: '+Ext.tips[ Math.floor(Math.random() * Ext.tips.length) ]+'</div>');
				
				// Nifty trick ;p
				var limit =  this.options.compact ?  15 : 10;
				if(this.getTotal() > limit  ) {
					$('wrapper').style.marginRight = '20px';
				}
				
				
				// ADDED: 01.NOE.010
				if(screen.height < 800) {
					$('wrapper').style.maxHeight = (screen.height - 50 - 40) + 'px';
					$('wrapper').className = 'overflow';
				}

				
				var sorters = {
					'ranks' : function(cell) {
						var value = cell.textContent.replace(/NEW/, '');
						if(value.indexOf('>') != -1) {
							value = 99999;
						}
					
						return parseInt(value);						
					},
					
					'generic' : function(cell) {

						return parseInt(cell.textContent.replace(/,/ , ''));
					},
					
					'float'	: function(cell) {
						return parseFloat(cell.textContent.replace(/NEW/, ''));
					},
					
					'v'		: function(cell) {
						return parseInt(cell.getAttribute('v'));
					}
				}
						
				if(!Ext.options.compact) {
					Ext.tableSort = new TableSort(document.getElementsByTagName('table')[0], {
						'theadIndex' 		: 1,
						'onSort'			: function(index, mode, cell) {
							localStorage['sort'] = JSON.stringify({
								'index' : index,
								'mode'	: mode
							});
							
						},
						'cellRules'			: {
							'0'	: null,
							'2'	: {
								'fn' : sorters['ranks']
							},
	
							'3'	: {
								'fn' : sorters['ranks']
							},
							
							'4'	: {
								'fn' : sorters['generic']
							},
							
							'5'	: {
								'fn' : sorters['generic']
							},
							
							'6'	: {
								'fn' 	: sorters['decimal'],
								'type'	: 'float'
							},
	
							'7'	: {
								'index'	: 8, // different
								'fn' 	: sorters['generic']
							}
						}					
					});
					
				} else {
					Ext.tableSort = new TableSort(document.getElementsByTagName('table')[0], {
						'theadIndex' 		: 0,
						'onSort'			: function(index, mode, cell) {
							localStorage['sort'] = JSON.stringify({
								'index' : index,
								'mode'	: mode
							});
							
						},
						'cellRules'			: {
							'0'	: null,
							'2'	: {
								'fn' : sorters['v']
							},
	
							'3'	: {
								'index'  : 4,
								'fn' 	: sorters['decimal'],
								'type'	: 'float'
							},
							
							'4'	: {
								'index' : 6,
								'fn' : sorters['generic']
							}
						}					
					});				
							
				}
				
				//console.log(localStorage['sort']);
				
				//	console.log( Ext.tableSort.thead.getElements('td,th') );
				//window.onload = function() { Ext.tableSort.sort(3) }
			
			}
			
			
			
			each(Ext.extensions, function(data, hash)	 {
				new Ext.Extension(hash);
			});
				
		}
	
	
		// Popup only
		if(this.inPopup) {
			window.addEventListener('keydown', function(event) {
				switch(event.keyCode) {
					case 16:
						Ext.keys.shift 	= true;
						break;
					case 18:
						Ext.keys.alt 	= true
						break;
					case 17:
						Ext.keys.ctrl 	= true;
						break;
				}
				
				// Toggle = ctrl+shift+r OR ctrl+shift+f5
				if(Ext.keys.ctrl && Ext.keys.shift && (event.keyCode === 114 || event.keyCode === 82)) {
					Ext.toggle();
				}
				
				//Ext.restart();	
				
			});
			
			
			window.addEventListener('mouseup', function(event) {
				// Reset keys // CHANGED 14.1.2010
				// Ext.keys.shift = Ext.keys.alt = Ext.keys.ctrl = false;
				// Ext.restart();	
			});
				
			window.addEventListener('keyup', function(event) {
				switch(event.keyCode) {
					case 16:
						Ext.keys.shift 	= false;
						break;
					case 18:
						Ext.keys.alt 	= false
						break;
					case 17:
						Ext.keys.ctrl 	= false;
						break;
				}
			});		
			


			chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
				if(req.action) {
					if(req.action === 'update') {
						
						var extension = Ext.extensions[req.instance.hash];
						if(!extension) {
							return this;
						}
						
						$extend(extension, {
							'title'		: req.instance.title,
							'users'		: $merge(req.instance.users),
							'ranking'	: $merge(req.instance.ranking),
							'installs'	: $merge(req.instance.installs), // weekly
							'updated'	: req.instance.updated,
							'ratings'	: $merge(req.instance.ratings),
							'comments'	: $merge(req.instance.comments),
							'version'	: req.instance.version,
							'versionDT'	: req.instance.versionDT,
							'author'	: req.instance.author,
							'img'		: req.instance.img						
						});
						
						
						if(Ext.inPopup) {
							Ext.extensions[req.instance.hash]['update']();
							Ext.extensions[req.instance.hash].handleComments().handleRatings();
						}
					}
					
					if(req.action === 'updateStart') {
						Ext.updateStart();
					}
					
					if(req.action === 'updateProgress') {
						if($('update-now')) {
							this.step	= req.step;
							this.total 	= req.total;
							Ext.updateProgress(req.step, req.total);
						} else {
							return this;
						}
					}
				}
			});
		
			
			!this.inOptions && this.updateTS();		
		}
		
	
		
		/* Apply tool tips here */
		if(Ext.inPopup) {
			Ext.tooltips = {
				'plain'				: [],
				'comments'			: {},
				'ratings'			: {},
				'users'				: {},
				'rank.popularity' 	: {},
				'rank.rating'		: {}
			};
			
			// Plain irst
			if( 0 )
			document.body.getElements('thead dfn').each(function(element, index) {
				Ext.tooltips['plain'].push(new Tooltip(element, element.title.replace(/\n/gi, '<br />') ) );
			});
			
			// Delayed is better
			(function() {
				
				document.body.getElements('tbody .cell-ratings').each(function(element, index) {
					
					Ext.tooltips['ratings'][element.title] = new Tooltip(element, Ext.extensions[element.title].getStarsHTML());
				});
				
				document.body.getElements('tbody .cell-comments').each(function(element, index) {
					Ext.tooltips['comments'][element.title] = new Tooltip(element, Ext.extensions[element.title].getCommentsHTML(), {
						'dontCloseOnElement'	: true
					});
				});		
				
			
				document.body.getElements('tbody .cell-rank-popularity').each(function(element, index) {
					Ext.tooltips['rank.popularity'][element.title] = new Tooltip(element, Ext.extensions[element.title].getGraph('popularity', element));
				}, this);	
				
	
				document.body.getElements('tbody .cell-rank-rating').each(function(element, index) {
					Ext.tooltips['rank.rating'][element.title] = new Tooltip(element, Ext.extensions[element.title].getGraph('rating', element));
				}, this);
				
				
				// NOT FOR NOW!
				if(0)
				document.body.getElements('tbody .cell-users').each(function(element, index) {
					Ext.tooltips['users'][element.title] = new Tooltip(element, Ext.extensions[element.title].getGraph('users', element));
				}, this);				
				
			}).delay(500, this);


			
		}
				
		
		return this;
	},
	
	install			: function(hash, event) {
		var url ='https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D'+hash+'%26uc%26lang%3D'+navigator.language+'&prod=chrome&prodversion='+navigator.appVersion.match(/Chrome\/(.*?) /)[1];
		
		
		if(1) {
			chrome.tabs.create({
				'url' : url,
				'selected' : false
			}, function(tab) {
				var fn = function(tabId) {
					chrome.tabs.remove(tabId);
				}
				
				chrome.tabs.onUpdated.addListener(function(tabId, info) {
					if(tabId == tab.id) {
						if(info.status == 'complete') {
							fn(tabId);
						}							
						chrome.tabs.onUpdated.removeListener(fn);
					}
				});					
			});
		}		
		
		return this;
	},
	
	// Reset and hide badges
	seen			: function(hash, event) {
		// Clicking
		if(event && Ext.keys.shift) {
			event.stopPropagation();
			event.preventDefault();
			
			this.install(hash,event);			

			
			if(0)
			location.href = url;
//			window.location.href = 'https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D'+hash+'%26uc%26lang%3D'+navigator.language+'&prod=chrome&prodversion='+navigator.appVersion.match(/Chrome\/(.*?) /)[1];
			
			// Just to make sure
			Ext.keys.shift = null;
			return false;
		}
		
		var left 			= false;
		var extension		= hash ? this.extensions[hash] : null;
		
	
		
		if(extension) {
			extension.comments['new'] = extension.ratings['new']  = false;
			extension.elements.ratingsBadge.hide();
			extension.elements.commentsBadge.hide();
		}
		
		// Any left?	
		each(this.extensions, function(ext) {
			if(!hash) {
				ext.comments['new'] = ext.ratings['new']  = false;
				ext.elements.ratingsBadge.hide();
				ext.elements.commentsBadge.hide();
			} else {
				left					= left || ext.comments['new'] || ext.ratings['new'];
			}
		});
		
		
		
		if(!left) {
			this.hideBadge();
			if($('mark')) {
				$('mark').hide();
			}
		}
		
		
		Ext.store(true);
		
		//Ext.Bg.reload();		
		

				
	
		return true;
	},
	
	shouldGetRatings	: function() {
		// LET IT BE TRUE AT ALL TIMES FOR NOW
		var result = true;
		
		each(this.extensions, function(extension) {
			if(!extension.ranksFetched) {
				result = true;
			}
		});
	
		if(!result && Ext.ranksUpdated) {
			var diff = (new Date().getTime() - (Ext.ranksUpdated * 1000) ) / 1000;	
			if(diff > 3600 * 2) {
				result = true;
			}
		}		

		return result;
	},
	
	
	
	hideBadge		: function() {
		chrome.browserAction.setBadgeText({
			'text' : ''
		});
		
		return this;
	},
	
	showBadge		: function(mode) {
		chrome.browserAction.setBadgeText({
			'text' : 'NEW'
		});
		
		chrome.browserAction.setBadgeBackgroundColor({
			'color'	 : (mode !== 'ratings' ? [255, 0, 0, 255] : [255,102,0, 255])
		})
		
		return this;
	},
	
	// Check if this url is one of any of the extensions
	scanURL				 : function(url) {
		alert(url);
		each(this.extensions, function(extension, hash) {
			if(url.indexOf(hash) !== -1) {
				alert(0);
				//extension.resetComments();
			}
		});
	},
	
	getTotalUsers		: function() {
		var total 	= 0;
		var cnt 	= 0;
		for(var i in this.extensions) {
			cnt ++;
		//	this.extensions.each(function(ext, index) {
			total += this.extensions[i].users.total || 0;
		};
		
		// Not for just 1:)
		return cnt > 1 ? total.toFormatted(0) : '';
	},
	
	getTime				: function(ts) {
		if(!ts)	 {
			return 'N/A';
		}
		ts = parseInt(ts)
		var dt = new Date(ts);

		return [dt.getHours().pad(2), dt.getMinutes().pad(2)].join(':');
	},
	
	checkExtensionsCount : function() {
		if(!this.inOptions) {
			return false;
		}
		var total = this.getTotal();
		if(total) {
			$('empty').hide();
			$('table').style.display = 'table';
		} else {
			$('empty').show();
			$('table').hide();
		}
		
		return this;
	},	
	
	load		: function() {
		this.extensions			= this.options = null;
		
		this.extensions			= localStorage['data'] ? JSON.parse(localStorage['data']) : {};
		
		this.username			= localStorage['username'] || '';
		
		this.options			= localStorage['options'] ? JSON.parse(localStorage['options']) : { 'desktop' : { 'comments' : true, 'ratings' : false}, 'notify' : { 'comments': true, 'ratings' : true}};
		this.totalExtensions	= localStorage['totalExtensions'] ? parseInt(localStorage['totalExtensions']) : 0;
		
		//this.ranksUpdated		= localStorage['ranksUpdated'] ? parseInt(localStorage['ranksUpdated']) : 0;
		// Keep it to zero for now
		this.ranksUpdated		= 0;
		
		this.options.interval	= this.options.interval || 5;
			
		if(this.extensions)	{
			// Sort extensions
			var sorted  		= {};
			var sortTempArray 	= [];
			each(this.extensions, function(extension) {
				// A hack for debug;
				if(extension.hash === 'plnemfhpneldfafgllajkpcbflmkfkjd') {
					Ext.debug = true;
				}
				sortTempArray.push(extension);
			});
			
				
	
			
			var sortfn  = function(a, b) {
				if(a && a.title && b && b.title) {
					var first = a.title.toLowerCase(); second = b.title.toLowerCase();
					return first === second ? 0 : (first < second ? -1 : 1);			
				} else {
					return false;
				}
			}
			
			sortTempArray.sort(sortfn)
			var self = this;
			sortTempArray.each(function(extension) {
				sorted[extension.hash] = extension;
			}, this);
			
	
			this.extensions = sorted;
			
			// Needed
			sorted 			= sortFn = null;
			sortTempArray 	= null;
		}		
		
		// For starters
		Ext.hideBadge();
		
		// Stupido
		each(this.extensions, function(extension) {
			if(extension['comments']['new'] && Ext.options.notify.comments ) {
				// IgnoreFrom goes here
				if(extension.comments.latest && (extension.comments.latest.entity.nickname != Ext.options.ignoreFrom )) {
					Ext.showBadge('comments');
				}
			}
			if(extension['ratings']['new'] && Ext.options.notify.ratings ) {
				Ext.showBadge('ratings');
			}
			
			// Desktop notifications handlers
			if(!Ext.options.desktop) {
				Ext.options.desktop = {
					'comments' : true
				}
			}
			if(extension['comments']['new'] && Ext.options.desktop.comments ) {
				if(extension.comments.latest && extension.comments.latest.entity && ( (Ext.inBg && !Ext.bgDone) || (extension.desktopNotified != extension.comments.latest.timestamp) )) {
					if(extension.comments.latest.entity.nickname != Ext.options.ignoreFrom) {
						new Ext.Notification((extension.comments.latest && extension.comments.latest.comment ? extension.comments.latest.comment : 'N/A'), 'New comment for ' + extension.title + ' (from '+ (extension.comments.latest.entity.nickname || 'Anonymoys') +')');
					}
					
					// Timestamp instead
					extension.desktopNotified = extension.comments.latest.timestamp;
					Ext.store();
				}
			}
			
			// TODO: 2beimplemented!
			// if(extension['ratings']['new'] && Ext.options.desktop.ratings ) {
			// 	Ext.showBadge('ratings');
			// }			
			
		});
		
		
		
		return this.extensions;
	},
	
	
	// This should be called JUST once
	// Whenever we store > update something
	store		: function(justStore) {
		var toStore				= {};
		var extension, value;
		for(var id in this.extensions) {
			extension 	= this.extensions[id];
			toStore[id] = {};
			
			for(var key in extension) {
				value = extension[key];
				if(value && key !== 'XHR' && key !== 'elements' && typeof(value) !== 'function' && !value.nodeName) {
					toStore[id][key] = value;
				}
				
				//toStore[id]['comments']['new'] = true;
			}
			
			Ext.updated = toStore[id]['updated']= new Date().getTime();
		}
		
	
		localStorage['data']			= JSON.stringify(toStore);
		localStorage['totalExtensions']	= this.totalExtensions;
		localStorage['ranksUpdated']	= this.ranksUpdated;
		localStorage['username'] 		= Ext.username || localStorage['username'];
		
		toStore = null;
			
		Ext.Bg.reload();
		
		if(justStore) {
			return this;
		}
			
		Ext.sendRequest({
			'action' : 'updateProgress',
			'step'	 : this.step 	|| 0,
			'total'	 : this.total 	|| 0
		});

		
		//Ext.Bg.reload();
		
		// Enable it back
		this.addEnable();
		
				
		return this;
	},
	
	updateTS	: function() {
		if(!this.inPopup || !$('last-updated')) {
			return false;	
		}
		
				
		if(!this.updated && this.extensions) {
			each(this.extensions, function(extension) {
				Ext.updated = extension.updated;
			});
		} else {
			this.updated = new Date().getTime();	
		}
		
		
		
		var date = new Date(this.updated);
		$('last-updated').setHTML('Updated: ' + [date.getHours().pad(2), date.getMinutes().pad(2)].join(':'));
		
		return this;
	},
	
	getTotal	: function() {
		var total = 0;
		each(this.extensions, function() {
			total++;
		});
		
		return(this.total = total);
	},

	updateStart : function() {
		this.step			= 0; // Hold update progress
		this.total			= this.getTotal();
				
		var button 			= $('update-now');
		if(button) {
			button.disabled	 = true;
			button.innerHTML = 'Updating, please wait';
		}	
		
		return this;
	},
	
	updateProgress	: function(step, total) {
		this.updateTS();	
		
		this.step++;
			
		var actions = 4;
		if(!Ext.shouldGetRatings()) {
			actions = 3;
		}
	
		var percent = Math.round( (100 * this.step) / (this.getTotal() * actions) ).pad(2);	
		
		// Store it
				
		if(percent >= 100 ) {
			(function() {
				$('update-now').disabled = false;
				$('update-now').setHTML ('Update now');
			}).delay(750, this);
		}
		
		// ADDED: percent < 101 13.3.2010
		if(percent && !isNaN(percent) && percent < 101) {
			if($('update-now')) {
				$('update-now').innerHTML = 'Updating (' + ( percent)+ '%)';
			}
		}
		
		return this;
	},
	
	update			: function() {
		Ext.sendRequest({
			'action' : 'updateStart'
		});
			
		each(this.extensions, function(extension) {
			extension.getMeta();
		});
		
		if(this.inBg) {
			if(this.timer) {
				this.timer - $clear(this.timer)
			}
			
			// console.log('UPDAtING - ' + this.options.interval);
			if( parseInt(this.options.interval) !== -1) {
				this.timer 	= this.update.delay(parseInt(this.options.interval) * 1000 * 60, this);
			}
			
		}
		
		return this;
	},
	
	addDisable	: function() {
		if(this.inOptions) {
			$('button').disabled 	= true
			$('button').innerHTML = 'Please wait ...';
		}
		
		return this;
	},
	
	addEnable	: function() {
		if(this.inOptions) {
			$('button').disabled 	= false;
			$('button').innerHTML = '+ Add';
		}
		
		this.checkExtensionsCount();
		
		return this;
	},
	
	exists		: function(hash) {
		return this.extensions && !!this.extensions[hash];	
	},
	
	find		: function() {
		var found 		= [];
		var username 	= window.prompt('Please enter your Google username (e.g phaistonian).\n(The one you used to add your extensions to the Gallery)', Ext.username && Ext.username !== 'undefined' ? Ext.username : '');
		if(!username) {
			return;
		}
		
		// Store it here
		localStorage['username'] = Ext.username = username;
		
		new Ajax({
			'method'	: 'GET',
			'url'		: 'https://chrome.google.com/extensions/search?q=' + username,
			'onSuccess' : function(xhr) {
				var dump = xhr.responseText;
				if(!dump) {
					alert('Network error, can not retrieve content. Please try again later.');
					return;
				}
				var reg 		= new RegExp('<h2>.*?detail/([\\s\\S]*?)"', 'gi');
				var matches 	= dump.match(reg);
				
				if(matches && matches.length) {
					matches.each(function(match, index) {
						var extension = match.match(/detail\/(.*?)"/i);
						if(extension[1]) {
							if(!Ext.exists(extension[1])) {
								Ext.add(extension[1]);
							}
						}
						
					});
				} else {
					alert('No extension found for given account');
				}
			}
		}).send();
		
		return this;
	},
	
	add			: function(hash) {
		$('hash').value			 = '';
		hash					= hash.trim();
		
		if(hash.length != 32) {
			alert('Invalid extension hash given (must be 32 chars');
			$('hash').focus();
			return;
		}
		
		if(Ext.exists(hash) && Ext.extensions[hash].title) {
			alert('Extension is already set.');
			$('hash').focus();
			return;
		}
		
		return new Ext.Extension(hash);		
	},
	
	remove		: function(hash) {
		this.extensions[hash].remove();
		return this;
	},
	
	sendRequest	: function(obj) {
		var instance = {};
		if(obj.instance) {
			for( var key in obj.instance) {
				if(typeof (obj.instance[key]) != 'function') {
					instance[key] = obj.instance[key];
				}
			}
			
			obj.instance = instance;
		}
		
		chrome.extension.sendRequest(obj);
		return this;
	}	
}




















// Class
Ext.Extension = new Class({
	initialize	: function(hash) {
		this.hash				= hash;
		if(Ext.extensions[hash]) {
			$extend(this,Ext.extensions[hash]);
			
			this.ratings 	= this.ratings || {
				'total' 			: 0,
				'average' 			: 0,
				'previousAverage' 	: 0,
				'stars'				: null,
				'previous'			: null,
				'new'				: false
			}
			
			this.comments	= this.comments || {
				'total'				: 0,
				'previous'			: null,
				'latest'			: {},
				'latestPrevious' 	: {},
				'new'				: false
			} 
			
			this.ranking	= this.ranking || {
				'total'			: null,
				'popularity'	: null,
				'rating'		: null,
				'ts'			: null
			}
			
			this.installs	= this.installs || {
				'total'		: 0,
				'previous'	: null
			}
			
			
			this.users		= this.users || {
				'total'		: 0,
				'previous'	: null				
			}
			
			Ext.extensions[hash] = this;
			
				
				if(Ext.inPopup) {
				if(this.comments['new'] || this.ratings['new'] ){
					
					$('mark').style.display = 'inline';
				}
			}
				

			
			return this.renderElement();
		} else {
			Ext.addDisable();

			this.ratings 	= this.ratings || {
				'total' 	: 0,
				'average' 	: 0,
				'previousAverage' : 0,
				'previous'	: null,
				'new'		: false
			}
			
			this.comments	= this.comments || {
				'total'		: 0,
				'previous'	: null,
				'latest'	: {},
				'new'		: false
			} 
			
			this.installs	= this.installs || {
				'total'		: 0,
				'previous'	: null
			}
			
			
			this.users		= this.users || {
				'total'		: 0,
				'previous'	: null				
			}
	
			this.ranking	= {
				'total'			: null,
				'popularity'	: null,
				'rating'		: null,
				'ts'			: null
			}
	
			Ext.extensions[hash] = this;
				
			return this.getMeta();
		}
		
		return this;
	},
	
	// Store to localStorage
	// Skip functions
	store		: function() {
		var toStore = {};
		each(Ext.ex)
		
		
		return this;
	},
	
	remove		: function() {
		delete(Ext.extensions[this.hash]);
		if($('row-' + this.hash)) {
			$('row-' + this.hash).remove();			
		}
		Ext.store();
		Ext.Bg.reload();
		
		return this;
	},
	

	update		: function() {
		
		if(Ext.inPopup || Ext.inOptions) {
			
			if(!this.elements) {

				this.renderElement();
				
			} else if(Ext.inPopup) {
				
				if(Ext.totalExtensions) {
					if($('total-extensions')) {
						$('total-extensions').innerHTML = Ext.totalExtensions.toFormatted();
					}
					//.toFormatted();
				}
				
				
				
							
				if(Ext.ranksUpdated && $('ranks-updated') ) {
					//$('ranks-updated').title = 'As of: ' + Ext.getTime(Ext.ranksUpdated * 1000);
				}
			
				if($('total-users')) {
					$('total-users').innerHTML = Ext.getTotalUsers();
				}

if($('florian')) {
					$('florian').innerHTML = this.users.total;
				}

				//if()
			

				this.elements.title.setHTML(this.title);
			
				//this.elements.img.style.backgroundImage = this.img;
				this.elements.img.src = this.img;
				
				
				//var versionDt = this.versionDT ? ', ' + this.versionDT : '';
				var versionDT = '', date, today = new Date(), now = today.getTime(), diff, hour = today.getHours(), isNew = '';
				if(this.versionDT) {
					date = new Date(parseInt(this.versionDT*1000));
					diff = now - date.getTime();
					
					
					
					if( diff  < (hour * (3600 * 1000)) ) {
						versionDT = ', Today'
					} else 	if( ( diff > hour * (3600 * 1000) ) && ( diff < (hour + 24)  * (3600 * 1000 )) )  {
						versionDT = ', Yesterday'
					} else {
						versionDT = ', ' + Math.round(diff / (86400 * 1000)) + ' days'
					}
					
					// New (updated)
					if(diff < 3600 * 1000 * 12) {
						isNew = ' <span class="new">(NEW)</span>'
					}
				}
				
				
				if(!Ext.options.compact) {
					this.elements.version.setHTML('V: ' + this.version + isNew + (versionDT ? '<dt>' + versionDT + '</dt>' : '') );
					this.elements.popularity.setHTML( this.ranking.popularity > 0 && this.ranking.popularity < 999999 ? this.ranking.popularity.toFormatted() : '>' + Ext.maxRank );
					this.elements.rating.setHTML(this.ranking.rating > 0 && this.ranking.rating < 999999  ? this.ranking.rating.toFormatted() : '>' + Ext.maxRank);
					this.elements.users.setHTML((this.users.total || 0).toFormatted(','));
					this.elements.installs.setHTML((this.installs.total || 0).toFormatted(','));
				}  else {
					
					this.elements.versionDT.setHTML(versionDT.replace(/, /, ''));
					this.elements.versionDT.setAttribute('v', parseInt(this.versionDT*1000) );
					
					this.elements.version.setHTML('('+this.version+')');
					
				}
				
				var html = this.ratings.average.toFixed(2), ret;
				// NOT FOR NOW
				if(0) {
					if(ret = this.getStars()) {
						html = '<dfn title="'+ret+'">'  + html + '</dfn>';
					}
				}  else {
					html = '<dfn>' + html + '</dfn>';
					
				}
				
				if(Ext.tooltips['ratings'][this.hash]) {
					Ext.tooltips['ratings'][this.hash].setContent(this.getStarsHTML() );
				}

				if(Ext.tooltips['comments'][this.hash]) {
					Ext.tooltips['comments'][this.hash].setContent(this.getCommentsHTML() );
				}
				
				this.elements.ratingsAverage.setHTML(html);
				this.elements.ratingsTotal.setHTML('('+this.ratings.total.toFormatted(',') +')');
				
				/*
				var html =  0 && this.comments.latest && this.comments.latest.entity ? '<dfn title="Latest from '+ (this.comments.latest.entity.nickname || 'Anonymoys') + ':\n' + this.comments.latest.comment.replace(/"/gi, '&quot;')+'">'+this.comments.total.toFormatted(',') + '</dfn>' : this.comments.total.toFormatted(',');
				*/
				html = this.comments.total ? '<dfn> ' + this.comments.total.toFormatted(',') + '</dfn>' : '0';
				
				this.elements.comments.setHTML(html);
				
				
				
				if(this.author) {
					this.elements.title.title = 'By ' + this.author;
				}
				return this;	
			}
			
			
			
		}	
		
		return this;
	},
	
	renderElement	: function() {
		if(!Ext.inPopup && !Ext.inOptions) {
			return this;
		}
		
		
		var tbody		= $('table').getElement('tbody');
		var row			= $C('tr');
		var cells;
		var html 		= [];
		
		row.id			= 'row-' + this.hash
		
		if(this.ranking && this.ranking.featured) {
			row.addClass('featured');
		}
		
		
		var versionDT = '', date, today = new Date(), now = today.getTime(), diff, hour = today.getHours(), isNew = '';
		if(this.versionDT) {
			date = new Date(parseInt(this.versionDT*1000));
			diff = now - date.getTime();
			
			
			
			if( diff  < (hour * (3600 * 1000)) ) {
				versionDT = ', Today'
			} else 	if( ( diff > hour * (3600 * 1000) ) && ( diff < (hour + 24)  * (3600 * 1000 )) )  {
				versionDT = ', Yesterday'
			} else {
				versionDT = ', ' + Math.round(diff / (86400 * 1000)) + ' days'
			}
			
			// New (updated)
			if(diff < 3600 * 1000 * 12) {
				isNew = ' <span class="new">(NEW)</span>'
			}			
		}		
		
		if(Ext.inPopup) {
			//html.push('<th class="cell-img"><div class=\"img\"  style="background-repeat: no-repeat; background-position: center top;background-image:'+this.img+'" title="'+this.title+' logo"></div><img src="'+this.img+'" width="20" height="20" /></th>');
			html.push('<th class="cell-img>"<div class="img"><img onclick="Ext.install(\''+this.hash+'\')" title="Click to install '+this.title+' extension" alt="" width=\"'+(Ext.options.compact ? 16 : 32)+'\" height=\"'+(Ext.options.compact ? 16 : 32)+'\" src="'+this.img+'"  /></div></th>');
			
			html.push('<th class="cell-link"><div class="link"><a onclick="return( Ext.seen(\''+this.hash+'\', event) )" '+(this.author ? 'title="By '+this.author+'"' : '') + ' href="https://chrome.google.com/extensions/detail/'+this.hash+'" target="_blank">' + this.title + '</a></div><div class="version"><a title="Edit this extension" target="_blank" href="https://chrome.google.com/extensions/developer/edit/'+ this.hash +'">edit</a> <span class="featured">FEATURED ('+(this.ranking && this.ranking.featured ? this.ranking.featured : 0) +')</span><em>V: ' + this.version + isNew + (versionDT ? '<dt>' + versionDT + '</dt>' : '')+'</em></div></th>');
			
			if(!Ext.options.compact) {
				html.push('<td title="'+this.hash+'" class="ranking cell-rank-popularity">' + (this.ranking.popularity > 0 && this.ranking.popularity < 999999  ? Number((this.ranking.popularity || 0).toString().replace(/,/, '').toInt()).toFormatted(',')  : '>' + Ext.maxRank) +  '</td>');
				html.push('<td title="'+this.hash+'" class="ranking cell-rank-rating">' + (this.ranking.rating > 0 && this.ranking.rating < 999999 ? Number((this.ranking.rating || 0).toString().replace(/,/, '').toInt()).toFormatted(',') : '>'+ Ext.maxRank) +  '</td>'); 		
				//html.push('<td class="cell-users" title="'+this.hash+'"><div>' + Number((this.users.total || 0).toString().replace(/,/, '').toInt()).toFormatted(',') +  '</div></td>'); 		
				
				
				var diff 	= this.users && this.users.previous ? this.users.total - this.users.previous : 0;
				var klass	= '';
				var title 	= 'no change';
				if(diff) {
					klass = diff > 0 ? ' up' : ' down';
					title = diff > 0  ? ' +' + diff.toFormatted(',') : diff.toFormatted(',');
				}
				
				html.push('<td class="cell-users'+klass+'" title="'+title+'"><div>' + Number((this.users.total || 0).toString().replace(/,/, '').toInt()).toFormatted(',') +  '</div></td>'); 		
				// Installs
				// title="'+(this.installs && this.installs.previous && this.installs.previous != this.installs.total ? 'Was '+this.installs.previous : '')+'"
				html.push('<td class="cell-installs" ><div>' + Number((this.installs.total || 0).toString().replace(/,/, '').toInt()).toFormatted(',') + '</div></td>'); 		// Installs
			} else {
				html.push('<td class="cell-version-dt" v="'+(this.versionDT*1000)+'">' + versionDT.replace(', ', '') + '</td>'); 	// Ratings
				html.push('<td class="cell-version ghost"><div><em>('+this.version+')</em></div></td>');				
			}
			
			
					
			var _html = (this.ratings.average ||0).toFixed(2), ret;
			
			// Not for now 
			if( 0 ) {
				if(ret = this.getStars()) {
					_html = '<dfn title="'+ret+'">'  + _html + '</dfn>';
				}
			} else {
				_html = '<dfn>' + _html + '</dfn>';
			}
			
			//this.elements.ratingsAverage.setHTML(html);
			
			
			
			html.push('<td class="cell-ratings" title="'+this.hash+'">' + _html + '<br /></td>'); 	// Ratings
			html.push('<td class="cell-ratings-total ghost"><div><em>(' +  (this.ratings.total || 0).toFormatted(',') + ')'   +'</em><span class="ratings-badge"'+(this.ratings && this.ratings['new'] ? ' style="display:block;"' : '')+'>NEW</span></div></td>');
			html.push('<td class="cell-comments" title="'+this.hash+'"><div><strong>' + ( this.comments.latest  && this.comments.latest.entity ? '<dfn>'+(this.comments.total || 0).toFormatted(',') + '</dfn>' : (this.comments.total || 0).toFormatted(',') ) + '</strong><span class="comments-badge"'+(this.comments && this.comments['new'] && (this.comments.latest && this.comments.latest.entity.nickname != Ext.options.ignoreFrom) ? ' style="display:block;"' : '')+'>NEW</span></div></td>'); 		// Comments
			
			
			row.innerHTML = html.join('');
			tbody.appendChild(row);
			//alert(tbody);
			//return this;	
			//row.setHTML(html.join('\n')).injectIn(tbody)
			
			cells			= row.getElements('td');
		
			// Define elements
			if(!Ext.options.compact) {
				this.elements = {
					'row'				: row,
					'img'				: row.getElement('th div.img img'),
					'version'			: row.getElement('th div.version em'),
					'title'				: row.getElement('th a'),
					'popularity'		: cells[0],
					'rating'			: cells[1],
					
					'users'				: cells[2].getElement('div'),
					'installs'			: cells[3].getElement('div'),
					'ratingsAverage'	: cells[4],
					'ratingsTotal'		: cells[5].getElement('div em'),
					'ratingsBadge'		: cells[5].getElement('div span'),
					'comments'			: cells[6].getElement('div strong'),
					'commentsBadge'		: cells[6].getElement('div span')
					
				}
			} else {

				this.elements = {
					'row'				: row,
					'img'				: row.getElement('th div.img img'),
					'title'				: row.getElement('th a'),
					'versionDT'			: row.getElement('.cell-version-dt'),
					'version'			: row.getElement('.cell-version div em'),
					'title'				: row.getElement('th a'),
					'ratingsAverage'	: cells[2],
					'ratingsTotal'		: cells[3].getElement('div em'),
					'ratingsBadge'		: cells[3].getElement('div span'),
					'comments'			: cells[4].getElement('div strong'),
					'commentsBadge'		: cells[4].getElement('div span')
					
				}				
			}
			
			// ARG!
			//this.comments['new']  = false;
			//this.ratings['new']   = false;
				
		}
		else {


//TOTAL STRINGS
var strlen0 = (this.comments.latest0 && this.comments.latest0.comment ? this.comments.latest0.comment.replace(/\n/gi, '')  : '');if(strlen0 == ''){var count0 = 0;}else{var count0 = 1;}
var strlen1 = (this.comments.latest1 && this.comments.latest1.comment ? this.comments.latest1.comment.replace(/\n/gi, '')  : '');if(strlen1 == ''){var count1 = 0;}else{var count1 = 1;}
var strlen2 = (this.comments.latest2 && this.comments.latest2.comment ? this.comments.latest2.comment.replace(/\n/gi, '')  : '');if(strlen2 == ''){var count2= 0;}else{var count2 = 1;}
var strlen3 = (this.comments.latest3 && this.comments.latest3.comment ? this.comments.latest3.comment.replace(/\n/gi, '')  : '');if(strlen3 == ''){var count3= 0;}else{var count3 = 1;}
var strlen4 = (this.comments.latest4 && this.comments.latest4.comment ? this.comments.latest4.comment.replace(/\n/gi, '')  : '');if(strlen4 == ''){var count4= 0;}else{var count4 = 1;}
var strlen5 = (this.comments.latest5 && this.comments.latest5.comment ? this.comments.latest5.comment.replace(/\n/gi, '')  : '');if(strlen5 == ''){var count5= 0;}else{var count5 = 1;}
var strlen6 = (this.comments.latest6 && this.comments.latest6.comment ? this.comments.latest6.comment.replace(/\n/gi, '')  : '');if(strlen6 == ''){var count6= 0;}else{var count6 = 1;}
var strlen7 = (this.comments.latest7 && this.comments.latest7.comment ? this.comments.latest7.comment.replace(/\n/gi, '')  : '');if(strlen7 == ''){var count7= 0;}else{var count7 = 1;}
var strlen8 = (this.comments.latest8 && this.comments.latest8.comment ? this.comments.latest8.comment.replace(/\n/gi, '')  : '');if(strlen8 == ''){var count8= 0;}else{var count8 = 1;}
var strlen9 = (this.comments.latest9 && this.comments.latest9.comment ? this.comments.latest9.comment.replace(/\n/gi, '')  : '');if(strlen9 == ''){var count9= 0;}else{var count9 = 1;}
var strlen10 = (this.comments.latest10 && this.comments.latest10.comment ? this.comments.latest10.comment.replace(/\n/gi, '')  : '');if(strlen10 == ''){var count10= 0;}else{var count10 = 1;}
var strlen11 = (this.comments.latest11 && this.comments.latest11.comment ? this.comments.latest11.comment.replace(/\n/gi, '')  : '');if(strlen11 == ''){var count11= 0;}else{var count11 = 1;}
var strlen12 = (this.comments.latest12 && this.comments.latest12.comment ? this.comments.latest12.comment.replace(/\n/gi, '')  : '');if(strlen12 == ''){var count12= 0;}else{var count12 = 1;}
var strlen13 = (this.comments.latest13 && this.comments.latest13.comment ? this.comments.latest13.comment.replace(/\n/gi, '')  : '');if(strlen13 == ''){var count13= 0;}else{var count13 = 1;}
var strlen14 = (this.comments.latest14 && this.comments.latest14.comment ? this.comments.latest14.comment.replace(/\n/gi, '')  : '');if(strlen14 == ''){var count14= 0;}else{var count14 = 1;}
var strlen15 = (this.comments.latest15 && this.comments.latest15.comment ? this.comments.latest15.comment.replace(/\n/gi, '')  : '');if(strlen15 == ''){var count15= 0;}else{var count15 = 1;}
var strlen16 = (this.comments.latest16 && this.comments.latest16.comment ? this.comments.latest16.comment.replace(/\n/gi, '')  : '');if(strlen16 == ''){var count16= 0;}else{var count16 = 1;}
var strlen17 = (this.comments.latest17 && this.comments.latest17.comment ? this.comments.latest17.comment.replace(/\n/gi, '')  : '');if(strlen17 == ''){var count17= 0;}else{var count17 = 1;}
var strlen18 = (this.comments.latest18 && this.comments.latest18.comment ? this.comments.latest18.comment.replace(/\n/gi, '')  : '');if(strlen18 == ''){var count18= 0;}else{var count18 = 1;}
var strlen19 = (this.comments.latest19 && this.comments.latest19.comment ? this.comments.latest19.comment.replace(/\n/gi, '')  : '');if(strlen19 == ''){var count19= 0;}else{var count19 = 1;}
var strlen20 = (this.comments.latest20 && this.comments.latest20.comment ? this.comments.latest20.comment.replace(/\n/gi, '')  : '');if(strlen20 == ''){var count20= 0;}else{var count20 = 1;}
var strlen21 = (this.comments.latest21 && this.comments.latest21.comment ? this.comments.latest21.comment.replace(/\n/gi, '')  : '');if(strlen21 == ''){var count21= 0;}else{var count21 = 1;}
var strlen22 = (this.comments.latest22 && this.comments.latest22.comment ? this.comments.latest22.comment.replace(/\n/gi, '')  : '');if(strlen22 == ''){var count22= 0;}else{var count22 = 1;}
var strlen23 = (this.comments.latest23 && this.comments.latest23.comment ? this.comments.latest23.comment.replace(/\n/gi, '')  : '');if(strlen23 == ''){var count23= 0;}else{var count23 = 1;}
var strlen24 = (this.comments.latest24 && this.comments.latest24.comment ? this.comments.latest24.comment.replace(/\n/gi, '')  : '');if(strlen24 == ''){var count24= 0;}else{var count24 = 1;}
var strlen25 = (this.comments.latest25 && this.comments.latest25.comment ? this.comments.latest25.comment.replace(/\n/gi, '')  : '');if(strlen25 == ''){var count25= 0;}else{var count25 = 1;}
var strlen26 = (this.comments.latest26 && this.comments.latest26.comment ? this.comments.latest26.comment.replace(/\n/gi, '')  : '');if(strlen26 == ''){var count26= 0;}else{var count26 = 1;}
var strlen27 = (this.comments.latest27 && this.comments.latest27.comment ? this.comments.latest27.comment.replace(/\n/gi, '')  : '');if(strlen27 == ''){var count27= 0;}else{var count27 = 1;}
var strlen28 = (this.comments.latest28 && this.comments.latest28.comment ? this.comments.latest28.comment.replace(/\n/gi, '')  : '');if(strlen28 == ''){var count28= 0;}else{var count28 = 1;}
var strlen29 = (this.comments.latest29 && this.comments.latest29.comment ? this.comments.latest29.comment.replace(/\n/gi, '')  : '');if(strlen29 == ''){var count29= 0;}else{var count29 = 1;}
var strlen30 = (this.comments.latest30 && this.comments.latest30.comment ? this.comments.latest30.comment.replace(/\n/gi, '')  : '');if(strlen30 == ''){var count30= 0;}else{var count30 = 1;}
var strlen31 = (this.comments.latest31 && this.comments.latest31.comment ? this.comments.latest31.comment.replace(/\n/gi, '')  : '');if(strlen31 == ''){var count31= 0;}else{var count31 = 1;}
var strlen32 = (this.comments.latest32 && this.comments.latest32.comment ? this.comments.latest32.comment.replace(/\n/gi, '')  : '');if(strlen32 == ''){var count32= 0;}else{var count32 = 1;}
var strlen33 = (this.comments.latest33 && this.comments.latest33.comment ? this.comments.latest33.comment.replace(/\n/gi, '')  : '');if(strlen33 == ''){var count33= 0;}else{var count33 = 1;}
var strlen34 = (this.comments.latest34 && this.comments.latest34.comment ? this.comments.latest34.comment.replace(/\n/gi, '')  : '');if(strlen34 == ''){var count34= 0;}else{var count34 = 1;}
var strlen35 = (this.comments.latest35 && this.comments.latest35.comment ? this.comments.latest35.comment.replace(/\n/gi, '')  : '');if(strlen35 == ''){var count35= 0;}else{var count35 = 1;}
var strlen36 = (this.comments.latest36 && this.comments.latest36.comment ? this.comments.latest36.comment.replace(/\n/gi, '')  : '');if(strlen36 == ''){var count36= 0;}else{var count36 = 1;}
var strlen37 = (this.comments.latest37 && this.comments.latest37.comment ? this.comments.latest37.comment.replace(/\n/gi, '')  : '');if(strlen37 == ''){var count37= 0;}else{var count37 = 1;}
var strlen38 = (this.comments.latest38 && this.comments.latest38.comment ? this.comments.latest38.comment.replace(/\n/gi, '')  : '');if(strlen38 == ''){var count38= 0;}else{var count38 = 1;}
var strlen39 = (this.comments.latest39 && this.comments.latest39.comment ? this.comments.latest39.comment.replace(/\n/gi, '')  : '');if(strlen39 == ''){var count39= 0;}else{var count39 = 1;}
var strlen40 = (this.comments.latest40 && this.comments.latest40.comment ? this.comments.latest40.comment.replace(/\n/gi, '')  : '');if(strlen40 == ''){var count40= 0;}else{var count40 = 1;}
var strlen41 = (this.comments.latest41 && this.comments.latest41.comment ? this.comments.latest41.comment.replace(/\n/gi, '')  : '');if(strlen41 == ''){var count41= 0;}else{var count41 = 1;}
var strlen42 = (this.comments.latest42 && this.comments.latest42.comment ? this.comments.latest42.comment.replace(/\n/gi, '')  : '');if(strlen42 == ''){var count42= 0;}else{var count42 = 1;}
var strlen43 = (this.comments.latest43 && this.comments.latest43.comment ? this.comments.latest43.comment.replace(/\n/gi, '')  : '');if(strlen43 == ''){var count43= 0;}else{var count43 = 1;}
var strlen44 = (this.comments.latest44 && this.comments.latest44.comment ? this.comments.latest44.comment.replace(/\n/gi, '')  : '');if(strlen44 == ''){var count44= 0;}else{var count44 = 1;}
var strlen45 = (this.comments.latest45 && this.comments.latest45.comment ? this.comments.latest45.comment.replace(/\n/gi, '')  : '');if(strlen45 == ''){var count45= 0;}else{var count45 = 1;}
var strlen46 = (this.comments.latest46 && this.comments.latest46.comment ? this.comments.latest46.comment.replace(/\n/gi, '')  : '');if(strlen46 == ''){var count46= 0;}else{var count46 = 1;}
var strlen47 = (this.comments.latest47 && this.comments.latest47.comment ? this.comments.latest47.comment.replace(/\n/gi, '')  : '');if(strlen47 == ''){var count47= 0;}else{var count47 = 1;}
var strlen48 = (this.comments.latest48 && this.comments.latest48.comment ? this.comments.latest48.comment.replace(/\n/gi, '')  : '');if(strlen48 == ''){var count48= 0;}else{var count48 = 1;}
var strlen49 = (this.comments.latest49 && this.comments.latest49.comment ? this.comments.latest49.comment.replace(/\n/gi, '')  : '');if(strlen49 == ''){var count49= 0;}else{var count49 = 1;}
var strlen50 = (this.comments.latest50 && this.comments.latest50.comment ? this.comments.latest50.comment.replace(/\n/gi, '')  : '');if(strlen50 == ''){var count50= 0;}else{var count50 = 1;}
var strlen51 = (this.comments.latest51 && this.comments.latest51.comment ? this.comments.latest51.comment.replace(/\n/gi, '')  : '');if(strlen51 == ''){var count51= 0;}else{var count51 = 1;}
var strlen52 = (this.comments.latest52 && this.comments.latest52.comment ? this.comments.latest52.comment.replace(/\n/gi, '')  : '');if(strlen52 == ''){var count52= 0;}else{var count52 = 1;}
var strlen53 = (this.comments.latest53 && this.comments.latest53.comment ? this.comments.latest53.comment.replace(/\n/gi, '')  : '');if(strlen53 == ''){var count53= 0;}else{var count53 = 1;}
var strlen54 = (this.comments.latest54 && this.comments.latest54.comment ? this.comments.latest54.comment.replace(/\n/gi, '')  : '');if(strlen54 == ''){var count54= 0;}else{var count54 = 1;}
var strlen55 = (this.comments.latest55 && this.comments.latest55.comment ? this.comments.latest55.comment.replace(/\n/gi, '')  : '');if(strlen55 == ''){var count55= 0;}else{var count55 = 1;}
var strlen56 = (this.comments.latest56 && this.comments.latest56.comment ? this.comments.latest56.comment.replace(/\n/gi, '')  : '');if(strlen56 == ''){var count56= 0;}else{var count56 = 1;}
var strlen57 = (this.comments.latest57 && this.comments.latest57.comment ? this.comments.latest57.comment.replace(/\n/gi, '')  : '');if(strlen57 == ''){var count57= 0;}else{var count57 = 1;}
var strlen58 = (this.comments.latest58 && this.comments.latest58.comment ? this.comments.latest58.comment.replace(/\n/gi, '')  : '');if(strlen58 == ''){var count58= 0;}else{var count58 = 1;}
var strlen59 = (this.comments.latest59 && this.comments.latest59.comment ? this.comments.latest59.comment.replace(/\n/gi, '')  : '');if(strlen59 == ''){var count59= 0;}else{var count59 = 1;}
var strlen60 = (this.comments.latest60 && this.comments.latest60.comment ? this.comments.latest60.comment.replace(/\n/gi, '')  : '');if(strlen60 == ''){var count60= 0;}else{var count60 = 1;}
var strlen61 = (this.comments.latest61 && this.comments.latest61.comment ? this.comments.latest61.comment.replace(/\n/gi, '')  : '');if(strlen61 == ''){var count61= 0;}else{var count61 = 1;}
var strlen62 = (this.comments.latest62 && this.comments.latest62.comment ? this.comments.latest62.comment.replace(/\n/gi, '')  : '');if(strlen62 == ''){var count62= 0;}else{var count62 = 1;}
var strlen63 = (this.comments.latest63 && this.comments.latest63.comment ? this.comments.latest63.comment.replace(/\n/gi, '')  : '');if(strlen63 == ''){var count63= 0;}else{var count63 = 1;}
var strlen64 = (this.comments.latest64 && this.comments.latest64.comment ? this.comments.latest64.comment.replace(/\n/gi, '')  : '');if(strlen64 == ''){var count64= 0;}else{var count64 = 1;}
var strlen65 = (this.comments.latest65 && this.comments.latest65.comment ? this.comments.latest65.comment.replace(/\n/gi, '')  : '');if(strlen65 == ''){var count65= 0;}else{var count65 = 1;}
var strlen66 = (this.comments.latest66 && this.comments.latest66.comment ? this.comments.latest66.comment.replace(/\n/gi, '')  : '');if(strlen66 == ''){var count66= 0;}else{var count66 = 1;}
var strlen67 = (this.comments.latest67 && this.comments.latest67.comment ? this.comments.latest67.comment.replace(/\n/gi, '')  : '');if(strlen67 == ''){var count67= 0;}else{var count67 = 1;}
var strlen68 = (this.comments.latest68 && this.comments.latest68.comment ? this.comments.latest68.comment.replace(/\n/gi, '')  : '');if(strlen68 == ''){var count68= 0;}else{var count68 = 1;}
var strlen69 = (this.comments.latest69 && this.comments.latest69.comment ? this.comments.latest69.comment.replace(/\n/gi, '')  : '');if(strlen69 == ''){var count69= 0;}else{var count69 = 1;}
var strlen70 = (this.comments.latest70 && this.comments.latest70.comment ? this.comments.latest70.comment.replace(/\n/gi, '')  : '');if(strlen70 == ''){var count70= 0;}else{var count70 = 1;}
var strlen71 = (this.comments.latest71 && this.comments.latest71.comment ? this.comments.latest71.comment.replace(/\n/gi, '')  : '');if(strlen71 == ''){var count71= 0;}else{var count71 = 1;}
var strlen72 = (this.comments.latest72 && this.comments.latest72.comment ? this.comments.latest72.comment.replace(/\n/gi, '')  : '');if(strlen72 == ''){var count72= 0;}else{var count72 = 1;}
var strlen73 = (this.comments.latest73 && this.comments.latest73.comment ? this.comments.latest73.comment.replace(/\n/gi, '')  : '');if(strlen73 == ''){var count73= 0;}else{var count73 = 1;}
var strlen74 = (this.comments.latest74 && this.comments.latest74.comment ? this.comments.latest74.comment.replace(/\n/gi, '')  : '');if(strlen74 == ''){var count74= 0;}else{var count74 = 1;}
var strlen75 = (this.comments.latest75 && this.comments.latest75.comment ? this.comments.latest75.comment.replace(/\n/gi, '')  : '');if(strlen75 == ''){var count75= 0;}else{var count75 = 1;}
var strlen76 = (this.comments.latest76 && this.comments.latest76.comment ? this.comments.latest76.comment.replace(/\n/gi, '')  : '');if(strlen76 == ''){var count76= 0;}else{var count76 = 1;}
var strlen77 = (this.comments.latest77 && this.comments.latest77.comment ? this.comments.latest77.comment.replace(/\n/gi, '')  : '');if(strlen77 == ''){var count77= 0;}else{var count77 = 1;}
var strlen78 = (this.comments.latest78 && this.comments.latest78.comment ? this.comments.latest78.comment.replace(/\n/gi, '')  : '');if(strlen78 == ''){var count78= 0;}else{var count78 = 1;}
var strlen79 = (this.comments.latest79 && this.comments.latest79.comment ? this.comments.latest79.comment.replace(/\n/gi, '')  : '');if(strlen79 == ''){var count79= 0;}else{var count79 = 1;}
var strlen80 = (this.comments.latest80 && this.comments.latest80.comment ? this.comments.latest80.comment.replace(/\n/gi, '')  : '');if(strlen80 == ''){var count80= 0;}else{var count80 = 1;}


var counttot = count0 + count1 + count2 +count3 +count4 +count5 +count6 +count7 +count8 +count9 +count10 +count11 +count12 +count13 +count14 +count15 +count16 +count17 +count18 +count19 +count20 +count21 +count22 +count23 +count24 +count25 +count26 +count27 +count28 +count29 +count30 +count31 +count32 +count33 +count34 +count35 +count36 +count37 +count38 +count39 +count40 +count41 +count42 +count43 +count44 +count45 +count46 +count47 +count48 +count49 +count50 +count51 +count52 +count53 +count54 +count55 +count56 +count57 +count58 +count59 +count60 +count61 +count62 +count63 +count64 +count65 +count66 +count67 +count68 +count69 +count70 +count71 +count72 +count73 +count74 +count75 +count76 +count77 +count78 +count79 +count80;

var totalstr = strlen0 + strlen1 + strlen2 +strlen3 +strlen4 +strlen5 +strlen6 +strlen7 +strlen8 +strlen9 +strlen10 +strlen11 +strlen12 +strlen13 +strlen14 +strlen15 +strlen16 +strlen17 +strlen18 +strlen19 +strlen20 +strlen21 +strlen22 +strlen23 +strlen24 +strlen25 +strlen26 +strlen27 +strlen28 +strlen29 +strlen30 +strlen31 +strlen32 +strlen33 +strlen34 +strlen35 +strlen36 +strlen37 +strlen38 +strlen39 +strlen40 +strlen41 +strlen42 +strlen43 +strlen44 +strlen45 +strlen46 +strlen47 +strlen48 +strlen49 +strlen50 +strlen51 +strlen52 +strlen53 +strlen54 +strlen55 +strlen56 +strlen57 +strlen58 +strlen59 +strlen60 +strlen61 +strlen62 +strlen63 +strlen64 +strlen65 +strlen66 +strlen67 +strlen68 +strlen69 +strlen70 +strlen71 +strlen72 +strlen73 +strlen74 +strlen75 +strlen76 +strlen77 +strlen78 +strlen79 +strlen80;

//var strlenno = totalstr.replace(/\s+\b/gi, '').length;
var strlenno = totalstr.length;

//if(this.comments.total < 80){var strlenf = strlenno/this.comments.total}else{var strlenf = strlenno/80}

var html 		= ['<th><img src="'+this.img+'" title="'+this.title+' logo" width="16" height="16" /></th>'];
			html.push('<th><div class="link"><a '+(this.author ? 'title="By '+this.author+'"' : '') + ' target="_blank" href="https://chrome.google.com/extensions/detail/'+this.hash+'">' + this.title + '</a></th>');
			//</div><div class="version">V: ' + this.version + (versionDT ? '<dt>' + versionDT + '</dt>' : '')+'</div></th>');
			html.push('<td class="zy"><em class="foo" onclick="Ext.remove(\''+this.hash+'\')">Remove</em></td><br /><br /><ul class="a"><li>Number of Footprints (Reviews + Ratings)<br />Number of Reviews<br />Number of Ratings<br />Number of Users<br />Probability of a Footprint<br />Probability of a Review<br />Probability of a Rating<br />Average size of a review</li><li><ul class="h"><li>'+(this.comments.total+this.ratings.total)+'</li><li>'+this.comments.total+'</li><li>'+this.ratings.total+'</li><li>'+this.users.total+'</li><li>'+Math.round(((this.comments.total+this.ratings.total)/this.users.total)*10000)/100+'%</li><li>'+Math.round((this.comments.total/this.users.total)*10000)/100+'%</li><li>'+Math.round((this.ratings.total/this.users.total)*10000)/100+'%</li><li>'+Math.round(strlenno/counttot)+' characters</li></ul></li></ul></td></tr>');
			row.setHTML(html.join('\n')).injectIn(tbody)		 	
		 	
		}
			

		return this;
	},
		
	
	getMeta		: function() {
		Ext.XHR['meta'] = new Ajax({
			'method'		: 'GET',
			'url'			: Ext.localTest ? 'http://192.168.1.200/dump.html' : 'https://chrome.google.com/webstore/detail/' + this.hash + '?hl=en',
			'onSuccess'		: function(xhr) {
				// var responseText = xhr.responseText.replace(/<div class="cx\-verified\-author[\s\S]*?<\/div>/i, '');
				var responseText	= xhr.responseText;
				var verMatch;
				
				// Handle verirified case
				if(verMatch = responseText.match(/website">[\s\S]*?Verified author: ([\s\S]*?)<\/div>/)) {
					responseText = responseText.replace(/website">[\s\S]*?Verified author: ([\s\S]*?)<\/div>/, '');
					responseText = responseText.replace(/<\/h2>/, '<span>by ' + verMatch[1].trim() +'</span></h2>');
				}
				
// 				var matches = responseText.match(/cx\-title[\s\S]*?style="background\-image:([\s\S]*?);">[\s\S]*?h2>(.*?)\n[\s\S]*?<span>.*? ([\s\S]*?)<\/span>[\s\S]*?NumRatings[\s\S]*?-[^\d]+?([\d,]+?)\s[\s\S]*?-[^\d]+?([\d,]+?)\s[\s\S]*?cx\-version\-info[\s\S]*?([\d\.]+?)\s[\s\S]*?cx.timeToLocalDateStr\((.*?)\)/i);

//
// MOD !
				var matches = responseText.match(/<img class="detail-logo-[^"]*" src="([^"]*)" alt="Logo">[\s\S]*<div class="detail-title">([^<]*)<\/div>([^<]*)<[\s\S]*<div class="detail-num-users">([^<]*) users<[\s\S]*Version: <\/b>([^<]*)<[\s\S]*<span id='detail-update-date'>([^<]*)<[\s\S]*users<br>([^<]*) weekly installs</i);
				;
				// var matches = xhr.responseText.match(/cx\-title[\s\S]*?style="background\-image:([\s\S]*?);">[\s\S]*?h2>(.*?) <span>.*? ([\s\S]*?)<\/span>[\s\S]*?NumRatings[\s\S]*?-[^\d]+?([\d,]+?)\s[\s\S]*?-[^\d]+?([\d,]+?)\s[\s\S]*?cx\-version\-info[\s\S]*?([\d\.]+?)\s[\s\S]*?cxOutputDateStr\((.*?)\)/i);
				//console.log('MATCHES', matches)
				// Aw snap! detection
				if(xhr.responseText.length < 500 && xhr.responseText.toLowerCase().indexOf('aw snap') != -1) {
					if(Ext.inOptions) {
						alert('Unable to retrieve data. Please try again later.');
						this.remove();						
					}
					
					return this;
				}
				
				
				// ADDED: 13.3.2010
				if( xhr.responseText.length < 600 && xhr.responseText.toLowerCase().indexOf('Item not found. This item may have been removed by its author') != -1) {
					this.remove();
					return this;	
				}
				


			
				// alert(matches)
				if(matches && matches.length) {
					//this.img 		= 'https://chrome.google.com/extensions/img/' + matches[1] + 'thumb';
					this.img		= matches[1];
					if(this.img.indexOf('url(/extensions') !== -1) {
						this.img = this.img.replace(/url\(\/extensions/, 'url(https://chrome.google.com/extensions')
					}
					// Fix applied 16 Oct 2010
// 					this.img = this.img.replace(/url\((.*?)\)$/, '$1');
// MOD !
					this.img = "http:" + this.img;

					console.log(this.img)
					this.title 		= matches[2];
					this.author		= matches[3].trim().replace(/\)$/, '');
                                        this.nbusers            = matches[4];
					//var ratio = 
					
					// CHANGED: 16.01.2010
					// Those changes are mae in order to support down/up references.
					var currentTotal		= this.users.total;
					var currentInstalls		= this.installs.total;
					
					if(Ext.localTest) {
						console.log(this.title);
						console.log(this.author);
						console.log(matches[4]);
						console.log(matches[5]);
						return;
					}
					
					this.users			= this.users || {};
					this.users.total 	= Number(matches[4].replace(/,/, ''));
					
					if(parseInt(currentTotal) == parseInt(this.users.total)) {
						this.users.previous = this.users.previous || this.users.total;
					} else {
						this.users.previous = currentTotal;
						
						// We are going to need this
						// Later
						this.metaUpdated	= new Date().getTime();
					}
					
					
					
					if(0) {
						console.log('USERS REPORT');
						console.log('TOTAL: ' + this.users.total );
						console.log('PREVIOUS: ' + this.users.previous );
					}
					
										
					this.installs		= this.installs || {};
//					this.installs.total = Number(matches[5].replace(/,/, ''));
// MOD !
					this.installs.total = Number(matches[7].replace(/,/, ''));

					if(parseInt(currentInstalls) == parseInt(this.installs.total)) {
						this.installs.previous = this.installs.previous || this.installs.total;
					} else {
						this.installs.previous = currentInstalls;
						
						// We are going to need this
						this.metaUpdated	= new Date().getTime();
					}

					
					//	previous	: this.installs.total || null
					
					
//					this.version	= matches[6];
// MOD !
					
					this.version	= matches[5]
					// New
//					this.versionDT	= matches[7];
// MOD !
//					this.versionDT	= matches[6];

						
					Ext.store();
				
					
					
					Ext.sendRequest({
						'action'		: 'update',
						'instance'		: this
					});
				
					
					if(Ext.inOptions) {
						this.update();
					}
					
					
				
					
					if(Ext.localTest) {
						console.log(this.users, this.installs)
						console.log('done local test')
						throw(1)
						return this;
					}
					
						//  Nullify stuff
					json = xhr =  matches = null;
					// Next step
					this.getRatings();
				}  else {
					// If we have a title already, its just a network issue
					if(!this.title || !this.version ||  this.title === 'undefined' ) {
						alert('Extension id seems to be invalid ;(');
						this.remove();	
					} else {
						// network failure
					}
					
					Ext.XHR['meta'] = null;
				}
			}.bind(this)
		}).send();
		
		return this;
	},
	
	// TODO: use this for all on Ext{}
	getRatings	: function() {
		var entities = [{'url' : 'http://chrome.google.com/extensions/permalink?id=' + this.hash, 'includeAggregateInfo' : true}];
		
		Ext.XHR['ratings'] = new Ajax({
			'method'		: 'POST',
			'encodeURI'		: false,	// Needed
			'url'			: 'https://chrome.google.com/reviews/json/lookup',
			'headers'		: {
				'Content-type'	: 'application/xml'
			},
			'parameters'	: {
				'req'		: JSON.stringify({'entities' : entities, 'applicationId' : 94}) + '&requestSource=widget'
			},
			'onSuccess'		: function(xhr) {
				var json = xhr.responseJSON;
				if(json && json.annotations[0] && json.annotations[0].aggregateInfo ) {
					this.ratings = {
						'average'  			: json.annotations[0].aggregateInfo.averageRating,
						'total'				: Number((json.annotations[0].aggregateInfo.numRatings || 0).toString().replace(/,/, '').toInt()),
						'previousAverage'	: this.ratings.average,
						'stars'				: json.annotations[0].aggregateInfo.starRatings,
						'previous'			: this.ratings.total || null,
						'new'				: this.ratings['new'] || false
					}
				
					
					// Extra care :)				
					if(this.ratings.total && this.ratings.previous === 0) {
						this.ratings['new'] = true;
					}
					
					
					// New rating
					if(this.ratings.total && this.ratings.previous && (this.ratings.total != this.ratings.previous)) {
						this.ratings['new'] = true
					}
				
					
					
					
					
					// TESTING
					// this.ratings['new'] = true;
								
					this.handleRatings();
					Ext.store();
					Ext.sendRequest({
							'action'		: 'update',
							'instance'		: this
					});
					
					json = null;
			
					Ext.XHR['ratings'] = null;
					// Next step
					this.getComments();

				}
			}.bind(this)	
		}).send();
		
		return this;
	},
	
	getComments	: function() {
		var entities = [];
 		//each(Ext.extensions, function(data, id) {
			entities.push({'url' : 'http://chrome.google.com/extensions/permalink?id=' + this.hash});
		//});				
		
		Ext.XHR['comments'] = new Ajax({
			'method'		: 'POST',
			'encodeURI'		: false,	// Needed
			'url'			: 'https://chrome.google.com/reviews/json/search',
			'headers'		: {
				'Content-type'	: 'application/xml'
			},
			
			'parameters'	: {
				'req'		: JSON.stringify({'searchSpecs' :  [{'entities' : entities, 'groups' : ['public_comment'], 'matchExtraGroups' : true,"sortBy":"quality", 'startIndex' : 0, 'numResults' : 80, 'includeNickNames' : true}], 'applicationId' : 94 }) + '&requestSource=widget'
			},
			
			'onSuccess'		: function(xhr) {
				var json = xhr.responseJSON;
				if(json && json.searchResults ) {
					this.comments = {

'total' 			: Number(json.searchResults[0].numAnnotations.toString().replace(/,/, '').toInt()),
'latest'			: json.searchResults[0].annotations ? json.searchResults[0].annotations[0] :{},
'latest0'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[0] :{},
'latest1'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[1] :{},
'latest2'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[2] :{},
'latest3'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[3] :{},
'latest4'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[4] :{},
'latest5'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[5] :{},
'latest6'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[6] :{},
'latest7'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[7] :{},
'latest8'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[8] :{},
'latest9'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[9] :{},
'latest10'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[10] :{},
'latest11'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[11] :{},
'latest12'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[12] :{},
'latest13'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[13] :{},
'latest14'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[14] :{},
'latest15'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[15] :{},
'latest16'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[16] :{},
'latest17'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[17] :{},
'latest18'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[18] :{},
'latest19'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[19] :{},
'latest20'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[20] :{},
'latest21'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[21] :{},
'latest22'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[22] :{},
'latest23'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[23] :{},
'latest24'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[24] :{},
'latest25'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[25] :{},
'latest26'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[26] :{},
'latest27'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[27] :{},
'latest28'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[28] :{},
'latest29'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[29] :{},
'latest30'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[30] :{},
'latest31'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[31] :{},
'latest32'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[32] :{},
'latest33'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[33] :{},
'latest34'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[34] :{},
'latest35'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[35] :{},
'latest36'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[36] :{},
'latest37'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[37] :{},
'latest38'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[38] :{},
'latest39'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[39] :{},
'latest40'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[40] :{},
'latest41'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[41] :{},
'latest42'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[42] :{},
'latest43'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[43] :{},
'latest44'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[44] :{},
'latest45'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[45] :{},
'latest46'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[46] :{},
'latest47'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[47] :{},
'latest48'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[48] :{},
'latest49'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[49] :{},
'latest50'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[50] :{},
'latest51'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[51] :{},
'latest52'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[52] :{},
'latest53'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[53] :{},
'latest54'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[54] :{},
'latest55'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[55] :{},
'latest56'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[56] :{},
'latest57'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[57] :{},
'latest58'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[58] :{},
'latest59'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[59] :{},
'latest60'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[60] :{},
'latest61'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[61] :{},
'latest62'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[62] :{},
'latest63'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[63] :{},
'latest64'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[64] :{},
'latest65'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[65] :{},
'latest66'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[66] :{},
'latest67'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[67] :{},
'latest68'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[68] :{},
'latest69'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[69] :{},
'latest70'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[70] :{},
'latest71'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[71] :{},
'latest72'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[72] :{},
'latest73'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[73] :{},
'latest74'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[74] :{},
'latest75'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[75] :{},
'latest76'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[76] :{},
'latest77'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[77] :{},
'latest78'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[78] :{},
'latest79'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[79] :{},
'latest80'   : json.searchResults[0].annotations ? json.searchResults[0].annotations[80] :{},

'previous'			: this.comments.total || null,
'latestPrevious' 	        : $merge(this.comments.latest) || null,
'new'					: this.comments['new'] || false
					}	




					// New comment
					// TODO: Check counter
					if(this.comments.latest && this.comments.latest.timestamp && this.comments.latestPrevious && this.comments.latestPrevious.timestamp  && (this.comments.latest.timestamp != this.comments.latestPrevious.timestamp)) {
						this.comments['new'] = true
					}
								
								
					// Extra care :)				
					//alert([this.comments.total, this.comments.previous])
					if(this.comments.total && this.comments.previous == 0)  {
						this.comments['new'] = true;
					}
						
						
					// TESTING ONLY
					// this.comments['new'] = true;		
					
					this.handleComments();
					
					json = null;
					
					Ext.store();
					Ext.sendRequest({
						'action'		: 'update',
						'instance'		: this
					});
					
				
					
					// Next step
					//console.log((new Date().getTime() - (Ext.ranksUpdated * 1000)) / 1000);
					if(Ext.shouldGetRatings()) {
						
						this.getRanking();
					}
					
					/*
					if(Ext.ranksUpdated) {
						var diff = (new Date().getTime() - (Ext.ranksUpdated * 1000) ) / 1000;
						if(diff  > (3600   * 2 ) ) {
							this.getRanking();	
						} else {
							 //console.log('skipping');
						}
					} else {
						this.getRanking();
					}
					*/
					
					Ext.XHR['comments'] = null;
				}
			}.bind(this)	
		}).send();		
		
		return this;
	},




	
	getRanking		: function() {
		Ext.XHR['ranking'] = new Ajax({
			'method'		: 'get',
			'encodeURI'		: false,	// Needed
			'url'			: 'http://chrome.pathfinder.gr/My/getranking.php?id=' + this.hash,
			'onSuccess'		: function(xhr) {
				var json = xhr.responseJSON;
				if(json && json.total) {
					
					
					// CHANGED: 16.01.2010
					// Those changes are mae in order to support down/up references.
					var currentPopularity		= this.ranking ? this.ranking.popularity || 999999 : 999999;
					var currentRating			= this.ranking ? this.ranking.rating || 999999 : 999999;
																	
					
					this.ranking			= $merge(json);					
					if(!this.ranking.popularity || this.ranking.popularity > Ext.maxRank) {
						this.ranking.popularity = 999999;
					}
					if(this.ranking.rating > Ext.maxRank) {
						this.ranking.rating 	= 999999;
					}
					
					
					if(parseInt(currentPopularity) == parseInt(this.ranking.popularity)) {
						this.ranking.popularity_previous = this.ranking.popularity_previous || this.ranking.popularity;
					} else {
						this.ranking.popularity_previous = currentPopularity;
					}
					
					if(parseInt(currentRating) == parseInt(this.ranking.rating)) {
						this.ranking.rating_previous = this.ranking.rating_previous || this.ranking.rating;
					} else {
						this.ranking.rating_previous = currentRating;
					}
			
					if(0) {
						console.log('RANKING REPORT');
						console.log('POPULARITY TOTAL: ' + this.ranking.popularity );
						console.log('PREVIOUS: ' + this.ranking.popularity_previous);
						
						console.log('RATING TOTAL: ' + this.ranking.rating );
						console.log('RATING: ' + this.ranking.rating_previous);
					}			
						
										
					
					Ext.totalExtensions		= this.ranking.total;
					
					// Get it for last only
					if(this.ranking.ts < new Date().getTime()){
						Ext.ranksUpdated		= this.ranking.ts;				
					}

					// Mark			
					this.ranksFetched = true;												
						
															
					Ext.store();
					Ext.sendRequest({
						'action'		: 'update',
						'instance'		: this
					});
					
					Ext.XHR['ranking']  = null;
				}
			}.bind(this)	
		}).send();		
		
		return this;	
		
	},
	
	handleComments : function() {
		if(!Ext.options.notify.comments) {
			return this;
		}
		
		
		// for now
		if(this.comments && this.comments['new']) {
			if(this.comments.latest && this.comments.latest.entity.nickname != Ext.options.ignoreFrom ) {			
				this.elements && this.elements.commentsBadge.show();
				Ext.showBadge('comments');
				if($('mark') ){
					$('mark').style.display = 'inline';
			}
		}
		} else {
			this.elements && this.elements.commentsBadge.hide();
		}
		
		
		return this;	
	},
	

	handleRatings : function() {
		// for now
		if(!Ext.options.notify.ratings) {
			return this;
		}

		if(this.ratings && this.ratings['new']) {
			this.elements && this.elements.ratingsBadge.show();			
			Ext.showBadge('ratings');
			if($('mark') ){
				$('mark').style.display = 'inline';
		}

		} else {
			this.elements && this.elements.ratingsBadge.hide();
		}
		

		return this;	
	},
	
	getStarsHTML	: function() {		
		var ret = [''], blocks = 100, row, rate, currentBlocks, currentPct;
		if(!this.ratings.stars) {
			return null;
		}
		
		var html = ['<table cellspacing="1" class="table-stars" caption='+this.ratings.total+'>'];
		html.push('<thead><tr><th colspan="4">' + this.ratings.total + ' rating' + (this.ratings.total > 1 ? 's' : '')+'</th></tr</thead><tbody>');

		
		// We need to sort them now
		
		//console.log(this.ratings.stars);
		this.ratings.stars.sort( function( a, b) {
			return b.rating - a.rating;
		});
		

		var cnt = 0;
		for(var i = 4; i > -1; i--) {
			rate	= this.ratings.stars[cnt];
			if(!rate || rate.rating != i+ 1 )  {
				rate = {
					'count'  : 0,
					'rating' : i +1
				} 
			} else {
				cnt++
			}
			
			html.push('<tr>');
			
			currentPct 	= Math.round( ( 100 * rate.count) / this.ratings.total )
			//currentPct		= 
			row 			= '';
			
			html.push('<th>' + ( rate.rating  ) + ' star' + (rate.rating > 1 ? 's' : '') +': '  + '</th>');
		
			html.push('<td class="table-stars-bar"><div style="width: '+currentPct + '%;"></div></td>');
			html.push('<td>' + rate.count +'</td>');
			html.push('<td>' + currentPct + '%' +'</td>');
			
			//html.push(row+'\n');
			html.push('</tr>');			
			
		}

		html.push('</tbody></table>')		
		return html.join('');
		
	},
	
	getCommentsHTML : function() {
		if(this.comments && this.comments.latest && this.comments.latest.entity) {
			var html = ['<div style="max-height: '+ (document.body.offsetHeight -10) + 'px;overflow: auto;"><strong>Latest comment from: ' + (this.comments.latest.entity.nickname || 'Anonymoys')+'</strong>'];
			html.push('<p>'+(this.comments.latest && this.comments.latest.comment ? this.comments.latest.comment.replace(/\n/gi, '<br />')  : 'N/A') + '</p></div>');
		
			return html.join('');
		} else {
			return null;
		}
	},
	
	getGraph : function(type, source) {
		var self 		= this;
		var interval	= 3600 *1000* 5; // 5 hours
		this.graphData	= this.graphData || {
			'fetched'		: null,
			'popularity' 	: [],
			'rating'		: [],
			'ticks'			: []
		}
		
		// Already done
		if(source.graph) {
			return source.graphElement;
		}
	
		// We need an absolute temp dom
		if(!window.absoluteElement) {
			window.absoluteElement = $C('div');
			window.absoluteElement.style.cssText = 'position: absolute; top: 0; left: 0; opacity: 1;'
			window.absoluteElement.injectIn(document.body);
		}
	
		// Create an absolute element to make the graph in
		if(!source.graphElement) {
			source.graphElement 					= $C('div');
			source.graphElement.innerHTML 			= 'loading ...';
		
			source.graphElement.injectIn(window.absoluteElement);
		}	
	
		
		// Already		
		if(this.graphData.fetched && (new Date().getTime() - this.graphData.fetched ) < interval) {
		//if(0){
			if( this.graphData[type] ) {
				source.graphElement.style.cssText  				= 'margin-bottom: 20px; margin-left: 25px; width: 170px; height: 35px;border-bottom: 1px solid #ffcc66;';
				
				source.graph = new Graph([ this.graphData[type] ], source.graphElement);
				source.graph.setOptions({
					'reverse' : true,
					'ticks' : this.graphData['ticks']
				}).setSeries([ this.graphData[type] ] );
				
			} else {
					source.graphElement.innerHTML = '<p style="text-align: center;">Not enough data to plot graph</p>';
			}
		} else {		
			new Ajax({
				'url'		: 'http://chrome.pathfinder.gr/My/getdata.php?id=' + this.hash,
				'method'  	: 'get',
				'onSuccess' : function(xhr) {
					self.graphData = {
						'fetched' : new Date().getTime()
					};
					
					var json 		= xhr.responseJSON;
					
					if(!json || json.length == 0) {
						Ext.store();
						source.graphElement.innerHTML = '<p style="text-align: center;">Not enough data to plot graph</p>';
						return ;
					}
					
					source.graphElement.style.cssText  = 'margin-bottom: 20px; margin-left: 25px; width: 170px; height: 35px;border-bottom: 1px solid #ffcc66;'
					var popularity 	= {
						'data': [],
						'fill': true,
						'stroke' : true,
						'ctx' : {
							'lineWidth' 		: 1,
							'strokeStyle' 		: '#fff',
							'fillStyle'			: '#ffcc66'
						}
					};
					
					
					var rating 	= {
						'data': [],
						'fill': true,
						'stroke' : true,
						'ctx' : {
							'lineWidth' 		: 1,
							'strokeStyle' 		: '#fff',
							'fillStyle'			: '#ffcc66'
						}
					};
					
					
					var users 	= {
						'data': [],
						'fill': true,
						'stroke' : true,
						'ctx' : {
							'lineWidth' 		: 1,
							'strokeStyle' 		: '#fff',
							'fillStyle'			: '#ffcc66'
						}
					};
					
					
					var ticks		= {};
					var cnt 		= 0;
					json.each(function(item, index) {
						var date = new Date(item.ts * 1000);
						
						ticks[type] = ticks[type] || {};
						
						popularity.data.push(item.popularity);
						rating.data.push(item.rating);
						
						if(parseInt(item.users)){
							ticks[type][cnt++] =date.toGMTString().replace(/^.*? |20.*?$/gi, '');
							users.data.push(item.users);
						} else {
							
							ticks[type][cnt++] = date.toGMTString().replace(/^.*? |20.*?$/gi, '');
						}
						
					});
					
					self.graphData['popularity'] 	= popularity;
					self.graphData['rating'] 		= rating;
					self.graphData['ticks']			= ticks;
					
					if(type === 'users' && users.data.length === 0) {
						source.graphElement.innerHTML = '<p style="text-align: center;">Not enough data to plot graph</p>';
						
						return;
					}

					
					var scope = eval(type);
					
					source.graph = new Graph([], source.graphElement);		
					
					source.graph.setOptions({
						'ticks' 	: ticks[type],
						'reverse' 	: type != 'users' ? true : false
					}).setSeries(  [ scope] );
				}
				}).send();
		}
		
		
		
		// Let's construct this
		

		
		
		

		// We might need this
		//source.graph = new Graph(null, source.graphElement);

		// That is what we need :)
		return source.graphElement;		
		
	}
});

Ext.Bg = {
	update : function() {
		chrome.extension.sendRequest( { 'bg.update' : true}, function(response) {
			// response handler
		});	
	},
	
	reload	: function() {
		chrome.extension.sendRequest( { 'bg.reload' : true}, function(response) {
			// response handler
		});	
		
	},
	
	interval : function() {
		chrome.extension.sendRequest( { 'bg.interval' : true}, function(response) {
			// response handler
		});	
	}
}

Ext.Notification = new Class({
	options		: {
		'icon'	: 'icons/48.png',
		'title'	: 'My Extensions - New Comment!',
		'ttl'	: null
	},
	
	initialize	: function(text, title, icon, options) {
		this.setOptions(options);
		
		if(!( webkitNotifications && webkitNotifications.createNotification)) {
			return this;
		}
		this.notification = webkitNotifications.createNotification(icon || this.options.icon, title || this.options.title, text);
		
		if(this.options.ttl) {
			this.close.delay(this.options.ttl);
		}
		
		return this.show();
	},
	
	close		: function() {
		this.notification.close();
	},
	
	show		: function() {
		this.notification.show();
	}
}).implement(new Events, new Options);




Ajax.setOptions({
	//'timeout'		: 15000,
	'onTimeout'		: function() {
		//
		// window.alert('There seems to be an network issue, please try again later');
		//console.log('Timing out');
	}
});
