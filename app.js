const fs = require('fs');
const csv = require('csv-parser');

// Define input file
const inputFile = 'file-path-here';
// Define output folder
const outputDir = 'output_files';
// Rows per file
const rowsPerFile = 5;

const splitCsv = (inputFile, outputDir, rowsPerFile) => {
  // Check to see if the output folder already exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  let fileNumber = 1;
  let rowCount = 0;
  let isFirstFile = true;
  let outputCsv = null;

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      if (rowCount === 0) {
        const outputFile = `${outputDir}/output_${fileNumber}.csv`;
        outputCsv = fs.createWriteStream(outputFile, { flags: 'a' });
        if (isFirstFile) {
          outputCsv.write(Object.keys(row).join(',') + '\n');
          isFirstFile = false;
        }
      }

      outputCsv.write(Object.values(row).join(',') + '\n');
      rowCount++;

      if (rowCount === rowsPerFile) {
        rowCount = 0;
        fileNumber++;
        outputCsv.end();
      }
    })
    .on('end', () => {
      if (outputCsv) {
        outputCsv.end();
      }
      console.log('CSV splitting complete.');
    });
};



splitCsv(inputFile, outputDir, rowsPerFile);
