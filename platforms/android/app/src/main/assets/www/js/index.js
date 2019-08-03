var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.content = null;
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    getFile: function(event) {
        var file = event.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        var self = this;
        reader.onloadend = function (event_target) {
            app.content = JSON.parse(event_target.target.result);
            app.receivedEvent(null);
            document.getElementById("ShowInputs").style = "";
        };
        reader.readAsText(file);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById("content");
        
        if (this.content !== null) {
            var highlighter = function(code, lang) {
            if (typeof lang === 'undefined') lang = 'markup';
            
            if (!Prism.languages.hasOwnProperty(lang)) {
                try {
                    require('prismjs/components/prism-' + lang + '.js');
                } catch (e) {
                    console.warn('** failed to load Prism lang: ' + lang);
                    Prism.languages[lang] = false;
                }
            }
            
            return Prism.languages[lang] ? Prism.highlight(code, Prism.languages[lang]) : code;
        };
            
        nb.highlighter = function(text, pre, code, lang) {
                var language = lang || 'text';
                pre.className = 'language-' + language;
                if (typeof code != 'undefined') {
                    code.className = 'language-' + language;
                }
                return highlighter(text, language);
            };
            var notebook = nb.parse(this.content);
            parentElement.innerHTML = notebook.render().outerHTML;
        } else {
            this.inputs_visible = true;
            document.getElementById("FileInput").addEventListener('change', this.getFile, false);
            document.getElementById("ShowInputs").addEventListener('click', this.inputs, false);
        }
    },

    inputs: function(event) {
        this.inputs_visible = !this.inputs_visible;
        document.getElementById("ShowInputs").innerText = (
            this.inputs_visible ? "Hide Code" : "Show Code"
        );
        var elements = document.getElementsByClassName("nb-input");
        for (var index in elements) {
            if (!elements[index].classList) continue;
            if (this.inputs_visible) {
                elements[index].classList.remove('inputs-hidden');
            } else {
                elements[index].classList.add('inputs-hidden');
            }
        }
    }
};

app.initialize();