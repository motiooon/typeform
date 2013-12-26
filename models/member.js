var helpers = require("../helpers");
var util = require("util");
var EventEmitter = require("events").EventEmitter;

function Member(options) {
	//some properties should be validated in a real case scenario
	// like the existence of an organisation and a name, etc
	this.id = helpers.generateId();
	this.name = options.name || "John Doe";
	this.years_in_organisation = options.years_in_organisation;
	this.type = options.type || ""; // boss, regular
	this.subordinates = {};
	this.lost_subordinates = {};
	this.status = "active"; // enum "active, jword, mword,"
	this.organisation = options.organisation;
	this.reports_to = options.reports_to || null;
	this.was_replaced_by = null;
	if(this.reports_to){
		this.level = this.reports_to.level + 1;
	}else{
		this.level = 0;
	}
}

util.inherits(Member, EventEmitter);

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

Member.prototype.retire = function(reason, newBoss){ //retire can be either reorganisation, jword or mword
	this.lost_subordinates =  this.subordinates;
	this.subordinates = {};
	this.was_replaced_by = newBoss;
	this.status = reason;
};

Member.prototype.comeBack = function(){ //retire can be either reorganisation, jword or mword
	this.subordinates =  this.lost_subordinates;
	this.lost_subordinates = {};
	this.status = "active";
	this.was_replaced_by = null;
};

module.exports = Member;