tpl = {

    templatesPattern: {
        'resourcePath': '<li>{{ resourcePath }}</li>',
        'content': '<div> <p> {{ apiVersion }} </p> </div>'
    },

    templates: {},

    loadTemplates: function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);

            //$.get('tpl/' + name + '.html', function(data) {

            that.templates[name] = Handlebars.compile($('#' + name).html());
            index++;
            if (index < names.length) {
                loadTemplate(index);
            } else {
                callback();
            }
            //});
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    },
    getResourcePath: function (rp) {
        return Handlebars.compile(this.templatesPattern.resourcePath)(rp);
    },
    getContent: function (c) {
        return Handlebars.compile(this.templatesPattern.content)(c);
    },
    buildTab: function () {
        $('#verticalTab').easyResponsiveTabs({
            type: 'vertical',
            width: 'auto',
            fit: true
        });
    }



};

App.template = function (id) {
    return Handlebars.compile($('#' + id).html());
};
