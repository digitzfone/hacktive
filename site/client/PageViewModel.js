

PageViewModel = function(){
    self = this;
    self.user = ko.observable({ id: '', name: ''});
    self.friends = ko.observableArray([{id: '', name: '' }]);
    self.events = ko.observableArray([{id: '', category: '', name: '' }]);
    self.interests = ko.observableArray([{id: '', name: ''}]);
    self.events_my_friends_are_registered_for = ko.observableArray([{id: '', name: '', category: ''}]);
    self.events_my_friends_with_a_similar_interest_are_registered_for = ko.observableArray([{id: '', name: '', category: ''}]);
    self.foaf = ko.observableArray([{ id: '', name: ''}]);
    self.friends_with_similar_interests = ko.observableArray([{id: '', name: ''}]);

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

        var my_friends_registered_query = {
            'query': 'START u = node(' + userId + ') MATCH u -[:FRIEND]- f -[:REGISTERED]-> e WHERE NOT (u -[:REGISTERED]-> e) RETURN DISTINCT e.id, e.name, e.category',
            'params' : {}
        };
        //START u = node(1) MATCH u -[:INTERESTED_IN]- i -[:INTERESTED_IN]- u2 -[:REGISTERED]-> e -[:RELATED_TO]- i WHERE NOT (u -[:REGISTERED]-> e) RETURN DISTINCT e.id, e.name, e.category;
        var my_friends_with_similar_interest_query = {
            'query': 'START u = node(' + userId + ') MATCH u -[:INTERESTED_IN]- i -[:INTERESTED_IN]- u2 -[:REGISTERED]-> e -[:RELATED_TO]- i WHERE NOT (u -[:REGISTERED]-> e) RETURN DISTINCT e.id, e.name, e.category',
            'params' : {}
        };

        var foaf_query = {
            'query': 'START u = node(' + userId + ') MATCH u -[:REGISTERED]-> e <-[:REGISTERED]- foaf -[:FRIEND]- () -[:FRIEND]- u RETURN DISTINCT foaf.id, foaf.name',
            'params' : {}
        };

        var friends_with_similar_interests_query = {
            'query': 'START u = node(' + userId + ') MATCH u -[:INTERESTED_IN]- i -[:INTERESTED_IN]- f WHERE NOT (u -[:FRIEND]- f) RETURN f.id, f.name',
            'params' : {}
        };


        callApi(userQuery, self.populateUserData);
        callApi(friendsQuery, self.populateFriendData);
        callApi(eventsQuery, self.populateEventData);
        callApi(interestQuery, self.populateInterestData);
        callApi(my_friends_registered_query, self.eventsMyFriendsAreRegisteredForData);
        callApi(my_friends_with_similar_interest_query, self.myFriendsWithSimilarInterestData);
        callApi(foaf_query, self.foafData);
        callApi(friends_with_similar_interests_query, self.friendsWithSimilarInterestsData);
    };

    self.currentUser = ko.observable();

    self.populateUserData = function(userData) {
        self.currentUser(userData.data[0][0]);
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
            self.interests.push(new InterestModel(interestData.data[i][0], interestData.data[i][1]));
        };
    };

    self.eventsMyFriendsAreRegisteredForData = function(eventData) {
        self.events_my_friends_are_registered_for.removeAll();
        for (var i = 0; i < eventData.data.length; i++) {
            self.events_my_friends_are_registered_for.push(new EventModel(eventData.data[i][0], eventData.data[i][1], eventData.data[i][2]));
        };
    };

    self.myFriendsWithSimilarInterestData = function(eventData) {
        self.events_my_friends_with_a_similar_interest_are_registered_for.removeAll();
        for (var i = 0; i < eventData.data.length; i++) {
            self.events_my_friends_with_a_similar_interest_are_registered_for.push(new EventModel(eventData.data[i][0], eventData.data[i][1], eventData.data[i][2]));
        };
    };

    self.foafData = function(foafData) {
        self.foaf.removeAll();
        for (var i = 0; i < foafData.data.length; i++) {
            self.foaf.push(new FriendModel(foafData.data[i][0], foafData.data[i][1]));
        };
    };

    self.friendsWithSimilarInterestsData = function(friendData) {
        self.friends_with_similar_interests.removeAll();
        for (var i = 0; i < friendData.data.length; i++) {
            self.friends_with_similar_interests.push(new FriendModel(friendData.data[i][0], friendData.data[i][1]));
        };
    };

    self.loadNewUser = function(item, elem){
        var id = parseInt($(elem.currentTarget).attr('data-id'));
        self.initialize(id);
    };
}

$(function() {
    var viewModel = new PageViewModel();

    viewModel.initialize(1);

    ko.applyBindings(viewModel);

    pageViewModel = viewModel;
});