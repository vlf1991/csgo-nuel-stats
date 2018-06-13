var storage = require('azure-storage');
var blobService = storage.createBlobService();
var prefix = '2018 Spring Week 1/csgo-server-1/';
blobService.listContainersSegmentedWithPrefix(
    prefix,
    null,
    function(err, result) {
        if (err) {
            console.log("Couldn't list containers");
            console.error(err);
        } else {
            console.log("Found containers with prefix %s", prefix);
            console.log(result.entries);
        }
    });
