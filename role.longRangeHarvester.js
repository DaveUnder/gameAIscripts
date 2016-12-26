/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.longRangeHarvester');
 * mod.thing == 'a thing'; // true
 */

var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {

        if (!creep.spawning) {

            if (creep.ticksToLive < 200) {
                creep.memory.working = true;
            }
            else if (creep.memory.working == true && creep.carry.energy == 0) {
                if (creep.ticksToLive < 200) {
                    console.log("DEATH of: " + creep + "; TOTAL WORK: " + creep.memory.workDone + "; longRangeHarvester ; TTL: " + creep.ticksToLive);
                    creep.suicide();
                }
                else {
                    creep.memory.working = false;
                }
            }
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
            }


            if (creep.memory.working == true) {
                if (creep.room.name == creep.memory.homeRoom) {

                    // var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    //     filter: (s) => ( s.structureType == STRUCTURE_SPAWN
                    //     || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER)
                    //     && s.energy < s.energyCapacity
                    // });

                    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                        && s.pos.x < 25
                        && s.store[RESOURCE_ENERGY] < s.storeCapacity
                    });

                    if (structure != undefined) {
                        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(structure);
                        }
                        else {
                            if (creep.memory.workDone == undefined) {
                                creep.memory.workDone = 0;
                            }
                            creep.memory.workDone += creep.carry.energy;
                            // console.log(creep + " WorkDone: " + creep.memory.workDone);
                        }
                    }
                    else {
                        roleTransporter.run(creep);
                    }
                }
                else {
                    //console.log("DEBUG: im in: " + creep.room.name + " and want to go to" + creep.memory.homeRoom);
                    //  console.log("DEBUG: move to HOME room");
                    var exit = creep.room.findExitTo(creep.memory.homeRoom);
                    //   console.log("exit= " + exit);
                    creep.moveTo(creep.pos.findClosestByPath(exit));
                }
            }
            else {
                //console.log("DEBUG:"+ creep + " ; creep.room.name=" + creep.room.name + " ; creep.memory.target="+ creep.memory.targetRoom);
                if (creep.room.name == creep.memory.targetRoom) {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    //console.log("DEBUG: spurce " + source);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
                else {
                    //console.log("DEBUG: im in: " + creep.room.name + " and want to go to " + creep.memory.targetRoom);
                    // console.log("DEBUG: move to target room");
                    var exit = creep.room.findExitTo(creep.memory.targetRoom);
                    //  console.log("exit= " + exit);
                    creep.moveTo(creep.pos.findClosestByPath(exit));
                }
            }


        }
    }
};