const db = require("../models");

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map(
          (item) =>
            (item.image = new Buffer(item.image, "base64").toString("binary"))
        );
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailSpecialtyById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorSpecialty = [];
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: {
              specialtyId: inputId,
            },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorSpecialty = doctorSpecialty;
        } else {
          data = {};
        }

        resolve({
          errCode: 0,
          errMessage: "Ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { createSpecialty, getAllSpecialty, getDetailSpecialtyById };
