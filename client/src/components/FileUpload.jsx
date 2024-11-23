import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { FaFileWord } from "react-icons/fa6";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValue, setPassword] = useState('');

  const handleFileChange = async (e) => {
    setErrorMessage("");
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);

      const fileMetadata = {
        name: uploadedFile.name,
        size: `${(uploadedFile.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(uploadedFile.lastModified).toLocaleString(),
      };

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;

          try {
            const zip = await JSZip.loadAsync(arrayBuffer);

            const coreXml = await zip.file("docProps/core.xml")?.async("string");
            if (coreXml) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(coreXml, "text/xml");

              fileMetadata.author =
                xmlDoc.getElementsByTagName("dc:creator")[0]?.textContent ||
                "Unknown";
              fileMetadata.title =
                xmlDoc.getElementsByTagName("dc:title")[0]?.textContent ||
                "Untitled";
            } else {
              fileMetadata.author = "N/A";
              fileMetadata.title = "N/A";
            }
          } catch (error) {
            if (error.message.includes("encrypted")) {
              setErrorMessage("The file is protected");
              setMetadata(fileMetadata);
              return;
            }
            console.error("Error parsing file metadata:", error);
          }

          setMetadata(fileMetadata);
        };

        reader.readAsArrayBuffer(uploadedFile);
      } catch (error) {
        console.error("Error loading file:", error);
        setMetadata(fileMetadata);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    if(passwordEnabled && !passwordValue) {
      alert("Please enter a password.");
      return;
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", passwordEnabled);
    formData.append("passwordValue", passwordValue);

    try {

      const response = await axios.post(
        "https://rune-dashing-switch.glitch.me/convertFile",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedFile.name.split(".")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error uploading file:", err.response?.data || err.message);
      alert("Failed to upload and convert the file.");
    }
  };

  return (
    <div>
      <p className="desc">Easily convert Word documents to PDF format online, without having to install any software.</p>
      <form onSubmit={handleSubmit}>
        <input type="file" id="FileInput" accept=".docx" className="inp" onChange={handleFileChange} />
        
        <label htmlFor="FileInput" className="hidden">
          <FaFileWord className="icon" />
          <span>{file ? file.name : "Choose File"}</span>
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={() => setPasswordEnabled(!passwordEnabled)}
          />
          Enable Password Protection
        </label>

        {passwordEnabled && (
          <>
          <label htmlFor="password">
            Password:
            <input type="password" id="password" name="password"  value={passwordValue} onChange={(e) => setPassword(e.target.value)}/>
          </label>
          </>
        )}
        <button type="submit">Convert</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {metadata.name && (
        <div>
          <h3>File Metadata:</h3>
          <p><strong>Name:</strong> {metadata.name}</p>
          <p><strong>Size:</strong> {metadata.size}</p>
          <p><strong>Last Modified:</strong> {metadata.lastModified}</p>
          <p><strong>Author:</strong> {metadata.author || "N/A"}</p>
          <p><strong>Title:</strong> {metadata.title || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
