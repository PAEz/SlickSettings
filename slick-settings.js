Search = Fiber.extend(function(parent) {
    return {
        init: function() {
            this.elements = {};

            this.found = [];

            this.groups = {};
            this.groupNames = [];

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },
        setupDOM: function() {
            this.resultsContainer = $create('div');
            this.nothingFoundContainer = $find('#Nothing_Found');
            this.nothingFoundMessage = $find('#Nothing_Found_Message');
            this.search = $find('#search');
            this.searchResult = $find('#search-result');
        },
        createDOM: function() {
            $set("#search-label", {
                innerText: $getMessage("_search_title", "Search")
            });
            this.search.$set({
                placeholder: $getMessage("_search_placeholder", ".search...")
            });
            this.nothingFoundMessage.$set({
                innerText: $getMessage("_search_nothing_found", "No matches were found.")
            });
            this.searchResult.appendChild(this.resultsContainer);
        },
        addEvents: function() {
            // Create event handlers
            var find = (function(event) {
                this.find(event.target.value);
            }).bind(this);

            this.search.$addEvents({
                "keyup": function(event) {
                    if(event.key === "esc") {
                        //this.reset();
                        find(event);
                    } else {
                        find(event);
                    }
                },
                "search": find
            });
        },
        find: function(searchString) {
            if(searchString.trim() === "") {
                document.body.classList.remove("searching");
                this.searchResult.classList.remove("show");
                this.nothingFoundContainer.classList.remove("show");
                if(this.found.length > 0) for(var i = 0, length = this.found.length; i < length; i++) {
                    this.found[i].bundle.appendChild(this.found[i].container);
                }
                return;
            } else if(this.found.length > 0) {
                for(var i = 0, length = this.found.length; i < length; i++) {
                    var el = this.found.pop();
                    el.bundle.appendChild(el.container);
                }
                this.resultsContainer.innerHTML = '';
                this.groups = {};
                this.groupNames = [];
            }

            searchString = searchString.toLowerCase();

            document.body.classList.add("searching");
            this.searchResult.classList.add("show");

            var options = this._settings.options,
                option;
            var keys = Object.keys(options),
                key
            for(var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                if(options[key].searchString.indexOf(searchString) !== -1 || options[key].parentGroup.title.toLowerCase().indexOf(searchString) !== -1) {
                    this.found.push(options[key]);
                }
            }
            if(this.found.length > 0) {
                this.nothingFoundContainer.classList.remove("show");
                for(var i = 0, length = this.found.length; i < length; i++) {
                    var el = this.found[i];
                    if(!this.groups[el.groupName]) {
                        this.groups[el.groupName] = new GroupHTML(el.parentGroup.title);
                        this.groupNames.push(el.groupName);
                    }
                    bundle = new BundleHTML(el.type);
                    bundle.container = el.container;
                    bundle.bundle.appendChild(bundle.container);
                    this.groups[el.groupName].elements.groupContent.appendChild(bundle.bundle);
                }
                // keys = Object.keys(this.groups);
                // for(var i = 0, length = keys.length; i < length; i++) {
                //     key = keys[i];
                //     this.resultsContainer.$append(this.groups[key].elements.content);
                // }
                for(var i = 0, length = this.groupNames.length; i < length; i++) {
                    key = this.groupNames[i];
                    this.resultsContainer.$append(this.groups[key].elements.content);
                }

            } else {
                this.nothingFoundContainer.classList.add("show");
            }
        }
    }
});

// PAEz
storageTypes = {};
storageTypes.chrome = Fiber.extend(function(parent) {
    return {
        init: function(storageName, callback) {
            //delete this.init;
            this.storageName = storageName;
            this.local = {};
            this.sync = {};
            this.save = true;
            // chrome local storage
            chrome.storage.local.get(storageName, function(value) {
                if(value[storageName]) if(value[storageName].settings) {
                    this._settings.settings = value[storageName].settings;
                    this.local = value[storageName].settings;
                } else {
                    this._settings.settings = {};
                }
                // chrome sync storage
                chrome.storage.sync.get(storageName, function(value) {
                    if(value[storageName] && value[storageName].settings) {
                        $mergeObj(value[this.storageName].settings, this._settings.settings);
                        this.sync = value[this.storageName].settings;

                    }
                    //this._settings.init2();
                    callback();
                }.bind(this));
            }.bind(this));
        },
        set: function(path, value, options, callback) {
            var store = this.storageName;
            var settings = this._settings.settings;
            var oldValue = $getObjValue(settings, path);
            console.debug('save', path, oldValue, value)
            if(oldValue !== value) {
                //console.debug('not')
                $setObjValue(settings, path, value);
                var what = {};
                what[store] = {};
                what[store].lastUpdate = {
                    action: 'set',
                    path: path,
                    newValue: value,
                    oldValue: oldValue
                };
                what[store].version = this._settings.settings._version;
                if(options.sync) {
                    $setObjValue(this.sync, path, value);
                    what[store].settings = this.sync;
                    if(this.save) chrome.storage.sync.set(what, callback);
                } else {
                    //console.debug('local',what)
                    $setObjValue(this.local, path, value);
                    what[store].settings = this.local;
                    if(this.save) chrome.storage.local.set(what, callback);
                }
            } else {
                if(callback) callback({});
            }
        },
        get: function(path, initial, options) {
            var value = $getObjValue(this._settings.settings, path);
            if(value === undefined || value === null && initial !== undefined && initial !== null) {
                this.set(path, initial, options);
                return initial;
            }
            return value;
        },
        setVersion: function(version, callback) {
            var store = this.storageName;
            var what = {};
            what[store] = {};
            what[store].lastUpdate = {
                action: 'version',
                version: version
            };
            what[store].settings = this._settings.settings;
            this._settings.settings._version = version;
            chrome.storage.local.set(what, callback);
        },
        // use the following to get your default setttings that you can use
        // to set the default settings in your background/event page
        // Use setChromeStorage with what this returns
        // Have a look at the comments after this class
        getSettings: function() {
            var store = this.storageName;
            what = {};
            what[store] = {};
            what[store].local = this.local;
            what[store].sync = this.sync;
            console.debug(JSON.stringify(what, null, '  '));
        }

    }
});
/*
// this variable is set to the output of getSettings
defaultSettings = {
    "SlickSettings": {
        "local": {
            "_version": 0.7,
            "Information": {
                "Login": {
                    "username": null,
                    "password": null,
                    "myDescription": null
                },
                "Logout": {
                    "enableLogin": null,
                    "logOutButton": null
                }
            },
            "Details": {
                "Sound": {
                    "notiVolume": null,
                    "soundVolume": null
                },
                "Food": {
                    "myPopupButton": null,
                    "myListBox": null,
                    "myDescriptionOfFood": null
                }
            }
        },
        "sync": {}
    }
}
// this is the utitlity function you can use in your background/event page
// to set storage with your default settings
setChromeStorage = function(settings) {
    var keys, name, set = {};
    name = Object.keys(settings)[0];
    set[name] = {};
    if(settings[name].local) {
        set[name].settings = settings[name].local;
        set[name].lastUpdate = {
            action: 'defaults'
        };
        chrome.storage.local.set(set);
    }
    if(Object.keys(settings[name].sync) != 0) {
        set[name].settings = settings[name].sync;
        set[name].lastUpdate = {
            action: 'defaults'
        };
        chrome.storage.sync.set(set);
    }
}

setChromeStorage(defaultSettings);
*/

var Settings = Fiber.extend(function(parent) {

    return {

        init: function(manifest, storageType, storageName, settingsObj) {
            // Put a variable in the base Fiber that everyone can see
            // So that any class extending Fiber (all of them, including this)
            // has a property that points to the class instance that is created from this
            Fiber.prototype._settings = this;

            this.name = manifest.name;
            this.icon = manifest.icon;
            this.manifest = manifest;
            this.settings = {};
            this.options = {};

            /* Dev */
            this.storageType = storageType;
            this.storageName = storageName;
            this.refreshData = {
                html: document.body.innerHTML
            } /* /Dev */

            if(!storageType && !storageTypes[storageType]) {
                console.error('Settings.init() : Either storageType not set or found.');
            } else {
                Fiber.prototype._storage = new storageTypes[storageType](storageName, this.init2.bind(this));
            }
            //this.init2();
        },
        init2: function() {
            if(this.settings._version) {
                // Having sometihng for when the manifest settings update would be sweet
                // something to move/rename/delete settings
                // will prolly wait to see how the editor works out first
                if(this.settings._version != this.manifest.version) console.debug('Need to update'); // update....it would be nice...
            } else {
                this._storage.setVersion(this.manifest.version);
            }
            this.setupDOM();
            this.createDOM();
            this.search = new Search();
            //this._storage.save = false;
            this.Tabs = new Tabs(this.manifest.settings);
            //this._storage.save = true;
            ////document.body.style.opacity='1';
            this.alignByTab();
            
            // bugged me the way it flickered when it came on, this kinda fudges that
                document.body.classList.add('opacity');
            
        },
        setupDOM: function() {
            //this.elements.heading = $find('#title');
            //this.elements.favicon = $find('#favicon');
        },
        createDOM: function() {
            $set('#title', {
                innerText: this.name
            });
            $set('#favicon', {
                href: this.icon
            });
            $set("#icon", {
                src: this.icon
            });
            $set("#settings-label", {
                innerText: $getMessage("_settings_title", "Settings")
            });
        },
        alignByType: function() { //align by type, per group
            document.body.classList.add("measuring");

            var tabs = this.Tabs.tabs;
            $objectForEach(tabs, function(tab) {
                if(tab.Groups) {
                    var groups = tab.Groups.groups;
                    $objectForEach(groups, function(group) {
                        $objectForEach(group.alignable, function(type) {
                            //  group.alignable.forEach(function(type){
                            var maxWidth = 0;
                            var width;
                            for(var i = 0, length = type.length; i < length; i++) {
                                width = type[i].label.offsetWidth;
                                if(width > maxWidth) {
                                    maxWidth = width;
                                }
                            }
                            for(var i = 0, length = type.length; i < length; i++) {
                                width = type[i].label.offsetWidth;
                                if(width < maxWidth) {
                                    type[i].label.style.marginLeft = (maxWidth - width) + "px";
                                }
                            }
                        })
                    })
                }
            })
            document.body.classList.remove("measuring");
        },
        alignByTab: function() { //align everything per tab
            document.body.classList.add("measuring");

            var tabs = this.Tabs.tabs;
            var toAlign = [];
            $objectForEach(tabs, function(tab) {
                if(tab.Groups) {
                    var groups = tab.Groups.groups;
                    $objectForEach(groups, function(group) {
                        $objectForEach(group.alignable, function(type) {
                            type.forEach(function(option) {
                                toAlign.push(option);
                            })

                        })
                    })
                }
                console.debug('toAlign', toAlign);
                //  group.alignable.forEach(function(type){
                var maxWidth = 0;
                var width, height;
                for(var i = 0, length = toAlign.length; i < length; i++) {
                    if(toAlign[i].alignable) width = toAlign[i][toAlign[i].alignable].offsetWidth;
                    if(width > maxWidth) {
                        maxWidth = width;
                    }
                }
                for(var i = 0, length = toAlign.length; i < length; i++) {
                    if(toAlign[i].alignable) {
                        width = toAlign[i][toAlign[i].alignable].offsetWidth;
                        height = toAlign[i][toAlign[i].alignable].offsetHeight;
                    }
                    if(width < maxWidth) {
                        if(toAlign[i][toAlign[i].alignable]) toAlign[i][toAlign[i].alignable].style.marginLeft = (maxWidth - width) + "px";
                        if(toAlign[i].alignRight) toAlign[i].alignRight.forEach(function(what) {
                            toAlign[i][what].$set({
                                classs: {
                                    'align-right': true
                                },
                                styles: {
                                    marginLeft: maxWidth + 15 + 'px',
                                    //moved this stuff to settings.css
                                    //width:'400px',
                                    //position:'relative',
                                    //top:'-'+20+'px'
                                }
                            })
                            //toAlign[i][what].style.marginLeft = (maxWidth - width) + "px";
                        })
                        //toAlign[i][toAlign[i].alignRight].style.marginLeft = (maxWidth - width) + "px";
                    }
                }
            })
            document.body.classList.remove("measuring");
        },
        /* Dev */
        refresh: function() {
            document.body.innerHTML = this.refreshData.html;
            Fiber.prototype._storage = new storageTypes[this.storageType](this.storageName, this.init2.bind(this));
        },
        changeTabIndex: function(from, to) {
            var arr = this.manifest.settings;
            arr.splice(to, 0, arr.splice(from, 1)[0]);
            this.refresh();

        } /* /Dev */
    }
});

var Tabs = Fiber.extend(function(parent) {

    return {

        init: function(manifest) {
            this.elements = {};

            this.manifest = manifest;

            this.tabs = {};
            this.tabsArray = [];

            this.path = '';

            this.setupDOM();
            this.createDOM();
            var initialTab = this._settings.manifest.initialTab;
            if(initialTab && this.tabs[initialTab]) {
                this.activeTab = this.tabs[initialTab];
                this.tabs[initialTab].activate();
            } else {
                this.activeTab = this.tabsArray[0];
                this.tabsArray[0].activate();
            }

        },
        setupDOM: function() {
            this.elements.tabs = document.getElementById('tab-container');
            this.elements.content = document.getElementById('content');
        },
        createDOM: function() {

            var i, length, setting, name, tab;

            for(i = 0, length = this.manifest.length; i < length; i++) {
                setting = this.manifest[i];
                id = Object.keys(setting)[0];
                tab = new Tab(id, setting[id], this.path, this);
                this.tabsArray.push(tab);
                this.tabs[tab.path] = tab;
                this.elements.content.appendChild(tab.elements.content);
                this.elements.tabs.appendChild(tab.elements.tab);
            }
        }
    }
});

var Tab = Fiber.extend(function(base) {
    return {
        init: function(id, manifest, path, creator) {
            this.elements = {};

            this.id = id;
            this.path = id;
            this.manifest = manifest;

            this.Groups;

            this.creator = creator;

            this.setupDOM();
            this.createDOM();
            this.addEvents();
        },
        setupDOM: function() {
            var content = $create("div", {
                className: 'tab-content'
            })

            var heading = $create('h2');
            content.appendChild(heading);

            var tab = $create("div", {
                className: 'tab'
            })

            this.elements.content = content;
            this.elements.tab = tab;
            this.elements.heading = heading;
        },

        createDOM: function() {
            this.elements.heading.innerText = $getMessage(this.id);
            this.elements.tab.innerText = $getMessage(this.id);
            console.debug(this.manifest);
            if(Array.isArray(this.manifest)) {
                var i, length, setting, name, group;
                group = new Groups(this.manifest, this.path);
                this.Groups = group;
                console.debug('i', i)
                this.elements.content.appendChild(group.elements.content);
            } else {
                this.elements.content = $find(this.manifest);

            }
        },

        activate: function() {
            this.creator.activeTab.deactivate();
            this.creator.activeTab = this;

            //this.elements.content.classList.add('show');
            this.elements.tab.classList.add('active');
this.elements.content.style.display='block';
var that=this;
        setTimeout(function() {
          that.elements.content.classList.add('show');
        }, 0);
        },

        deactivate: function() {
            this.elements.content.classList.remove('show');
            this.elements.tab.classList.remove('active');
            var that=this;
        setTimeout(function() {
            that.elements.content.style.display='none';
        }, 100);
        },
        addEvents: function() {
            this.elements.tab.addEventListener('click', function() {
                this.activate();
            }.bind(this));
        }
    }
});

var Groups = Fiber.extend(function(parent) {
    return {

        init: function(manifest, path) {
            this.elements = {};

            this.path = path; // + '.tabs';
            this.id = path;
            this.manifest = manifest;

            this.groupsArray = [];
            this.groups = {};

            this.setupDOM();
            this.createDOM();

        },
        setupDOM: function() {
            this.elements.content = $create('div');
        },
        createDOM: function() {

            var i, length, setting, name, group;

            for(i = 0, length = this.manifest.length; i < length; i++) {
                setting = this.manifest[i];
                id = Object.keys(setting)[0];
                group = new Group(id, setting[id], this.path, this);
                this.groupsArray.push(group);
                this.groups[id] = group;
                this.elements.content.appendChild(group.elements.content);
            }
        }
    }
});

// Seperating the html generation out so I can use it in Search
var GroupHTML = Fiber.extend(function(parent, object) {
    return {
        init: function(name) {
            this.elements = {};
            this.setupDOM();
            this.elements.groupName.innerText = name;
        },
        setupDOM: function() {

            var content = $create('table', {
                className: 'setting group'
            });

            var row = $create('tr');

            content.appendChild(row);

            var groupName = $create('td', {
                className: 'setting group-name'
            });
            var groupContent = $create('td', {
                className: 'setting group-content'
            });

            row.$append([groupName, groupContent]);

            this.elements.content = content;
            this.elements.groupName = groupName;
            this.elements.groupContent = groupContent;
        }
    }
});
var Group = GroupHTML.extend(function(parent, object) {
    return {

        init: function(id, manifest, path) {
            this.elements = {};

            this.id = id;
            this.parentPath = path;
            this.path = path + '_' + id;
            this.manifest = manifest;

            this.title = $getMessage(this.path, this.id);

            //this.alignable = {};
            this.alignable = [];

            this.optionsArray = [];
            this.setupDOM();
            this.createDOM();
        },
        setupDOM: function() {

            /*            var content = $create('table', {
                className: 'setting group'
            });

            var row = $create('tr');

            content.appendChild(row);

            var groupName = $create('td', {
                className: 'setting group-name'
            });
            var groupContent = $create('td', {
                className: 'setting group-content'
            });

            row.$append([groupName, groupContent]);

            this.elements.content = content;
            this.elements.groupName = groupName;
            this.elements.groupContent = groupContent;*/
            parent.setupDOM.call(this);
        },
        createDOM: function() {
            this.elements.groupName.innerText = this.title;

            var i, length, setting, id, type, option;

            for(i = 0, length = this.manifest.length; i < length; i++) {
                setting = this.manifest[i];
                id = setting.name;
                type = setting.type;
                if(optionTypes[type]) {
                    option = new optionTypes[type](setting, this.path);
                    if(option.alignable || option.alignRight) {
                        if(!this.alignable[option.type]) this.alignable[option.type] = [];
                        this.alignable[option.type].push(option);
                        // this.alignable.push(option);
                    }
                    option.groupName = this.id;
                    option.parentGroup = this;
                    this.optionsArray.push(option);
                    this._settings.options[option.path] = option;
                    this.elements.groupContent.appendChild(option.elements.content);
                }
            }

        }
    }
});

window.addEventListener("DOMContentLoaded", function() {
    settingsObj = {};
    settings = new Settings(manifest, 'chrome', 'SlickSettings');
    // add an event to the Logout button
    /*    $find('#Information_Logout_logOutButton').$addEvent('click', {
        event: function() {
            alet('You clicked me!');
        }
    });*/
});