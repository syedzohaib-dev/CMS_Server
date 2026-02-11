import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            default: "patient",
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        age: {
            type: Number,
            required: true
        },
        profileImgURL: {
            type: String,
        },
        doctorProfile: {
            type: {
                specialization: {
                    type: String,
                    required: function () {
                        return this.role === "doctor";
                    },
                },

                degree: {
                    type: String,
                    required: function () {
                        return this.role === "doctor";
                    },
                },

                experience: {
                    type: String,
                    required: function () {
                        return this.role === "doctor";
                    },
                },

                availableDays: {
                    type: [String],
                    required: function () {
                        return this.role === "doctor";
                    },
                },

                startTime: {
                    type: String,
                    required: function () {
                        return this.role === "doctor";
                    },
                },

                endTime: {
                    type: String,
                    required: function () {
                        return this.role === "doctor";
                    },
                },
            },
            default: undefined,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
