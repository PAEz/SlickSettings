var manifest = {
	name: 'Slick-Settings',
	icon: 'icon.png',
	version: 0.7,
	initialTab: 'About',
	settings: [{
		"Information": [{
			"Login": [{
				name: 'username',
				type: 'text',
				label: 'User Name',
				holder: 'Enter your user name'
			}, {
				name: 'password',
				type: 'text',
				label: 'Password',
				holder: 'Enter your password'
			}, {
				name: 'myDescription',
				type: 'description',
				text: 'Heres where you put the description.'
			}]
		}, {
			"Logout": [{
				name: 'enableLogin',
				type: 'checkbox',
				label: 'Enable LogIn/LogOut',
				initial: false
			}, {
				name: "logOutButton",
				type: "button",
				label: 'Disconect',
				text: 'LogOut',
				events: {
					click: function(evt) {
						alert('You clicked me!');
					}
				}
			}]
		}]
	}, {
		"Details": [{
			"Sound": [{
				name: 'notiVolume',
				type: 'slider',
				label: 'Notification volume:',
				initial: 0,
				max: 1,
				min: 0,
				step: 0.01,
				display: true,
				displayModifier: function(value) {
					return Math.floor(value * 100) + "%";
				}
			}, {
				name: 'soundVolume',
				type: 'slider',
				label: 'Sound volume:',
				initial: 0,
				max: 100,
				min: 0,
				step: 1,
				display: true,
				displayModifier: function(value) {
					return value + "%";
				}
			}]
		}, {
			"Food": [{
				name: 'myPopupButton',
				type: "popupButton",
				label: 'Soup 1 should be:',
				initial: 'hot',
				options: [{
					"Hot": [{
						value: 'hot',
						text: 'Very hot',
						name: 'hot'
					}, {
						value: 'medium',
						text: 'Medium',
						name: 'medium'
					}]
				}, {
					"Cold": [{
						value: 'cold',
						text: 'Cold',
						name: 'cold'
					}]
				}, {
					"NoGroup": [{
						value: 'groupless1',
						text: 'Not in a group',
						name: 'groupless1'
					}, {
						value: 'groupless2',
						text: 'Neither is this',
						name: 'groupless2'
					}]
				}]
			}, {
				name: 'myListBox',
				type: 'listBox',
				label: 'Soup 2',
				initial: 'hot',
				options: [{
					"Hot": [{
						value: 'hot',
						text: 'Very hot',
						name: 'hot'
					}, {
						value: 'medium',
						text: 'Medium',
						name: 'medium'
					}]
				}, {
					"Cold": [{
						value: 'cold',
						text: 'Cold',
						name: 'cold'
					}]
				}, {
					"NoGroup": [{
						value: 'groupless1',
						text: 'Not in a group',
						name: 'groupless1'
					}, {
						value: 'groupless2',
						text: 'Neither is this',
						name: 'groupless2'
					}]
				}]
			}, {
				name: 'myRadioButtons',
				type: 'radioButtons',
				label: 'Soup 3 should be:',
				initial: 'hot',
				options: [{
					value: 'hot',
					text: 'Hot and yummy',
					name: 'hot'
				}, {
					value: 'cold',
					text: 'Cold an icky',
					name: 'cold'
				}]
			}, {
				name: 'myDescriptionOfFood',
				type: 'textarea',
				label: 'Describe the food:',
				holder: 'Describe what you thought of the food...'
			}]
		}]
	}, {
		"New": [{
			"DatePicker": [{
				name: 'whatday',
				type: 'date',
				label: 'What Day'
			}, {
				name: 'whattime',
				type: 'time',
				label: 'What Time'
			}]
		},{
			"ColorPicker": [{
				name: 'whatcolour',
				type: 'color',
				label: 'Pick a Color',
				initial:'#FF00FF'
			}]
		},{
			"Number": [{
				name: 'whatnumber',
				type: 'number',
				label: 'Pick a number',
				initial:0,
				min:0,
				max:100000,
				step:1
			}]
		}]
	},{
		"About": '#about-page'
	}]
}