// import { Router } from "express";
// import multer from "multer";
// import { PDFDocument } from "pdf-lib";
// import fs from "fs";

// const router = Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/api/upload", upload.single("file"), async (req, res) => {
//     try {
//       const { file } = req;
//       const { passwordProtect } = req.body;
  
//       // Simulate metadata extraction (replace this with real extraction logic)
//       const metadata = {
//         title: path.basename(file.originalname, path.extname(file.originalname)),
//         author: "AuthorName",
//         wordCount: 1234,
//       };
  
//       const pdfPath = `${file.path}.pdf`;
  
//       // Simulate DOCX to PDF conversion
//       fs.writeFileSync(pdfPath, "This is a converted PDF content!");
  
//       let pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
  
//       // Add password protection if requested
//       if (passwordProtect === "true") {
//         const password = `${metadata.author}${metadata.wordCount}`;
//         pdfDoc.encrypt({ userPassword: password, ownerPassword: password });
//       }
  
//       const pdfBytes = await pdfDoc.save();
//       fs.unlinkSync(file.path); // Remove temporary uploaded DOCX file
//       fs.unlinkSync(pdfPath); // Remove temporary PDF file
  
//       // Send the generated PDF as a response
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
//       res.send(Buffer.from(pdfBytes));
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error processing file.");
//     }
//   });
  
// export default router;
