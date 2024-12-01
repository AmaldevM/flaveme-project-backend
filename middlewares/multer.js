const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = { upload };








// const multer = require("multer")

//
// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         console.log(file, " =======image file");
//         cb(null, file.originalname);
//     }
// })

// const upload = multer({ storage: storage })

// module.exports =  { upload }