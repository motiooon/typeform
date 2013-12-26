function Organisation(options) {
	this.name = options.name || "mafia";
	this.members = {};
	this.hierarchy = {};
	this.retired = [];   //one way or the other
}

Organisation.prototype.get = function(prop) {
	return this[prop];
};

Organisation.prototype.addMember = function(member, big_boss) {

	this.members[member.id] = member;

	if(member.reports_to){
		var parent = this.getMember(member.reports_to.id, big_boss);

		// TODO this is bogus, getMember has to retain the full path, then access it thn alter it
		// otherwise it's almost impossible to have the hierarchy in an object
		// maybe array could do

		parent.subordinates[member.id] = member;
	}else{
		this.hierarchy[member.id] = member;
	}
};

Organisation.prototype.retireMember = function(id, status){
	this.retired[id] = this.members[id];
	this.members[id].status = status;
	delete this.members[id];
	var parent = this.getMember(this.members[id].reports_to);
	delete parent.subordinates[id];
};

Organisation.prototype.activateMember = function(id){
	this.members[id] = this.retired[id];
	this.members[id].status = "active";
	delete this.retired[id];
	var parent = this.getMember(this.members[id].reports_to);
	parent.subordinates[id] = this.members[id];
};

Organisation.prototype.promoteToBoss = function(member, subordinates){
	member.type = "boss";
	member.subordinates = subordinates;
};

Organisation.prototype.getMember = function(member_id, boss) {

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
		if(siblings[sibling].id !== member.id && siblings[sibling].state === "active"){
			siblings_array.push(siblings[sibling]);
		}
	}
	return siblings_array;
};

Organisation.prototype.findEligibileReplacement = function(member){
  var sameRank = this.findMembersWithSameRank(member);
	var oldestMob;
	if(sameRank.length>0){
		sameRank.forEach(function(mob){
			if (!oldestMob) {
				oldestMob = mob;
			} else {
				if (mob.years_in_organisation > oldestMob.years_in_organisation) {
					oldestMob = mob;
				}
			}
		});
	}

	if(oldestMob){
		return oldestMob;
	}else{
	  for(var mob in member.subordinates){
		  if (!oldestMob) {
			  oldestMob = member.subordinates[mob];
		  } else {
			  if (member.subordinates[mob].years_in_organisation > oldestMob.years_in_organisation) {
				  oldestMob = member.subordinates[mob];
			  }
		  }
	  }
		return oldestMob;
	}
};

module.exports = Organisation;

//it should be a mediator and Organisation and members should reorganize based on 3
// events reorganizations, mword and jword


