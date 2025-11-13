import bcrypt from "bcryptjs";
import Doctor from "../model/admin/addDoctor.js";
import room from "../model/admin/room.js";

export const getAdminProfile = (req, res) => {
  res.json({ message: "Admin profile fetched successfully" });
};

export const updateAdminProfile = (req, res) => {
  res.json({ message: "Admin profile updated successfully" });
};

export const getAllPatients = (req, res) => {
  res.json({ message: "All patients fetched successfully" });
};

export const getAllAppointments = (req, res) => {
  res.json({ message: "All appointments fetched successfully" });
};





export const deleteAppointment = (req, res) => {
  res.json({ message: "Appointment deleted successfully" });
};
