import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker';
import './App.css';

function App() {
  const canvasContainerRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    const url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

    async function loadPdf() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.js`;

      const pdfDoc = await pdfjsLib.getDocument(url).promise;
      const numPages = pdfDoc.numPages;
      const container = canvasContainerRef.current;
      container.innerHTML = ''; // Clear previous content
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pdfPage = await pdfDoc.getPage(pageNum);
        const viewport = pdfPage.getViewport({ scale: 1 });

        // Create canvas for each page
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.className = 'pdf-canvas'; // Add class for styling
        const renderContext = {
          canvasContext,
          viewport,
        };

        // Render each page
        renderTaskRef.current = pdfPage.render(renderContext);
        await renderTaskRef.current.promise;

        // Extract and display text content for each page
        const textContentData = await pdfPage.getTextContent();
        const textItems = textContentData.items.map(item => item.str);
        const pageTextContent = textItems.join(' ');
        // Create container for each page (canvas and textarea)
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container'; // Add class for styling

        // Append canvas to page container
        pageContainer.appendChild(canvas);

        // Create textarea for each page
        const textArea = document.createElement('textarea');
        textArea.className = 'text-area'; // Add class for styling
        textArea.value = pageTextContent;
        pageContainer.appendChild(textArea);

        // Append page container to main container
        container.appendChild(pageContainer);
      }
    }

    loadPdf();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF.js Sample</h1>
        <div className="pdf-container" ref={canvasContainerRef}>
        </div>
      </header>
    </div>
  );
}

export default App;
