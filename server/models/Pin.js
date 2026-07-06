import mongoose from "mongoose";


const pinSchema = new mongoose.Schema({
    pin: {
        type: String,
        unique: true,
    },
    fileUrl: {
        type: String
    },
    cloudinaryPublicId: {
        type: String
    }
}, { timestamps: true }

)


const PinModel = mongoose.models.pin || mongoose.model("Pin", pinSchema);

export default PinModel;