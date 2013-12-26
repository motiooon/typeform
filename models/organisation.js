var util = require("util");
var EventEmitter = require("events").EventEmitter;

function Organisation(options) {
	this.name = options.name || "mafia";
	this.members = {};
	this.retired = {};   //one way or the other
}

util.inherits(Organisation, EventEmitter);

Organisation.prototype.get = function(prop) {
	return this[prop];
};

Organisation.prototype.addMember = function(member) {
	var self=this;
	if(Array.isArray(member)){
		member.forEach(function(mem){
			self.members[mem.id] = mem;
			if(mem.reports_to){
				mem.reports_to.subordinates[mem.id] = mem;
				if(self.moreThenFifty(mem.reports_to.id)) {
					self.emit("dangerous_boss", {boss:mem.reports_to});
				}
			}
		});

	}else{
		this.members[member.id] = member;
		if(member.reports_to){
			member.reports_to.subordinates[member.id] = member;
			if(this.moreThenFifty(member.reports_to.id)) {
				this.emit("dangerous_boss", member.reports_to);
			}
		}
	}

};

Organisation.prototype.retireMember = function(id, status){
	this.retired[id] = this.members[id];
	this.members[id].status = status;
	var parent = this.getMember(this.members[id].reports_to.id);
	delete this.members[id];
	delete parent.subordinates[id];
};

Organisation.prototype.reactivateMember = function(id){
	this.members[id] = this.retired[id];
	this.members[id].status = "active";
	var parent = this.getMember(this.members[id].reports_to.id);
	parent.subordinates[id] = this.members[id];

//	console.log(Object.keys(this.members[id].lost_subordinates));

	// give subordinates back -- remove all subordinates from the boss that was replacing this
	for(var s in this.members[id].was_replaced_by.subordinates){
		if(this.members[id].lost_subordinates[s] && this.members[id].was_replaced_by.subordinates[s].id === this.members[id].lost_subordinates[s].id){
			delete this.members[id].was_replaced_by.subordinates[s];
		}
	}

	delete this.retired[id];

};

Organisation.prototype.getMember = function(member_id) {
	return this.members[member_id];
};

Organisation.prototype.getMemberGraph = function(member_id, boss) {

	breadthFirst([boss]);

	function breadthFirst(members) {

		var subordinates = [];
		var match = false;

		for(var j=0; j<members.length; j++){
			var subs_of_members = members[j].subordinates;

			for(var i in subs_of_members) {
				if(subs_of_members[i].id === member_id) {
					match = true;
					return subs_of_members[i];
				}
				if(Object.keys(subs_of_members).length > 0){subordinates.push(members[j]);}
			}
		}

		if (match) {return;}
		else if (subordinates.length > 0) {breadthFirst(subordinates);}
		else {return "No such member";}
	}
};


Organisation.prototype.findMembersWithSameRank = function(member){
	var siblings = member.reports_to.subordinates;
	var siblings_array = [];
	for (var sibling in siblings){
		if(siblings[sibling].id !== member.id && siblings[sibling].status === "active"){
			siblings_array.push(siblings[sibling]);
		}
	}
	return siblings_array;
};

Organisation.prototype.findEligibileReplacement = function(member) {
	var sameRank = this.findMembersWithSameRank(member);
	var oldestMob;
	if (sameRank.length > 1) {
		sameRank.forEach(function (mob) {
			if (!oldestMob) {
				oldestMob = mob;
			} else {
				if (mob.years_in_organisation > oldestMob.years_in_organisation) {
					oldestMob = mob;
				}
			}
		});
	}else{
		return sameRank;
	}

	if (oldestMob) {
		return oldestMob;
	}
	for (var mob in member.subordinates) {
		if (!oldestMob) {
			oldestMob = member.subordinates[mob];
		} else {
			if (member.subordinates[mob].years_in_organisation > oldestMob.years_in_organisation) {
				oldestMob = member.subordinates[mob];
			}
		}
	}
	return oldestMob;
};

Organisation.prototype.promoteToBoss = function(member, subordinates){
	member.type = "boss";
	if(subordinates){
		for(var s in subordinates){
			member.subordinates[subordinates[s].id] = subordinates[s];
		}
	}
};

Organisation.prototype.moreThenFifty = function(member_id) {
	return Object.keys(this.members[member_id].subordinates).length > 50 ? true : false;
};


module.exports = Organisation;

//it should be a mediator and Organisation and members should reorganize based on 3
// events reorganizations, mword and jword


