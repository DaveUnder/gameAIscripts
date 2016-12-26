require('prototype.spawn')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallBuilder = require('role.wallbuilder');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');
var roleLongRangeHarvester = require('role.longRangeHarvester');

var HOME = 'E79S74';

module.exports.loop = function(){

   var lastCPU = Game.cpu.getUsed();
   var cpuFunctionStart = lastCPU;


    // clear memory
    for(let name in Memory.creeps){
        if(Game.creeps[name] == undefined){
            delete Memory.creeps[name];
        }
    }

    var cpuCleanMemory = Game.cpu.getUsed()- lastCPU;
    lastCPU = Game.cpu.getUsed();

    for(let name in Game.creeps) {

        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester'){
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader'){
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder'){
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer'){
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'wallbuilder'){
            roleWallBuilder.run(creep);
        }
        else if (creep.memory.role == 'miner'){
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'transporter'){
            roleTransporter.run(creep);
        }
        else if (creep.memory.role == 'longRangeHarvester'){
            roleLongRangeHarvester.run(creep);
        }

    }

    var cpuCreepUpdate = Game.cpu.getUsed()- lastCPU;
    lastCPU = Game.cpu.getUsed();

/*
    var towers = Game.rooms.E79S74.find(FIND_STRUCTURES,{
        filter: (s) => s.structureType = STRUCTURE_TOWER
    });
*/
    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);

    for (let tower of towers){
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
/*
        console.log("Tower: " + tower);
        console.log(JSON.stringify(tower));
        console.log("Target: " + target);
        console.log(JSON.stringify(target));
*/
        if(target != undefined){
            tower.attack(target);
        }
        else {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits / s.hitsMax < 0.8
                && s.structureType != STRUCTURE_WALL
                && s.structureType != STRUCTURE_RAMPART
            });
            if (closestDamagedStructure != undefined) {
                //console.log("Tower repairing: " + closestDamagedStructure.structureType + " with Hits " + closestDamagedStructure.hits/closestDamagedStructure.hitsMax );
                tower.repair(closestDamagedStructure);
            }
        }
    }

    var cpuTowers = Game.cpu.getUsed()- lastCPU;
    lastCPU = Game.cpu.getUsed();

    var minimumNumberOfHarvesterCreeps = 2;
    var minimumNumberOfMiners = 2;
    var minimumNumberOfUpgraderCreeps = 3;
    var minimumNumberOfBuilderCreeps = 1;
    var minimumNumberOfRepairerCreeps = 1;
    var minimumNumberOfWallBuilders = 0;
    var minimumNumberOfTransporters = 4;
    var minimumNumberOfLongRangeHarvesters = 0;
    var minimumNumberOfLongRangeHarvestersE79S73 = 0;
    var minimumNumberOfLongRangeHarvestersE78S74 = 0;

    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'wallbuilder');
    var numberOfTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
    var numberOfLongRangeHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longRangeHarvester');
    var numberOfLongRangeHarvestersE79S73 = _.sum(Game.creeps, (c) =>( c.memory.role == 'longRangeHarvester' && c.memory.targetRoom =='E79S73'));
    var numberOfLongRangeHarvestersE78S74 = _.sum(Game.creeps, (c) => ( c.memory.role == 'longRangeHarvester'&& c.memory.targetRoom =='E78S74'));

    var name = undefined;
    var energy = Game.spawns.Baas1.room.energyCapacityAvailable;

 //  console.log("EnergyCapacityAvailable: " + energy );
 //  console.log("EnergyAvailable: " + Game.spawns.Baas1.room.energyAvailable );

    if ( numberOfMiners < minimumNumberOfMiners){
        name = Game.spawns.Baas1.createWorkerCreep(energy, 'miner', undefined);

        if ( name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0 && numberOfMiners == 0){
            name = Game.spawns.Baas1.createCustomCreep(Game.spawns.Baas1.room.energyCapacityAvailable, 'harvester', undefined);
        }
    }
    else if ( (numberOfRepairers + towers.length) < minimumNumberOfRepairerCreeps){
        name = Game.spawns.Baas1.createWorkerFastCreep(energy, 'repairer', undefined);
    }
    else if ( numberOfBuilders < minimumNumberOfBuilderCreeps){
        name = Game.spawns.Baas1.createCustomCreep(energy, 'builder', undefined);
    }
    else if ( numberOfWallBuilders < minimumNumberOfWallBuilders){
        name = Game.spawns.Baas1.createCustomCreep(energy, 'wallbuilder', undefined);
    }
    else if ( numberOfTransporters < minimumNumberOfTransporters){
        name = Game.spawns.Baas1.createCustomCreep(energy, 'transporter', undefined);
    }
    else if ( numberOfUpgraders < minimumNumberOfUpgraderCreeps){
        name = Game.spawns.Baas1.createUpgraderCreep(energy, 'upgrader', undefined, undefined);
    }
    else if ( numberOfLongRangeHarvesters < minimumNumberOfLongRangeHarvesters){
        name = Game.spawns.Baas1.createLongDistanceHarvesterCreep(energy, 'longRangeHarvester', HOME, 'E79S73',1);
    }
    else if ( numberOfLongRangeHarvestersE79S73 < minimumNumberOfLongRangeHarvestersE79S73){
        name = Game.spawns.Baas1.createLongDistanceHarvesterCreep(energy, 'longRangeHarvester', HOME, 'E79S73',1);
    }
    else if ( numberOfLongRangeHarvestersE78S74 < minimumNumberOfLongRangeHarvestersE78S74){
        name = Game.spawns.Baas1.createLongDistanceHarvesterCreep(energy, 'longRangeHarvester', HOME, 'E78S74',1);
    }

    if (!(name < 0 || name == undefined)) {
        console.log("Spawning new creep: " + name  );
    }

    var cpuCreepSpawning = Game.cpu.getUsed()- lastCPU;

    var cpuTotal = Game.cpu.getUsed();


    // console.log("Begin:" + cpuFunctionStart);
    // console.log("Memor:" + cpuCleanMemory);
    // console.log("cUpda:" + cpuCreepUpdate);
    // console.log("Tower:" + cpuTowers);
    // console.log("cSpaW:" + cpuCreepSpawning);
    // console.log("TOTAL:" + cpuTotal);
    //console.log("BUCKET:" + Game.cpu.bucket);
    // console.log(" ");
};