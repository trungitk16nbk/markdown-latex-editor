// File: src/App.js
import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import 'katex/dist/katex.min.css';
import './App.css';

function App() {
  const [markdownContent, setMarkdownContent] = useState('# Hello, World!\n\nThis is a **Markdown** and $\\LaTeX$ editor.\n\n## Math Example\n\n$$E = mc^2$$\n\n## Table Example\n\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |');

  useEffect(() => {
    // Load content from localStorage if available
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
      setMarkdownContent(savedContent);
    }
  }, []);

  useEffect(() => {
    // Save content to localStorage whenever it changes
    localStorage.setItem('markdownContent', markdownContent);
  }, [markdownContent]);

  const handleEditorChange = (value) => {
    setMarkdownContent(value);
  };

  const exportToPDF = () => {
    const previewElement = document.getElementById('preview-content');
    const opt = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(previewElement).save();
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    const previewContent = document.getElementById('preview-content').innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Document</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            @page {
              size: A4;
              margin: 2cm;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 4px;
            }
            pre {
              background-color: #f4f4f4;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            .page-break {
              page-break-after: always;
            }
          </style>
        </head>
        <body>
          ${previewContent}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="app-container">
      <div className="toolbar">
        <h1>Markdown + LaTeX Editor</h1>
        <div className="toolbar-actions">
          <button onClick={exportToPDF} className="export-btn">Export PDF</button>
          <button onClick={printDocument} className="print-btn">Print</button>
        </div>
      </div>

      <div className="editor-preview-container">
        <div className="editor-container">
          <CodeMirror
            value={markdownContent}
            height="100%"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
            onChange={handleEditorChange}
            className="editor"
          />
        </div>

        <div className="divider"></div>

        <div className="preview-container">
          <div className="preview-scroll">
            <div id="preview-content" className="preview-content">
              <ReactMarkdown
                children={markdownContent}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code: ({node, inline, className, children, ...props}) => {
                    return !inline ? (
                      <pre className={className}>
                        <code {...props}>{children}</code>
                      </pre>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    )
                  },
                  // Add page break support with a custom hr component
                  hr: () => {
                    return <div className="page-break"></div>;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;