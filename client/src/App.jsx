import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import PdfDownload from "./components/PdfDownload";

const App = () => {
  const [downloadUrl, setDownloadUrl] = useState("");

  return (
    <div>
      <h1>DOCX to PDF Converter</h1>
      <FileUpload onComplete={setDownloadUrl} />
      <PdfDownload downloadUrl={downloadUrl} />
    </div>
  );
};

export default App;
