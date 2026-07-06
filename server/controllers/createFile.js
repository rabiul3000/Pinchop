import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import PinModel from '../models/Pin.js';

const createFile = async (req, res) => {

    const { file } = req;
    if (!file) return res.status(400).json({ message: "No files uploaded" });


    try {

        const createdPins = [];

        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Upload to Cloudinary (Changed 'raw' to 'auto' so images/PDFs render correctly)
        const cloudinaryResult = await cloudinary.uploader.upload(fileBase64, {
            resource_type: 'auto',
            folder: 'temporary_prints'
        });

        // Generate unique 6-digit PIN
        let pin;
        let isUnique = false;
        while (!isUnique) {
            pin = crypto.randomInt(100000, 999999).toString();
            const existingPin = await PinModel.findOne({ pin });
            if (!existingPin) isUnique = true;
        }

        // Save record to MongoDB
        const newRecord = new PinModel({
            pin,
            fileUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
        });
        await newRecord.save();

        // Track successfully created pins to return to client
        createdPins.push({ pin, fileUrl: cloudinaryResult.secure_url });

        // 20-minute backend cleanup fallback using dynamic resource_type
        setTimeout(async () => {
            try {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id, {
                    resource_type: cloudinaryResult.resource_type
                });
                console.log(`Cloudinary file ${cloudinaryResult.public_id} self-destructed.`);
            } catch (err) {
                console.error("Cloudinary self-destruct failed:", err);
            }
        }, 20 * 60 * 1000);

        // 3. Return the array of generated pins back to the frontend
        return res.status(200).json({ success: true, pins: createdPins });

    } catch (error) {
        console.error("Error in createFile controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default createFile;
