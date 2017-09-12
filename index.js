/*
 * Entry point for the Projection Engine JSON data file transformer. The goal of this project is
 * to optimize the TXT files we receive from PE for use on a website.
 *
 * We receive TXT files from PE team. These files are tab separated files and the columns are slightly different. This
 * process will read each TXT file, convert it to a JSON representation and save a minified version of it.
 */

const csvtojson = require('csvtojson');
const jsonfile = require('jsonfile');
const rootPath = 'data/';
var fileList = [ // define the list of files to convert, the column order and name to use for that column
    {filename: "gcs_wkt_areas", name:"Geographic Coordinates", columns: ["WKID", "Name", "WKT", "AreaOfUse", "MinimumLatitude", "MinimumLongitude", "MaximumLatitude", "MaximumLongitude"]},
    {filename: "gt_wkt_areas",  name:"Geographic Transforms",  columns: ["WKID", "Name", "WKT", "Accuracy", "AreaOfUse", "MinimumLatitude", "MinimumLongitude", "MaximumLatitude", "MaximumLongitude"]},
    {filename: "vcs_wkt_areas", name:"Vertical Coordinates",   columns: ["WKID", "Name", "WKT", "AreaOfUse", "MinimumLatitude", "MinimumLongitude", "MaximumLatitude", "MaximumLongitude"]},
    {filename: "vt_wkt_areas",  name:"Vertical Transforms",    columns: ["WKID", "Name", "WKT", "Accuracy", "AreaOfUse", "MinimumLatitude", "MinimumLongitude", "MaximumLatitude", "MaximumLongitude"]}
];


var convertFiles = function() {

    fileList.forEach(function(fileParameters) {
        var filePath = rootPath + fileParameters.filename + '.txt';
        var transformedProjectionObject = [];
        var records = 0;
        csvtojson({
            noheader: false,
            trim: true,
            delimiter: ["\t"],
            headers: fileParameters.columns
            })
            .fromFile(filePath)
            .on('json', function (projectionObject) {
                transformedProjectionObject[transformedProjectionObject.length] = {
                    wkid: projectionObject.WKID,
                    name: projectionObject.Name,
                    wkt: projectionObject.WKT,
                    areaofuse: projectionObject.AreaOfUse,
                    extent: [projectionObject.MinimumLatitude, projectionObject.MinimumLongitude, projectionObject.MaximumLatitude, projectionObject.MaximumLongitude],
                    accuracy: (typeof projectionObject.Accuracy !== 'undefined' ? projectionObject.Accuracy : "0")
                };
                records ++;
            })
            .on('done', function (readError) {
                if (typeof readError !== 'undefined' && readError !== null) {
                    console.log("Error reading TXT file " + filePath + ": " + readError.message);
                } else {
                    var writeFilePath = rootPath + fileParameters.filename + '.min.json';
                    jsonfile.writeFile(writeFilePath, transformedProjectionObject, {spaces: 0}, function (writeError) {
                        if (typeof writeError !== 'undefined' && writeError !== null) {
                            console.log("Error writing " + filePath + ": " + writeError.message);
                        }
                    });
                }
                console.log("completed " + filePath + " processed " + records + " records.");
            });
    });
};

exports.process = convertFiles;

exports.fileList = function() {
    return fileList;
};

convertFiles();
