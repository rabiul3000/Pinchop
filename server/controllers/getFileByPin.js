import PinModel from "../models/Pin.js";

const getFileByPin = async (req, res) => {
    const { pin } = req.params;

    try {
        // Find the record by PIN
        const record = await PinModel.findOne({ pin });

        if (!record) {
            return res.status(404).json({ message: "Invalid or expired PIN code." });
        }

        // Safety verification: If MongoDB record exists but it's older than 20 mins
        const fileAgeInMinutes = (Date.now() - new Date(record.createdAt).getTime()) / 1000 / 60;
        if (fileAgeInMinutes > 20) {
            return res.status(410).json({ message: "This PIN has expired." });
        }

        return res.status(200).json({
            success: true,
            fileUrl: record.fileUrl,
            fileType: record.fileType

        });

    } catch (error) {
        console.error("Error fetching file by PIN:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getFileByPin;