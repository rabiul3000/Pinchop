import multer from "multer"



const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})


const multerMiddle = (fieldName) => {
    return upload.single(fieldName)
}

export default multerMiddle;