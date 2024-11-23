import express from "express";
import multer, { diskStorage } from "multer";
import pkg from "cors";
import { unlinkSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from "url";
import libre from "libreoffice-convert";
import PDFDocument from 'pdfkit';

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(pkg({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = readFileSync(req.file.path);

    const passwordEnabled = req.body.password === "true";
    const password = req.body.passwordValue;

    const outputPath = join(__dirname, "uploads", `${req.file.filename}.pdf`);
    const protectedPath = join(__dirname, "uploads", `${req.file.filename}-protected.pdf`);

    libre.convert(file, ".pdf", undefined, (err, done) => {
      if (err) {
        unlinkSync(req.file.path);
        return res.status(500).json({ message: "Error converting DOCX to PDF" });
      }
      writeFileSync(outputPath, done);
      
      // if (passwordEnabled === true) {

      //   const doc = new PDFDocument({
      //     userPassword: password,
      //     permissions: {
      //       printing: 'highResolution',
      //       modifying: false,
      //     }
      //   });
        
      //   const writeStream = createWriteStream(protectedPath);
      //   doc.pipe(writeStream);

      //   createReadStream(outputPath).pipe(doc);

      //   doc.end();

      //   writeStream.on('finish', () => {
      //   res.download(protectedPath, () => {
      //     unlinkSync(req.file.path);
      //     unlinkSync(outputPath);
      //     unlinkSync(protectedPath);
      //   });
      // });

      //   writeStream.on('error', (writeErr) => {
      //     console.error(`Error writing protected PDF: ${writeErr}`);
      //     res.status(500).send('PDF protection error');
      //   });
      // } else {
        res.download(outputPath, () => {
          unlinkSync(req.file.path);
          unlinkSync(outputPath);
        });
      // }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
});