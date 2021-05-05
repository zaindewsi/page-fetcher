const request = require("request");
const fs = require("fs");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = process.argv.slice(2);

if (args.length > 2) {
  console.log("Please provide a URL and local file path");
  return;
}

const url = args[0];
const path = args[1];

const fetcher = function (url, path) {
  request(url, (error, response, body) => {
    if (error) {
      throw error;
    }
    fs.writeFile(path, body, { flag: "wx" }, (err) => {
      if (err && err.code === "EEXIST") {
        rl.question("Overwrite existing file? (y/n) ", (answer) => {
          if (answer === "yes" || answer === "y") {
            fs.writeFile(path, body, () => {
              const size = response.headers["content-length"];
              console.log(`Downloaded and saved ${size} bytes to ${path}`);
            });
          } else {
            console.log("File overwrite denied");
          }
          rl.close();
        });
      } else {
        fs.writeFile(path, body, () => {
          const size = response.headers["content-length"];
          console.log("Writing new file...");
          console.log(`Downloaded and saved ${size} bytes to ${path}`);
        });
        rl.close();
      }
    });
  });
};

fetcher(url, path);
