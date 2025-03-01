import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker';
import './App.css';

function App() {
  const canvasContainerRef = useRef(null);
  const renderTaskRef = useRef(null); // Ref to store the render task

  useEffect(() => {
    const url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

    async function loadPdf() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.js`;

      const pdfDoc = await pdfjsLib.getDocument(url).promise;
      const pdfPage = await pdfDoc.getPage(1);
      const viewport = pdfPage.getViewport({ scale: 1 });

      // Create a new canvas element
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext,
        viewport,
      };

      // Cancel previous render task if it exists
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      // Store the new render task
      renderTaskRef.current = pdfPage.render(renderContext);
      await renderTaskRef.current.promise; // Wait for rendering to complete

      // Append the new canvas to the div
      const canvasContainer = canvasContainerRef.current;
      canvasContainer.innerHTML = ''; // Clear previous canvas, if any
      canvasContainer.appendChild(canvas);
    }

    loadPdf();

    return () => { // Cleanup function
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel(); // Cancel render task on unmount
      }
    };
  }, []); // Empty dependency array

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF.js Sample</h1>
        <div id="canvas-container" ref={canvasContainerRef}> {/* Ref to the container */}
        </div>
      </header>
    </div>
  );
}

export default App;