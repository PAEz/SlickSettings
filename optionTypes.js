optionTypes = {};
// Seperating the bundle html out, for Search again
var BundleHTML = Fiber.extend(function(parent) {
    return {
        init:function(type,append) {
            this.setupDOM(type,append);
        },
        setupDOM: function(type,append){
                       this.bundle = $create("div", {
                className: "setting bundle " + type
            });

            this.container = $create("div", {
                className: "setting container " + type
            });

            if (append)this.container.$append(append);

            //this.bundle.appendChild(this.container);

            //this.elements.content = this.bundle; 
        }
        }
    });
var TypeBase = BundleHTML.extend(function(parent) {
    return {
        init: function(manifest, path) {
            this.elements = {};
            this.element = null;

            this.searchString = '';


            this.manifest = manifest;
            this.path = path + '_' + this.manifest.name; // + '.tabs';
            this.id = this.path;
            this.type = manifest.type;
            this.value = this._storage.get(this.path, this.manifest.initial, this.manifest);
        },
        setupDOM: function(append) {

            parent.setupDOM.call(this,this.type,append);
            this.bundle.appendChild(this.container);

            this.elements.content=this.bundle;

            if(this.manifest.events) {
                this.element.$addEvents(this.manifest.events);
            }
        },
        createDOM: function() {

        },
        addEvents: function() {
            this.element.addEventListener("change", function(event) {
                this.set(this.element.value);
            }.bind(this));
        },
        get: function() {
            return this.value;
        },
        set: function(value) {
            this.value = value;
            console.debug(this.path, value)
            this._storage.set(this.path, value, this.manifest);
            return this;
        },
        searchAdd: function(what) {
            this.searchString += '*' + what.toLowerCase();
            return what;
        },
        // last minute addition....
        // If you want to set an options value from outside settings
        // do....
        // settings.options['path_to_option'].update(value)
        update: function(value) {
            if(value !== undefined && value !== null) this.set(value);
            this.createDOM();
        }
    }
});
optionTypes.description = TypeBase.extend(function(parent) {
    return {
        addEvents: undefined,
        get: undefined,
        set: undefined,

        editorTemplate: {
            template: {
                name: '',
                type: 'description',
                text: 'i18n'
            },
            title: 'name'
        },
        //alignable:''
        //alignRight:['element'],
        init: function(manifest, path) {

            parent.init.call(this, manifest, path);
            this.value = $getMessage(this.path + '_text', this.manifest.text);
            this.setupDOM();
            this.createDOM();

        },

        setupDOM: function() {

            this.element = $create("p", {
                className: "setting element description",
                id: this.path
            });

            parent.setupDOM.call(this, this.element);
        },

        createDOM: function() {
            this.element.innerHTML = this.value;
        }
    }
});
optionTypes.text = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'text',
                label: 'i18n',
                holder: 'i18n',
                initial: ''
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                className: "setting element text",
                id: this.path,
                type: "text"
            });
            this.label = $create("label", {
                "class": "setting label text"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
            if(this.manifest.holder) this.element.setAttribute('placeholder', $getMessage(this.path + '_holder', this.manifest.holder));
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
            this.element.addEventListener("keyup", change);
        }
    }
});

optionTypes.checkbox = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'checkbox',
                label: 'i18n',
                initial: false
            },
            title: 'label'
        },

        alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                "id": this.path,
                "class": "setting element checkbox",
                "type": "checkbox",
                "checked": "false"
            });
            this.label = $create("label", {
                "class": "setting label checkbox",
                attributes:{"for": this.path}
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.checked = this.value;
        },

        addEvents: function() {
            this.element.addEventListener("change", function(event) {
                this.set(this.element.checked);
            }.bind(this));
        }
    }
});

optionTypes.button = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: "",
                type: "button",
                label: 'i18n',
                text: 'i18n'
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            //this.value = this.manifest.text;
            this.setupDOM();
            this.createDOM();

        },

        setupDOM: function() {
            this.element = $create("input", {
                "id": this.path,
                "class": "setting element button",
                "type": "button"

            });

            this.label = $create("label", {
                "class": "setting label button"
            });

            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            this.element.value = this.searchAdd($getMessage(this.path + '_text', this.manifest.text));
        }
    }
});

optionTypes.slider = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'slider',
                label: 'i18n',
                initial: 0,
                max: 1,
                min: 0,
                step: 0.01,
                display: true,
                displayModifier: "function(value) {return(value * 100).floor() + '%';}"
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);
            // this.value = Number(this._storage.get(this.path, this.manifest.initial, this.manifest));
            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                "id": this.path,
                "class": "setting element slider",
                "type": "range"
            });
            this.label = $create("label", {
                "class": "setting label slider"
            });
            this.display = $create("span", {
                "class": "setting display slider"
            });
            parent.setupDOM.call(this, [this.label, this.element, this.display]);
        },

        createDOM: function() {
            this.label.innerHTML = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));

            if(this.manifest.max !== undefined) {
                this.element.setAttribute("max", this.manifest.max);
            }

            if(this.manifest.min !== undefined) {
                this.element.setAttribute("min", this.manifest.min);
            }

            if(this.manifest.step !== undefined) {
                this.element.setAttribute("step", this.manifest.step);
            }

            if(this.manifest.display !== false) {
                if(this.manifest.displayModifier !== undefined) {
                    this.display.innerText = this.manifest.displayModifier(this.value);
                } else {
                    this.display.innerText = this.value;
                }
            }
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        },

        addEvents: function() {
            this.element.addEventListener("change", function(event) {
                this.set(this.element.value);
                if(this.manifest.displayModifier !== undefined) {
                    this.display.innerText = this.manifest.displayModifier(this.value);
                } else {
                    this.display.innerText = this.value;
                }
            }.bind(this));
        }
    }
});

optionTypes.popupButton = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: "popupButton",
                label: 'i18n',
                initial: ''
            },
            title: 'label',
            optionsList: true,
            optionsListGroups: true,
            optionsListTemplate: {
                value: '',
                text: 'i18n',
                name: ''
            },
            optionsTitle: 'text'
        },

alignable:'label',

        init: function(manifest, path) {
            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();
        },

        setupDOM: function() {
            this.element = $create("select", {
                className: "setting element popupButton",
                id: this.path,
                type: "text"
            });
            this.label = $create("label", {
                "class": "setting label popupButton"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            var options = this.manifest.options,
                option;
            var groups = {},
                group, groupName;
            var optionElement, optionsArray, groupElement;
            for(var i = 0, length = options.length; i < length; i++) {
                group = options[i];
                groupName = Object.keys(group)[0];
                group = group[groupName];
                optionsArray = [];
                for(var g = 0, gLength = group.length; g < gLength; g++) {
                    option = group[g];
                    optionElement = $create('option', {
                        innerText: this.searchAdd($getMessage(this.path + '_' + groupName + '_' + option.name, option.text)),
                        value: option.value
                    });
                    optionsArray.push(optionElement);
                }
                if(groupName !== 'NoGroup') {
                    groupElement = $create('optgroup', {
                        label: this.searchAdd($getMessage(this.path + '_' + groupName, groupName))
                    }).$append(optionsArray);
                    this.element.appendChild(groupElement);
                } else {
                    this.element.$append(optionsArray);
                }
            }
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        }
    }
});

optionTypes.listBox = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: "listBox",
                label: 'i18n',
                initial: ''
            },
            title: 'label',
            optionsList: true,
            optionsListGroups: true,
            optionsListTemplate: {
                value: '',
                text: 'i18n',
                name: ''
            },
            optionsTitle: 'text'
        },

         alignable:'label',
         alignRight:['element'],

        init: function(manifest, path) {
            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();
        },

        setupDOM: function() {
            this.element = $create("select", {
                className: "setting element listBox",
                id: this.path,
                type: "text",
                size: 9999
            });
            this.label = $create("label", {
                "class": "setting label listBox"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            var options = this.manifest.options,
                option;
            var groups = {},
                group, groupName;
            var optionElement, optionsArray, groupElement;
            for(var i = 0, length = options.length; i < length; i++) {
                group = options[i];
                groupName = Object.keys(group)[0];
                group = group[groupName];
                optionsArray = [];
                for(var g = 0, gLength = group.length; g < gLength; g++) {
                    option = group[g];
                    optionElement = $create('option', {
                        innerText: this.searchAdd($getMessage(this.path + '_' + groupName + '_' + option.name, option.text)),
                        value: option.value
                    });
                    optionsArray.push(optionElement);
                }
                if(groupName !== 'NoGroup') {
                    groupElement = $create('optgroup', {
                        label: this.searchAdd($getMessage(this.path + '_' + groupName, groupName))
                    }).$append(optionsArray);
                    this.element.appendChild(groupElement);
                } else {
                    this.element.$append(optionsArray);
                }
            }
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        }
    }
});

optionTypes.radioButtons = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: "radioButtons",
                label: 'i18n',
                initial: ''
            },
            title: 'label',
            optionsList: true,
            optionsListGroups: true,
            optionsListTemplate: {
                value: '',
                text: 'i18n',
                name: ''
            },
            optionsTitle: 'text'
        },

 alignable:'label',
         alignRight:['element'],

        init: function(manifest, path) {
            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();
        },

        setupDOM: function() {
            this.element = $create("div", {
                className: "radioButtonsHolder"
            });
            this.label = $create("label", {
                "class": "setting label radioButtons"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            var options = this.manifest.options,
                option;
            var optionElement, input, label, optionsArray = [];
            for(var i = 0, length = options.length; i < length; i++) {
                option = options[i];
                optionElement = $create('div', {
                    className: 'radioButtonsGroup'
                });
                label = $create('label', {
                    className: "setting element-label radio-buttons",
                    innerText: this.searchAdd($getMessage(this.path + '_' + option.name, option.text)),
                    attributes: {
                        'for': this.path + '_' + option.name
                    }
                });
                input = $create('input', {
                    type: "radio",
                    className: "setting element radio-buttons",
                    value: option.value,
                    id: this.path + '_' + option.name,
                    name: this.path + '_' + option.name
                });
                optionElement.$append([input, label]);
                optionsArray.push(optionElement);
            }
            this.element.$append(optionsArray);
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) {
                var el = this.element.$find('[value="' + this.value + '"]');
                if(el) {
                    el.checked = true;
                    this.checked = el;
                }
            }
        },
        addEvents: function() {
            this.element.addEventListener("change", function(event) {
                if(event.target !== this.checked) {
                    this.checked.checked = false;
                    this.checked = event.target;
                    this.set(event.target.value);
                }
            }.bind(this));
        },
    }
});

optionTypes.textarea = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'textarea',
                label: 'i18n',
                holder: 'i18n',
                initial: ''
            },
            title: 'label'
        },

 alignable:'label',
         alignRight:['element'],

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("textarea", {
                className: "setting element textarea",
                id: this.path
            });
            this.label = $create("label", {
                "class": "setting label text"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
            if(this.manifest.holder) this.element.setAttribute('placeholder', $getMessage(this.path + '_holder', this.manifest.holder));
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
            this.element.addEventListener("keyup", change);
        }
    }
});

optionTypes.date = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'date',
                label: 'i18n',
                initial: ''
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                className: "setting element date",
                id: this.path,
                type: "date"
            });
            this.label = $create("label", {
                "class": "setting label date"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
        }
    }
});

optionTypes.time = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'time',
                label: 'i18n',
                initial: ''
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                className: "setting element time",
                id: this.path,
                type: "time"
            });
            this.label = $create("label", {
                "class": "setting label time"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
        }
    }
});
// colour is spelt the american way because they whinge more than anyone ;)
optionTypes.color = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'color',
                label: 'i18n',
                initial: ''
            },
            title: 'label'
        },

        alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                className: "setting element color",
                id: this.path,
                type: "color"
            });
            this.label = $create("label", {
                "class": "setting label color"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
        }
    }
});

optionTypes.number = TypeBase.extend(function(parent) {
    return {

        editorTemplate: {
            template: {
                name: '',
                type: 'number',
                label: 'i18n',
                initial: 0,
                max: 1,
                min: 0,
                step: 1
            },
            title: 'label'
        },

alignable:'label',

        init: function(manifest, path) {

            parent.init.call(this, manifest, path);

            this.setupDOM();
            this.createDOM();
            this.addEvents();

        },

        setupDOM: function() {
            this.element = $create("input", {
                className: "setting element number",
                id: this.path,
                type: "number"
            });
            this.label = $create("label", {
                "class": "setting label number"
            });
            parent.setupDOM.call(this, [this.label, this.element]);
        },

        createDOM: function() {
                        if(this.manifest.max !== undefined) {
                this.element.setAttribute("max", this.manifest.max);
            }

            if(this.manifest.min !== undefined) {
                this.element.setAttribute("min", this.manifest.min);
            }

            if(this.manifest.step !== undefined) {
                this.element.setAttribute("step", this.manifest.step);
            }

            this.label.innerText = this.searchAdd($getMessage(this.path + '_label', this.manifest.label));
            if(this.value !== undefined && this.value !== null) this.element.value = this.value;
        },

        addEvents: function() {
            var change = function(event) {
                    this.set(this.element.value);
                }.bind(this);

            this.element.addEventListener("change", change);
        }
    }
});