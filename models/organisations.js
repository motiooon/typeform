function Organisation(options) {
	this.name = options.name || "mafia";
	this.members = {};
	this.hierarchy = {};
	this.retired = [];   //one way or the other
}

Organisation.prototype.getName = function() {
	return this.name;
};

Organisation.prototype.addMember = function(member) {

	this.members[member.id] = member;
	var parent = this.getMember(member.reports_to);
	parent.subordinates[member.id] = member;
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

Organisation.prototype.getMember = function(id){

	var looked_up_value;

	var crawler = function(tree){
	  if(tree[id]){
		  looked_up_value = tree[id];
	  }else if(Object.keys(tree[id].subordinates).length > 0){
		  for(var member in tree[id].subordinates){
		    if(tree[id].subordinates[member].id === id){
			    looked_up_value = tree[id].subordinates[member];
		    }else{
			    crawler(tree[id].subordinates[member]);
		    }
		  }
	  }
	};

	crawler(this.hierarchy);

	return looked_up_value;

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


