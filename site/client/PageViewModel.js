

PageViewModel = function(){
    self = this;
    self.user = ko.observable({ id: '', name: ''});
    self.friends = ko.observableArray([{id: '', name: '' }]);
    self.events = ko.observableArray([{id: '', category: '', name: '' }]);
    self.initialize = function(userId) {

        // load initial user
        var userQuery = {
            'query': 'START u = node(' + userId + ') RETURN u.id, u.name',
            'params' : {}
        };

        var friendsQuery = {
            'query': 'START u = node(' + userId + ') MATCH u -[:FRIEND]- f RETURN f.id, f.name',
            'params' : {}
        }

        var eventsQuery = {
            'query': 'START u = node(' + userId  + ') MATCH e <-[:REGISTERED]- u RETURN e.id, e.name, e.category',
            'params' : {}
        }
        callApi(userQuery, self.populateUserData);
        callApi(friendsQuery, self.populateFriendData);
        callApi(eventsQuery, self.populateEventData)
    };

    self.populateUserData = function(userData) {
        self.user(new UserModel(userData.data[0][0], userData.data[0][1]));
    };

    self.populateFriendData = function(friendData) {
        self.friends.removeAll();
        for (var i = 0; i < friendData.data.length; i++) {
            self.friends.push(new FriendModel(friendData.data[i][0], friendData.data[i][1]));
        };
    };

    self.populateEventData = function(eventData) {
        self.events.removeAll();
        for (var i = 0; i < eventData.data.length; i++) {
            self.events.push(new EventModel(eventData.data[i][0], eventData.data[i][1], eventData.data[i][2]));
        };
    };

}

$(function() {
    var viewModel = new PageViewModel();

    viewModel.initialize(1);

    ko.applyBindings(viewModel);

    pageViewModel = viewModel;
});