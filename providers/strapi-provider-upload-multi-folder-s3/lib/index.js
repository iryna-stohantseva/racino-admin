"use strict";

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const AWS = require("aws-sdk");
var probe = require("probe-image-size");

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: "2006-03-01",
      ...config,
    });
    const customPath = process.env.AWS_ASSETS_FOLDER || "assets";
console.log(customPath);
    const getFolderPath = (file) => {
      const fileName = file.name;
      const fileMime = file.mime;
      const type = fileMime.split(".")[0];
      const images = [
        "image/x-icon",
        "image/png",
        "image/tiff",
        "image/webp",
        "image/apng",
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/bmp",
        "image/svg+xml",
      ];
      const videos = [
        "application/vnd.apple.mpegurl",
        "application/x-mpegurl",
        "video/3gpp",
        "video/mp4",
        "video/mpeg",
        "video/ogg",
        "video/quicktime",
        "video/webm",
        "video/x-m4v",
        "video/ms-asf",
        "video/x-ms-wmv",
        "video/x-msvideo",
      ];
      if (fileName.split("_")[0] === "thumbnail") {
        return "images";
      }
      if (type === "image" || images.indexOf(fileMime) !== -1) {
        const logoMaxWidth = process.env.AWS_LOGO_MAX_WIDTH || 300;
        const logoMaxHeight = process.env.AWS_LOGO_MAX_HEIGHT || 300;
        let width = file.width;
        let height = file.height;

        if (file.ext == ".svg" || !width || !height) {
          try {
            const img = probe.sync(file.buffer);
            width = img.width;
            height = img.height;
          } catch (err) {
            if (file.ext == ".svg") {
              return "icons";
            }
            return false;
          }
        }
        if (width <= logoMaxWidth && height <= logoMaxHeight) {
          return "icons";
        }
        return "images";
      }
      if (type === "video" || videos.indexOf(fileMime) !== -1) {
        return "videos";
      }
      return false;
    };

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const folderPath = getFolderPath(file);
          if (!folderPath) {
            return reject("File type Not Allowed");
          }
          const path =
            customPath +
            "/" +
            folderPath +
            "/" +
            (file.path ? `${file.path}/` : "");
          S3.upload(
            {
              Key: `${path}${file.name}`,
              Body: Buffer.from(file.buffer, "binary"),
              ACL: "public-read",
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                console.error(err);
                return reject(err);
              }

              // set the bucket file url
              file.url = data.Location;

              resolve();
            }
          );
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const folderPath = getFolderPath(file);
          const path =
            customPath +
            "/" +
            folderPath +
            "/" +
            (file.path ? `${file.path}/` : "");
          S3.deleteObject(
            {
              Key: `${path}${file.name}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                console.error(err);
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
