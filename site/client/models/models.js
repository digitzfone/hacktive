UserModel = function(userID, name) {

    var self = this;

    self.id = ko.observable(userID);
    self.name = ko.observable(name);

};

FriendModel = function(friendId, name) {
	var self = this;

	self.id = ko.observable(friendId);
	self.name = ko.observable(name);
};

EventModel = function(eventId, name, category) {
	var self = this;

	self.id = ko.observable(eventId);
	self.name = ko.observable(name);
	self.category = ko.observable(category);
};