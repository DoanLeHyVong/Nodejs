const express = require("express");
const homeController = require("../controllers/homeController");
const userController = require("../controllers/userController");
const patientController = require("../controllers/patientController");
const doctorController = require("../controllers/doctorController");
const specialtyController = require("../controllers/specialtyController");
const clinicController = require("../controllers/clinicController");
const router = express.Router();
const multer = require("multer");
const upload = multer();

let initWebRoutes = (app) => {
  router.use(upload.array());

  // for x-www-form-urlencoded
  router.use(express.urlencoded({ extended: true }));

  // for raw JSON
  router.use(express.json());

  // GET routes
  router.get("/api/get-all-users", userController.handleGetAllUsers);

  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);

  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );

  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );

  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );
  router.get("/api/get-all-clinic", clinicController.getAllClinic);

  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );
  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );

  // POST routes
  router.post("/api/login", userController.handleLogin);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.post("/api/save-infor-doctor", doctorController.postInforDoctor);
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment
  );
  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.post("/api/send-prescription", doctorController.sendPrescription);

  return app.use("/", router);
};
module.exports = initWebRoutes;
