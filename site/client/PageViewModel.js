

PageViewModel = function(){
    self = this;
    self.user = ko.observable({ id: '', name: ''});
    self.friends = ko.observableArray([{id: '', name: '' }]);
    self.initialize = function(userId) {

        // load initial user
        var userOptions = {
            'query': 'START u = node(' + userId + ') RETURN u.id, u.name',
            "params" : {}
        };

        var friendOptions = {
            'query': 'START u = node(' + userId + ') MATCH u -[:FRIEND]- f RETURN f.id, f.name',
            "params" : {}
        }
        callApi(userOptions, self.populateUserData);
        callApi(friendOptions, self.populateFriendData);
    };

    self.populateUserData = function(userData) {
        self.user(new UserModel(userData.data[0][0], userData.data[0][1]));
    };

    self.populateFriendData = function(friendData) {
        for (var i = 0; i < friendData.data.length; i++) {
            self.friends.push(new FriendModel(friendData.data[i][0], friendData.data[i][1]));
        };
    };
}

$(function() {
    var viewModel = new PageViewModel();

    viewModel.initialize(1);

    ko.applyBindings(viewModel);

    pageViewModel = viewModel;
});