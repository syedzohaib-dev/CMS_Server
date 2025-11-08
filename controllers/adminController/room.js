import bcrypt from "bcryptjs";
import room from "../../model/admin/room.js";

export const addRoom = async (req, res) => {
    try {
        const {
            roomNumber,
            roomType,
            status,
            timePerPatient,
            availableFrom,
            availableTo,
        } = req.body;

        // Check if room number already exists
        const existingRoom = await room.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: "Room number already exists",
            });
        }

        // Create new room
        const newRoom = new room({
            roomNumber,
            roomType,
            status,
            timePerPatient,
            availableFrom: availableFrom || "10:00 AM",
            availableTo: availableTo || "8:00 PM",
        });

        await newRoom.save();

        res.status(201).json({
            success: true,
            message: "Room added successfully",
            room: newRoom,
        });
    } catch (error) {
        console.error("Add Room Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding room",
            error: error.message,
        });
    }
};

// Get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await room.find();
        res.status(200).json({ success: true, rooms });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
        });
    }
};