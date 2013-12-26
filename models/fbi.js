var util = require("util");
var EventEmitter = require("events").EventEmitter;

function Feds(){
	this.special_surveillance = {};
	this.jail = {};
	this.murders = {};
	this.restructurings = {};
}

Feds.prototype.addToSpecialSurveillance = function(boss){
	this.special_surveillance[boss.id] = boss;
};

Feds.prototype.removeFromSpecialSurveillance = function(boss){
	delete this.special_surveillance[boss.id];
};

Feds.prototype.addToJail = function(boss){
	this.jail[boss.id] = boss;
};

Feds.prototype.removeFromJail= function(boss){
	delete this.jail[boss.id];
};


Feds.prototype.addToMurders = function(boss){
	this.murders[boss.id] = boss;
};

Feds.prototype.addToRestructurings = function(boss){
	this.restructurings[boss.id] = boss;
};

module.exports = Feds;





