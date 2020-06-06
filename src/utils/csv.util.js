function readFile(file) {
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result.trim());
    };
  });
}

function getHeaderRow(csvData) {
  let rows = csvData.split("\n");
  return rows[0].trim().split(";");
}

function parseCsvData(csvData) {
  let rows = csvData.split("\n");
  let keys = rows[0].trim().split(";");
  let result = [];
  for (let i = 1; i < rows.length; i++){
    let row = rows[i].trim().split(";");
    let obj = {};
    keys.forEach((key, index) => {
      obj[key] = row[index];
    });
    result.push(obj);
  }
  return result;
}

const CsvUtils = {
  readFile: readFile,
  parseCsvData: parseCsvData,
  getHeaderRow: getHeaderRow,
};
export default CsvUtils;
