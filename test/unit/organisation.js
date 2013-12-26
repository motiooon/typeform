var chai              = require("chai");
var assert            = chai.assert;
var Organisation      = require("../../models/organisation.js");
var Member            = require("../../models/member.js");
var Org               = new Organisation({name:"Mafia"});
var util              = require("util");

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


describe("Organisation", function(){

	describe("get name", function(){
		it("should return name", function(){
			assert.equal(Org.get("name"), "Mafia");
		});
	});

	describe("addMember", function(){
		it("should be able to add a member", function(){
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

	describe("getMember", function(){
		it("should be able to get a member", function(){
			var mem = Org.members[Object.keys(Org.members)[20]];
			var _mem2 = Org.getMember(mem.id);
			assert.equal(_mem2,mem);
		});
	});

	describe("findMembersWithSameRank", function(){
		it("should be able to find a member with the same rank", function(){
			var __mem = Org.findMembersWithSameRank(mem3);
			assert.equal(__mem[0],mem2);
		});
	});

	describe("findEligibileReplacement", function(){
		it("should be able to find boss replacement", function(){
			var __mem = Org.findEligibileReplacement(mem3);
			assert.equal(__mem,mem2);
		});
	});

	describe("promoteToBoss", function(){
		it("should be able to promote a member to boss", function(){
			var __mem = Org.findEligibileReplacement(mem3);
			Org.promoteToBoss(__mem);
			assert.equal(__mem.type,"boss");
		});
	});

	describe("retireMember", function(){
		it("should be able to retire a member and replace with sibling", function(){

			var _subordinates = mem3.subordinates;

			Org.retireMember(mem3.id, "jail");
			assert.equal(mem3.status,"jail");
			assert.equal(Object.keys(Org.members).length,93);
			assert.equal(Object.keys(Org.retired).length,1);

			var __mem = Org.findEligibileReplacement(mem3);
			var __mem_subordinates_length = Object.keys(__mem.subordinates).length;

			Org.promoteToBoss(__mem, mem3.subordinates);
			mem3.retire("jail", __mem);

			assert.equal(Object.keys(mem3.subordinates).length,0);
			assert.equal(Object.keys(mem3.lost_subordinates).length, Object.keys(_subordinates).length);

			assert.equal(Object.keys(__mem.subordinates).length,  __mem_subordinates_length + Object.keys(_subordinates).length);

		});

		it("should be able to retire a member and replace with subordinate");

	});

	describe("reactivateMember", function(){
		it("should be able to reactivate a member from sibling", function(){
			Org.reactivateMember(mem3.id);
			mem3.comeBack();
			assert.equal(Object.keys(Org.members).length,94);
			assert.equal(Object.keys(Org.retired).length,0);
			assert.equal(Object.keys(mem3.subordinates).length,60);
			assert.equal(Object.keys(mem3.lost_subordinates).length,0);
			assert.equal(Object.keys(mem2.subordinates).length, 30);
		});
		it("should be able to reactivate a member from subordinate");

	});

	describe("moreThenFifty", function(){
		it("should be able to return true if member has more then 50 members", function(){
			assert.equal(Org.moreThenFifty(mem3.id), true);
		});
	});



});