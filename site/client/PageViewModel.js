

PageViewModel = function(){
    self = this;

    self.initialize = function() {

        // load initial user
        var options = {
            'query': 'START u = node(1) RETURN u.id, u.name',
            'params': {}
        };
        callApi(options, self.populateUserData);
    };

    self.user = ko.observable({ id: '', name: ''});

    self.populateUserData = function(userData) {
        self.user(new UserModel(userData.data[0][0], userData.data[0][1]));
    };
}

$(function() {
    var viewModel = new PageViewModel();

    viewModel.initialize();

    ko.applyBindings(viewModel);

    pageViewModel = viewModel;
});