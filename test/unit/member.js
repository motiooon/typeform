var chai              = require("chai");
var assert            = chai.assert;
var Organisation      = require("../../models/organisation.js");
var Member            = require("../../models/member.js");
var Org               = new Organisation({name:"Mafia"});
var util              = require("util");

var mem, mem2, mem3;

describe("Member", function(){

	describe("create new", function(){
		it("should be able to create new instance of Member", function(){
			mem = new Member({
				name : "Gabriel Baciu",
				years_in_organisation : 5,
				type: "boss",
				organisation : Org
			});
			assert.equal(mem instanceof Member, true);
			assert.typeOf(mem, "object");
		});
	});

	describe("get name", function(){
		it("should return name", function(){
			assert.equal(mem.get("name"), "Gabriel Baciu");
		});
	});

	describe("retire", function(){
		it("should be able to retire", function(){

			mem2 = new Member({
				name : "Tonny Baciu",
				years_in_organisation : 3,
				type: "boss",
				organisation : Org
			});

		  mem3 = new Member({
				name : "Jonny Baciu",
				years_in_organisation : 3,
				type: "boss",
				organisation : Org,
				reports_to: mem
			});

			Org.addMember([mem,mem2,mem3]);

			mem.retire("jword", mem2);
			assert.equal(Object.keys(mem.subordinates).length, 0);
			assert.equal(Object.keys(mem.lost_subordinates).length, 1);
			assert.equal(mem.was_replaced_by, mem2);
			assert.equal(mem.status, "jword");

		});
	});

	describe("comeBack", function(){
		it("should be able to comeBack from retirement", function(){
			mem.comeBack();
			assert.equal(Object.keys(mem.subordinates).length, 1);
			assert.equal(Object.keys(mem.lost_subordinates).length, 0);
			assert.equal(mem.was_replaced_by, null);
			assert.equal(mem.status, "active");
		});
	});


});