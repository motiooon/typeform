var chai              = require("chai");
var assert            = chai.assert;
var Organisation      = require("../../models/organisation.js");
var Member            = require("../../models/member.js");
var Feds              = require("../../models/fbi.js");
var Org               = new Organisation({name:"Mafia"});
var util              = require("util");
var FBI;

//Build Organisation

var mem = new Member({
	name : "Gabriel Baciu",
	years_in_organisation : 5,
	type: "boss",
	organisation : Org
});

var mem2 = new Member({
	name : "Johnny Baciu",
	years_in_organisation : 4,
	type: "boss",
	organisation : Org,
	reports_to: mem
});

var mem3 = new Member({
	name : "Tonny Baciu",
	years_in_organisation : 3,
	type: "boss",
	organisation : Org,
	reports_to: mem
});

var mem4 = new Member({
	name : "Tonny Baciu",
	years_in_organisation : 2,
	type: "boss",
	organisation : Org,
	reports_to: mem
});


describe("FBI", function(){

	describe("create FBI", function(){
		it("should be able to create FBI", function(){
			FBI = new Feds();
			assert.equal(FBI instanceof Feds, true);
			assert.typeOf(FBI, "object");
		});
	});

	describe("add to special surveillance", function(){
		it("should be able to add to special surveillance", function(){
			Org.on("dangerous_boss", function(boss){
				if(!FBI.special_surveillance[boss.id]){
					FBI.special_surveillance[boss.id] = boss;
					assert.equal(Object.keys(FBI.special_surveillance).length, 1);
				}
			});
		});
	});

	describe("build universe and emit events", function(){
		it("should be able to map organisation and emit dangerous_boss events", function(){

			Org.addMember([mem,mem2,mem3,mem4]);
			var alphabet = ["a","b","c","d","e","f","g",
											"h","i","j","k","l","m","n",
											"o","p","q","r","s","t","u",
											"v","w","x","y","z"];

			// Create 30 members to report to Johnny

			var len = 30;
			while(len>0){

				Org.addMember(new Member({
					name : alphabet[Math.floor((Math.random()*(alphabet.length-1))+1)].toUpperCase() + "enny Baciu",
					years_in_organisation : Math.floor((Math.random()*10)+1),
					type: "regular",
					organisation : Org,
					reports_to: mem2
				}));

				len--;
			}

			// Create 60 members to report to Lenny

			var len2 = 60;
			while(len2>0){

				Org.addMember(new Member({
					name : alphabet[Math.floor((Math.random()*(alphabet.length-1))+1)].toUpperCase() + "enny Baciu",
					years_in_organisation : Math.floor((Math.random()*10)+1),
					type: "regular",
					organisation : Org,
					reports_to: mem3
				}));

				len2--;
			}

			assert.equal(Object.keys(Org.members).length, 94);

		});
	});


	describe("remove from special surveillance", function(){
		it("should be able to remove from special surveillance", function(){
			FBI.removeFromSpecialSurveillance(mem3);
			assert.equal(Object.keys(FBI.special_surveillance).length, 0);
		});
	});

	describe("add to jail", function(){
		it("should be able to add to jail", function(){
			FBI.addToJail(mem3);
			assert.equal(Object.keys(FBI.jail).length, 1);
		});
	});

	describe("remove from jail", function(){
		it("should be able to remove from jail", function(){
			FBI.removeFromJail(mem3);
			assert.equal(Object.keys(FBI.jail).length, 0);
		});
	});

	describe("add to murders", function(){
		it("should be able to add to murders", function(){
			FBI.addToMurders(mem3);
			assert.equal(Object.keys(FBI.murders).length, 1);
		});
	});

});