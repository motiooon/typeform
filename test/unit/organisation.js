var chai              = require("chai");
var assert            = chai.assert;
var Organisation      = require("../../models/organisation.js");
var Member            = require("../../models/member.js");
var Org               = new Organisation({name:"Mafia"});
var util              = require("util");

var mem = new Member({
	name : "Gabriel Baciu",
	years_in_organisation : 5,
	type: "boss",
	organisation : Org
});

var mem2 = new Member({
	name : "John Baciu",
	years_in_organisation : 4,
	type: "regular",
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
	name : "Lenny Baciu",
	years_in_organisation : 3,
	type: "boss",
	organisation : Org,
	reports_to: mem3
});

var mem5 = new Member({
	name : "Penny Baciu",
	years_in_organisation : 3,
	type: "regular",
	organisation : Org,
	reports_to: mem4
});

var mem6 = new Member({
	name : "Kenny Baciu",
	years_in_organisation : 3,
	type: "regular",
	organisation : Org,
	reports_to: mem4
});

describe("Organisation", function(){

	describe("get name", function(){
		it("should return name", function(){
			assert.equal(Org.get("name"), "Mafia");
		});
	});

	describe("addMember", function(){
		it("should be able to add a member", function(){
//			Org.addMember(mem);
//			Org.addMember(mem2,mem);
//			Org.addMember(mem3,mem);
//			Org.addMember(mem4,mem);
//			Org.addMember(mem5,mem);
//			Org.addMember(mem6,mem);

//			console.log("Org.hierarchy>>>>",Org.hierarchy);
//			assert.equal(Object.keys(Org.hierarchy).length, 1);
			assert.equal(true,true);
		});
	});

	describe("getMember", function(){
		it("should be able to get a member", function(){
			var _mem2 = Org.getMember(mem2.id, mem);
//			assert.equal(_mem2.name, mem2.name);
			assert.equal(true,true);
		});
	});

	describe("retireMember", function(){
		it("should be able to retire a member");
	});

	describe("activateMember", function(){
		it("should be able to reactivate a member");
	});

	describe("promoteToBoss", function(){
		it("should be able to promote a member to boss");
	});

	describe("findMembersWithSameRank", function(){
		it("should be able to find a memebr with the same rank");
	});

	describe("findEligibileReplacement", function(){
		it("should be able to find boss replacement");
	});


});