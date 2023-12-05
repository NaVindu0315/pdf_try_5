import React, { useState } from "react";
import FileUpload from "./FileUpload";
import PDFViewer from "./PDFViewer";

const App = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  return (
    <div>
      <FileUpload onFileChange={handleFileChange} />
      <PDFViewer file={file} />
    </div>
  );
};

export default App;
