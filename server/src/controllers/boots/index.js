const addBoot = require('./add');
const deleteBoot = require('./delete');
const startBoot = require('./start');
const stopBoot = require('./stop');
const getBoots = require('./get');
const editBoot = require('./edit');

module.exports = {
    addBoot,
    editBoot,
    deleteBoot,
    startBoot,
    stopBoot,
    getBoots
}