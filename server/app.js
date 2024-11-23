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
    
    console.log(JSON.stringify(req.file));
    
    const file = readFileSync(req.file.path);
    
//     const passwordEnabled = req.body.password === "true";
//     const password = req.body.passwordValue;

    const outputPath = join(__dirname, "uploads", `${req.file.filename}.pdf`);
    // const protectedPath = join(__dirname, "uploads", `${req.file.filename}-protected.pdf`);

    libre.convert(file, ".pdf", undefined, (err, done) => {
      if (err) {
        unlinkSync(req.file.path);
        return res.status(500).json(err.message);
      }
      writeFileSync(outputPath, done);
      console.log("Conversion successful, sending file to client...");

      // Set the response headers to return a file directly
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${req.file.originalname.split(".")[0]}.pdf"`,
      });
      
      
      res.send(done);
      
      // Clean up temporary files
//       unlinkSync(req.file.path);
      
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
        // res.download(outputPath, () => {
        //   unlinkSync(req.file.path);
        //   unlinkSync(outputPath);
        // });
      
      // }
    });

  } catch (error) {
    res.send(error.message);
  }
  
});


app.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
});
