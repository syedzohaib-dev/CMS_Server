import Appointment from "../../model/patient/Appointment.js";
import addDoctor from "../../model/admin/addDoctor.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);


const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let current = dayjs(startTime, ["h:mm A", "h A"]); // accept "3 PM" or "3:00 PM"
    const end = dayjs(endTime, ["h:mm A", "h A"]);

    if (!current.isValid() || !end.isValid()) {
        console.log("Invalid time format:", startTime, endTime);
        return [];
    }

    while (current.isBefore(end)) {
        const next = current.add(15, "minute");
        slots.push(`${current.format("h:mm A")} - ${next.format("h:mm A")}`);
        current = next;
    }

    return slots;
};




export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) {
            return res.status(400).json({ message: "Doctor ID and date are required" });
        }

        const doctor = await addDoctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const selectedDay = new Date(date).toLocaleString("en-US", { weekday: "long" });
        if (!doctor.availableDays.includes(selectedDay)) {
            return res.status(400).json({
                message: `Doctor not available on ${selectedDay}`,
            });
        }

        // ✅ Fix time format before generating slots
        const formatTime = (t) =>
            t.includes(":") ? t : t.replace("AM", ":00 AM").replace("PM", ":00 PM");

        const allSlots = generateTimeSlots(
            formatTime(doctor.startTime),
            formatTime(doctor.endTime)
        );
        console.log("Doctor start:", doctor.startTime, "end:", doctor.endTime);
        console.log("Parsed start:", dayjs(doctor.startTime, "h:mm A").format(), "Parsed end:", dayjs(doctor.endTime, "h:mm A").format());


        const bookedAppointments = await Appointment.find({ doctorId, date });
        const bookedSlots = bookedAppointments.map((a) => a.time);

        const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

        console.log("All slots:", allSlots);
        console.log("Booked slots:", bookedSlots);
        console.log("Available slots:", availableSlots);

        res.status(200).json({
            success: true,
            doctor: doctor.name,
            date,
            slots: availableSlots,
        });
    } catch (error) {
        console.error("Get Available Slots Error:", error);
        res.status(500).json({ message: "Server error fetching available slots" });
    }
};



export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        const doctor = await addDoctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // ✅ yahan likhni hai ye line 👇
        const formattedDate = new Date(date).toISOString().split("T")[0]; // e.g. "2025-11-09"

        // Verify day
        const selectedDay = new Date(date).toLocaleString("en-US", { weekday: "long" });
        if (!doctor.availableDays.includes(selectedDay)) {
            return res.status(400).json({
                message: `Doctor not available on ${selectedDay}`,
            });
        }

        // Verify time slot availability
        const existingAppointment = await Appointment.findOne({ doctorId, date: formattedDate, time });
        if (existingAppointment) {
            return res.status(400).json({
                message: "This time slot is already booked.",
            });
        }

        // Book new appointment
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            doctorName: doctor.name,
            date: formattedDate,
            time,
            status: "Pending",
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully!",
            appointment,
        });
    } catch (error) {
        console.error("Book Appointment Error:", error);
        res.status(500).json({ message: "Server error while booking appointment" });
    }
};


export const getMyAppointments = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const appointments = await Appointment.find({ patientId: decoded.id })
            .populate("doctorId", "name specialization startTime endTime")
            .sort({ date: 1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Get Appointments Error:", error);
        res.status(500).json({ message: "Server error fetching appointments" });
    }
};
