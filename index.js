var tmp = require("temporary");
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var rimraf = require("rimraf");

module.exports = buffer => {
  return new Promise(function(resolve, reject) {
    var file = new tmp.File();
    var outdir = new tmp.Dir();
    console.log(file);
    console.log(outdir);
    file.writeFile(buffer, err => {
      if (err) reject(err);

      var cmd =
        "soffice --headless --convert-to pdf " +
        file.path +
        " --outdir " +
        outdir.path;

      exec(cmd, function(error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          fs.readFile(
            path.join(
              outdir.path,
              path.basename(file.path, path.extname(path.basename(file.path))) +
                ".pdf"
            ),
            (err, buffer) => {
              if (err) reject(err);
              rimraf(outdir.path, () => {
                rimraf(file.path, () => {
                  resolve(buffer);
                });
              });
            }
          );
        }
      });
    });
  });
};
