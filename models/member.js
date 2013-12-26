var helpers = require("../helpers");

function Member(options) {
	//some properties should be validated in a real case scenario
	// like the existence of an organisation and a name, etc
	this.id = helpers.generateId();
	this.name = options.name || "John Doe";
	this.years_in_organisation = options.years_in_organisation;
	this.type = options.type || ""; // boss, regular
	this.subordinates = {};
	this.lost_subordinates = {};
	this.state = "active"; // enum "active, jword, mword,"
	this.organisation = options.organisation;
	this.reports_to = options.reports_to || null;
}

Member.prototype.get = function(prop) {
	return this[prop];
};

Member.prototype.addSubordinates = function(subordinates) {

	if(Array.isArray(subordinates)){
		subordinates.forEach(function(subordinate){
			this.subordinates[subordinate.id] = subordinate;
		});

	}else{
		this.subordinates[subordinates.id] = subordinates;
	}
};

Member.prototype.getSubordinates = function(){
	return Object.keys(this.subordinates).length;
};

Member.prototype.retire = function(){ //retire can be either reorganisation, jword or mword
	this.lost_subordinates =  this.subordinates;
	this.subordinates = {};
};

Member.prototype.comeBack = function(){ //retire can be either reorganisation, jword or mword
	this.subordinates =  this.lost_subordinates;
	this.lost_subordinates = {};
};

module.exports = Member;