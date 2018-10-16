var tmp = require("temporary");
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

module.exports = buffer => {
  return new Promise(function(resolve, reject) {
    var file = new tmp.File();
    var outdir = new tmp.Dir();
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
              file.unlink();
              outdir.rmdir();
              if (err) reject(err);
              resolve(buffer);
            }
          );
        }
      });
    });
  });
};