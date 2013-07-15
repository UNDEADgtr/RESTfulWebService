//Models

App.Models.Task = Backbone.Model.extend({
    validate: function(attrs) {
        if( ! attrs.title || ! attrs.when ) {
            return 'title и when обязательны для заполнения!';
        }
    }
});