

PageViewModel = function(){
    self = this;
    self.user = ko.observable({ id: '', name: ''});
    self.friends = ko.observableArray([{id: '', name: '' }]);
    self.events = ko.observableArray([{id: '', category: '', name: '' }]);
    self.interests = ko.observableArray([{id: '', name: ''}]);

    self.initialize = function(userId) {

        // load initial user
        var userQuery = {
            'query': 'START u = node(' + userId + ') RETURN u.id, u.name',
            'params' : {}
        };

        var friendsQuery = {
            'query': 'START u = node(' + userId + ') MATCH u -[:FRIEND]- f RETURN f.id, f.name',
            'params' : {}
        };

        var eventsQuery = {
            'query': 'START u = node(' + userId  + ') MATCH e <-[:REGISTERED]- u RETURN e.id, e.name, e.category',
            'params' : {}
        };

        var interestQuery = {
            'query': 'START u = node (' + userId + ') MATCH i -[:INTERESTED_IN] - u RETURN i.id, i.name',
            'params' : {}
        };

        callApi(userQuery, self.populateUserData);
        callApi(friendsQuery, self.populateFriendData);
        callApi(eventsQuery, self.populateEventData);
        callApi(interestQuery, self.populateInterestData);
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

    self.populateInterestData = function(interestData) {
        self.interests.removeAll();
        for (var i = 0; i < interestData.data.length; i++) {
            self.interest.push(new InterestModel(interestData.data[i][0], interestData.data[i][1]));
        };
    };
}

$(function() {
    var viewModel = new PageViewModel();

    viewModel.initialize(1);

    ko.applyBindings(viewModel);

    pageViewModel = viewModel;
});