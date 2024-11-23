import express from "express";
import multer, { diskStorage } from "multer";
import cors from "cors";
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

app.use(
  cors({
    origin: "https://word-pdf.vercel.app",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/",(req,res)=>{
  res.send("Hello World");
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' https://word-pdf-v08j.onrender.com https://word-pdf-v08j.onrender.com/convertFile; script-src 'self' https://word-pdf-v08j.onrender.com https://word-pdf-v08j.onrender.com/convertFile;",
    "script-src-elem 'self' https://vercel.live https://vercel.live/_next-live/feedback/feedback.js 'self';"
  );
  next();
});


app.post("/convertFile", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const file = readFileSync(req.file.path);
    
    const passwordEnabled = req.body.password === "true";
    const password = req.body.passwordValue;
    
    const outputPath = join(__dirname, "uploads", `${req.file.filename}.pdf`);
    const protectedPath = join(
      __dirname,
      "uploads",
      `${req.file.filename}-protected.pdf`
    );

    libre.convert(file, ".pdf", undefined, (err, done) => {
      unlinkSync(req.file.path);
      if (err) {
        // return res.status(500).json(err.message);
        res.send(err.message);
      }

      if (passwordEnabled) {

        const doc = new PDFDocument({
          userPassword: password,
          ownerPassword: password,
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
          }
        });
        console.log("Conversion successful, sending file to client...");

        const writeStream = createWriteStream(protectedPath);
        doc.pipe(writeStream);

        doc.end(done);


        writeStream.on("finish", () => {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${req.file.originalname.split(".")[0]}-protected.pdf"`
          );

          res.sendFile(protectedPath, () => {
            unlinkSync(outputPath);
            unlinkSync(protectedPath);
          });
        });

        writeStream.on('error', (writeErr) => {
          console.error(`Error writing protected PDF: ${writeErr}`);
          res.status(500).send('PDF protection error');
        });
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${req.file.originalname.split(".")[0]}.pdf"`
        );

        res.send(done);
        unlinkSync(outputPath);
      }
    });

  } catch (error) {
    res.send(error.message);
  }
  
});


app.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
});
