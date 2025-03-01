import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

    async function loadPdf() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.js`;

      const pdfDoc = await pdfjsLib.getDocument(url).promise;
      const pdfPage = await pdfDoc.getPage(1);
      const viewport = pdfPage.getViewport({ scale: 1 });

      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext,
        viewport,
      };
      pdfPage.render(renderContext);
    }

    loadPdf();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF.js Sample</h1>
        <canvas ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;
