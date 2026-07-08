import PinModel from '../models/Pin.js';
import { v2 as cloudinary } from 'cloudinary';

const deleteFileByPin = async (req, res) => {
    const { pin } = req.params;
    try {
        const record = await PinModel.findOne({ pin });
        if (!record) return res.status(404).json({ message: "File not found or already deleted." });

        // Delete from Cloudinary
        if (record.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(record.cloudinaryPublicId);
        }

        // Delete from MongoDB
        await PinModel.deleteOne({ pin });

        return res.status(200).json({ success: true, message: "File permanently destroyed." });
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default deleteFileByPin;