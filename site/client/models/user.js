

UserModel = function(userID, name) {

    var self = this;

    self.id = ko.observable(userID);
    self.name = ko.observable(name);

};