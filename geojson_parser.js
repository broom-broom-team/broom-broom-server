const fs = require("fs");
const wkt = require("terraformer-wkt-parser");

const createCsvWriter = require("csv-writer").createArrayCsvWriter;

const csvWriter = createCsvWriter({
  header: ["id", "ADMNM", "ADMCD", "type", "coordinates"],
  path: "wpqkf.csv",
});

const records = [];

fs.readFile("ex.geojson", "utf8", (err, data) => {
  let obj = JSON.parse(data);
  for (let i = 0; i < obj.features.length; i++) {
    records.push(
      new Array(
        obj.features[i].properties.OBJECTID,
        obj.features[i].properties.adm_nm,
        obj.features[i].properties.adm_cd2,
        obj.features[i].geometry.type,
        wkt.convert(obj.features[i].geometry)
      )
    );
  }
  csvWriter.writeRecords(records).then(() => {
    console.log("end");
  });
});
