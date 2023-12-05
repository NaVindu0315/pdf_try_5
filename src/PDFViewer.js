import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const readPdf = async () => {
      const pdfText = await readPdfText(file);
      setText(pdfText);
    };

    if (file) {
      readPdf();
    }
  }, [file]);

  const readPdfText = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onloadend = () => {
        const typedarray = new Uint8Array(reader.result);
        pdfjs.getDocument({ data: typedarray }).promise.then((pdf) => {
          let fullText = "";

          const getPageText = (pageNum) => {
            return pdf.getPage(pageNum).then((page) => {
              return page.getTextContent().then((textContent) => {
                return textContent.items.map((item) => item.str).join(" ");
              });
            });
          };

          const promises = Array.from(new Array(pdf.numPages), (el, index) =>
            getPageText(index + 1)
          );

          Promise.all(promises).then((pagesText) => {
            fullText = pagesText.join("\n");
            resolve(fullText);
          });
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <pre>{text}</pre>
    </div>
  );
};

export default PDFViewer;
