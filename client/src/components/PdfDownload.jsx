import React from "react";

const PdfDownload = ({ downloadUrl }) => (
  <div>
    {downloadUrl && (
      <a href={downloadUrl} download="converted.pdf">
        <button>Download PDF</button>
      </a>
    )}
  </div>
);

export default PdfDownload;
