import User from '../../../model/'

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

        const existingRoom = await room.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: "Room number already exists",
            });
        }

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
