/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep){
        //console.log(creep.name + " : in upgrader script, working: " + creep.memory.working);
        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " : set working to false");
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
           // console.log(creep.name + " : set working to true");
            creep.memory.workSource = undefined;
            creep.memory.working = true;
        }
        else if (creep.ticksToLive < creep.carry.energyCapacity / (creep.body.length/3)) {
            creep.memory.working = true;
        }

        // upgrader creep delivering energy to room controller
        if (creep.memory.working == true) {
          // console.log("upgrader should start going to controller");
           // var controller = creep.room.controller;
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        // upgrader creep collection energy from storage or container
        else {
            if(creep.memory.workSource == undefined) {
                console.log("DEBUG: " + creep + " has no workSource" );

                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 200)
                });
                console.log ("Debug: found container: " + structure );

                if(structure == undefined) {
                    console.log("Debug: looking for Storage");
                    creep.pos.fin
                    structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 5000
                    });
                }

                if (structure != undefined) {
                    console.log("DEBUG: set creep workSource to: " + structure.id);
                    creep.memory.workSource = structure.id;
                }
            }
            else {
                var structure = Game.getObjectById(creep.memory.workSource);

                if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        }
    }
};