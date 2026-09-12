import { useRef, useState } from "react";
import "./App.css";

const API_BASE_URL = "https://ai-document-analyst.onrender.com";

const actions = [
  {
    id: "summarize",
    number: "01",
    title: "Summarize",
    description:
      "Turn lengthy documents into concise, easy-to-read summaries.",
    icon: "✦",
  },
  {
    id: "ask",
    number: "02",
    title: "Ask Questions",
    description:
      "Ask natural-language questions and find answers from your document.",
    icon: "⌁",
  },
  {
    id: "analyze",
    number: "03",
    title: "Analyze",
    description:
      "Identify findings, concerns, patterns, and useful recommendations.",
    icon: "◈",
  },
  {
    id: "classify",
    number: "04",
    title: "Classify",
    description:
      "Automatically identify the primary type of your document.",
    icon: "▦",
  },
  {
    id: "extract-invoice",
    number: "05",
    title: "Invoice Extraction",
    description:
      "Convert invoice information into structured, machine-readable data.",
    icon: "▤",
  },
];

function App() {
  const fileInputRef = useRef(null);

const [selectedFile, setSelectedFile] = useState(null);
const [selectedAction, setSelectedAction] = useState(null);
const [question, setQuestion] = useState("");
const [isDragging, setIsDragging] = useState(false);

const [result, setResult] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOCX, PNG, or JPEG file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    handleFile(file);
  };

  const removeFile = (event) => {
    event.stopPropagation();

    setSelectedFile(null);
    setSelectedAction(null);
    setQuestion("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const selectedActionDetails = actions.find(
    (action) => action.id === selectedAction
  );

  const runSummarize = async () => {
  if (!selectedFile) {
    return;
  }

  setIsLoading(true);
  setResult("");
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      `${API_BASE_URL}/summarize`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to summarize the document."
      );
    }

    setResult(data.summary);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const runAsk = async () => {
  if (!selectedFile || !question.trim()) {
    return;
  }

  setIsLoading(true);
  setResult("");
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("question", question);

    const response = await fetch(
      `${API_BASE_URL}/ask`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to answer the question."
      );
    }

    setResult(data.answer);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const runAnalyze = async () => {
  if (!selectedFile) {
    return;
  }

  setIsLoading(true);
  setResult("");
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      `${API_BASE_URL}/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to analyze the document."
      );
    }

    setResult(data.analysis);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const runClassify = async () => {
  if (!selectedFile) {
    return;
  }

  setIsLoading(true);
  setResult("");
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      `${API_BASE_URL}/classify`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to classify the document."
      );
    }

    setResult(data.document_type);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const runExtractInvoice = async () => {
  if (!selectedFile) {
    return;
  }

  setIsLoading(true);
  setResult("");
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const response = await fetch(
      `${API_BASE_URL}/extract-invoice`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to extract invoice data."
      );
    }

    setResult(JSON.stringify(data.data, null, 2));
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const handleRunAction = () => {
  if (selectedAction === "summarize") {
    runSummarize();
    return;
  }

  if (selectedAction === "analyze") {
    runAnalyze();
    return;
  }

  if (selectedAction === "classify") {
    runClassify();
    return;
  }

  if (selectedAction === "extract-invoice") {
    runExtractInvoice();
    return;
  }
};

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-mark">
            D
          </div>

          <div>
            <div className="brand-name">
              DocuMind
            </div>

          </div>

        </div>

        <div className="nav-right">

          <div className="nav-badge">
            <span className="status-dot"></span>
            Gemini AI
          </div>

          <div className="nav-badge secondary">
            FastAPI
          </div>

        </div>

      </header>


      {/* =========================
          HERO
      ========================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              AI-POWERED DOCUMENT INTELLIGENCE
            </div>

            <h1>
              Turn documents
              <br />
              into
              <span> plain answers.</span>
            </h1>

            <p className="hero-description">
              Upload a document and let AI understand it for you.
              Summarize complex information, ask questions, discover
              insights, classify documents, or extract structured data.
            </p>

            <div className="hero-actions">

              <button
                className="hero-button"
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                Upload a document
                <span>↑</span>
              </button>

              <a
                className="explore-button"
                href="#tools"
              >
                Explore capabilities
                <span>↓</span>
              </a>

            </div>

            <div className="hero-trust">

              <span>PDF</span>
              <i>•</i>
              <span>DOCX</span>
              <i>•</i>
              <span>PNG</span>
              <i>•</i>
              <span>JPG</span>

              <div className="trust-divider"></div>

              <span>Secure processing</span>

            </div>

          </div>


          {/* DOCUMENT ILLUSTRATION */}

          <div className="hero-visual">

            <div className="visual-glow"></div>

            <div className="floating-label label-one">
              <span className="label-dot"></span>
              Text detected
            </div>

            <div className="floating-label label-two">
              <span className="label-check">✓</span>
              AI ready
            </div>

            <svg
              className="document-illustration"
              viewBox="0 0 520 520"
              role="img"
              aria-label="AI document analysis illustration"
            >

              <defs>

                <linearGradient
                  id="paperGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#f4efe1"
                  />

                  <stop
                    offset="100%"
                    stopColor="#dcd5c3"
                  />
                </linearGradient>

                <linearGradient
                  id="accentGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#8f73ff"
                  />

                  <stop
                    offset="100%"
                    stopColor="#d06cff"
                  />
                </linearGradient>

                <filter id="paperShadow">
                  <feDropShadow
                    dx="0"
                    dy="18"
                    stdDeviation="18"
                    floodOpacity="0.35"
                  />
                </filter>

              </defs>


              {/* Back document */}

              <g
                transform="rotate(-8 260 260)"
                opacity="0.45"
              >

                <rect
                  x="100"
                  y="82"
                  width="300"
                  height="360"
                  rx="12"
                  fill="#c8c1ae"
                />

                <rect
                  x="135"
                  y="125"
                  width="180"
                  height="12"
                  rx="6"
                  fill="#a9a293"
                />

                <rect
                  x="135"
                  y="155"
                  width="230"
                  height="8"
                  rx="4"
                  fill="#b3ad9e"
                />

                <rect
                  x="135"
                  y="178"
                  width="190"
                  height="8"
                  rx="4"
                  fill="#b3ad9e"
                />

              </g>


              {/* Main document */}

              <g
                transform="rotate(3 260 260)"
                filter="url(#paperShadow)"
              >

                <rect
                  x="112"
                  y="68"
                  width="300"
                  height="375"
                  rx="12"
                  fill="url(#paperGradient)"
                />


                {/* Fold */}

                <path
                  d="M350 68 L412 130 L350 130 Z"
                  fill="#d0c9b7"
                />


                {/* Header */}

                <rect
                  x="145"
                  y="110"
                  width="115"
                  height="13"
                  rx="6"
                  fill="#37363a"
                  opacity="0.75"
                />

                <rect
                  x="145"
                  y="137"
                  width="210"
                  height="8"
                  rx="4"
                  fill="#77736b"
                  opacity="0.35"
                />


                {/* Highlight */}

                <rect
                  x="142"
                  y="175"
                  width="232"
                  height="25"
                  rx="5"
                  fill="#f3cf52"
                  opacity="0.8"
                />

                <rect
                  x="150"
                  y="183"
                  width="145"
                  height="8"
                  rx="4"
                  fill="#63582d"
                  opacity="0.55"
                />


                {/* Text */}

                <rect
                  x="145"
                  y="225"
                  width="205"
                  height="8"
                  rx="4"
                  fill="#77736b"
                  opacity="0.42"
                />

                <rect
                  x="145"
                  y="248"
                  width="165"
                  height="8"
                  rx="4"
                  fill="#77736b"
                  opacity="0.42"
                />

                <rect
                  x="145"
                  y="271"
                  width="220"
                  height="8"
                  rx="4"
                  fill="#77736b"
                  opacity="0.42"
                />

                <rect
                  x="145"
                  y="294"
                  width="185"
                  height="8"
                  rx="4"
                  fill="#77736b"
                  opacity="0.42"
                />


                {/* AI analysis box */}

                <rect
                  x="145"
                  y="330"
                  width="220"
                  height="72"
                  rx="9"
                  fill="#171820"
                  opacity="0.96"
                />

                <circle
                  cx="169"
                  cy="354"
                  r="10"
                  fill="url(#accentGradient)"
                />

                <rect
                  x="190"
                  y="347"
                  width="130"
                  height="7"
                  rx="3"
                  fill="#aaa2bd"
                />

                <rect
                  x="190"
                  y="363"
                  width="105"
                  height="7"
                  rx="3"
                  fill="#686474"
                />

                <rect
                  x="160"
                  y="384"
                  width="180"
                  height="5"
                  rx="2"
                  fill="#484650"
                />

              </g>


              {/* AI scanning line */}

              <line
                x1="85"
                y1="255"
                x2="435"
                y2="255"
                stroke="url(#accentGradient)"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity="0.65"
              />

              <circle
                cx="85"
                cy="255"
                r="5"
                fill="#a78bfa"
              />

              <circle
                cx="435"
                cy="255"
                r="5"
                fill="#d06cff"
              />

            </svg>

          </div>

        </section>


        {/* =========================
            UPLOAD WORKSPACE
        ========================= */}

        <section className="workspace-section">

          <div
            className={`drop-zone ${
              isDragging ? "dragging" : ""
            } ${selectedFile ? "has-file" : ""}`}

            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}

            onDragLeave={() => {
              setIsDragging(false);
            }}

            onDrop={handleDrop}

            onClick={() => {
              fileInputRef.current?.click();
            }}
          >

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              hidden
            />

            {!selectedFile ? (

              <div className="upload-content">

                <div className="upload-icon">
                  ↑
                </div>

                <h2>
                  Drop your document here
                </h2>

                <p>
                  or{" "}
                  <strong>
                    browse from your computer
                  </strong>
                </p>

                <div className="file-types">
                  PDF
                  <span>•</span>
                  DOCX
                  <span>•</span>
                  PNG
                  <span>•</span>
                  JPG
                </div>

              </div>

            ) : (

              <div
                className="file-preview"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >

                <div className="file-icon">
                  DOC
                </div>

                <div className="file-details">

                  <h3>
                    {selectedFile.name}
                  </h3>

                  <p>
                    {formatFileSize(selectedFile.size)}
                    {" · "}
                    {selectedFile.type || "Document"}
                  </p>

                </div>

                <div className="file-ready">
                  Ready
                </div>

                <button
                  className="remove-file"
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove file"
                >
                  ×
                </button>

              </div>

            )}

          </div>

        </section>


        {/* =========================
            AI TOOLS
        ========================= */}

        <section
          className="tools-section"
          id="tools"
        >

          <div className="section-heading">

            <div>

              <div className="section-label">
                AI CAPABILITIES
              </div>

              <h2>
                One document.
                <br />
                Five ways to understand it.
              </h2>

            </div>

            <p className="section-description">
              Choose the operation that matches what
              you need from your document.
            </p>

          </div>


          <div className="action-grid">

            {actions.map((action) => (

              <button
                key={action.id}
                type="button"

                className={`action-card ${
                  selectedAction === action.id
                    ? "selected"
                    : ""
                }`}

                onClick={() => {
                  setSelectedAction(action.id);
                }}
              >

                <div className="action-top">

                  <span className="action-number">
                    {action.number}
                  </span>

                  <span className="action-icon">
                    {action.icon}
                  </span>

                </div>

                <h3>
                  {action.title}
                </h3>

                <p>
                  {action.description}
                </p>

                <span className="action-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </section>


        {/* =========================
            ASK QUESTION
        ========================= */}

        {selectedAction === "ask" && (

          <section className="question-card">

            <div className="question-header">

              <div>

                <div className="section-label">
                  DOCUMENT Q&A
                </div>

                <h2>
                  Ask your document anything.
                </h2>

              </div>

              <span className="question-badge">
                AI Q&A
              </span>

            </div>

            <textarea
              value={question}

              onChange={(event) => {

                if (
                  event.target.value.length <= 500
                ) {
                  setQuestion(event.target.value);
                }

              }}

              placeholder="Example: What are the main skills mentioned in this resume?"

              rows="4"

              maxLength="500"
            />

            <div className="question-footer">

              <span>
                {question.length}/500
              </span>

            <button
            type="button"
            className="primary-button"
            disabled={
            !selectedFile ||
            !question.trim() ||
            isLoading
            }
            onClick={runAsk}
            >
            {isLoading ? "Asking..." : "Ask AI →"}
            </button>

            </div>

          </section>

        )}


        {/* =========================
            SELECTED ACTION
        ========================= */}

        {selectedAction &&
          selectedAction !== "ask" && (

            <section className="action-ready">

              <div className="ready-icon">
                ✓
              </div>

              <div className="ready-content">

                <div className="ready-label">
                  SELECTED OPERATION
                </div>

                <strong>
                  {selectedActionDetails?.title}
                </strong>

                <p>
                  {selectedFile
                    ? "Your document is ready for AI processing."
                    : "Upload a document above to continue."}
                </p>

              </div>

 <button
  type="button"
  className="primary-button"
  disabled={!selectedFile || isLoading}
  onClick={handleRunAction}
>
  {isLoading
    ? "Processing..."
    : selectedAction === "classify"
      ? "Classify Document →"
      : selectedAction === "summarize"
        ? "Summarize Document →"
        : "Run Analysis →"}
</button>

            </section>

          )}


        {/* =========================
            HOW IT WORKS
        ========================= */}

        <section className="how-section">

          <div className="section-label">
            SIMPLE WORKFLOW
          </div>

          <h2>
            From document to insight
            <br />
            in three steps.
          </h2>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <div className="step-content">

                <h3>
                  Upload
                </h3>

                <p>
                  Upload a PDF, DOCX, PNG, or JPEG
                  document using the workspace above.
                </p>

              </div>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <div className="step-content">

                <h3>
                  Choose
                </h3>

                <p>
                  Select the AI operation that matches
                  what you want to discover.
                </p>

              </div>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <div className="step-content">

                <h3>
                  Understand
                </h3>

                <p>
                  Receive a structured AI-generated
                  result directly in the application.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            RESULT
        ========================= */}

        <section className="result-section">

          <div className="section-heading">

            <div>

              <div className="section-label">
                AI OUTPUT
              </div>

              <h2>
                Analysis Result
              </h2>

            </div>

            <div className="result-status">
              Waiting for analysis
            </div>

          </div>


          <div className="result-placeholder">
          {isLoading ? (
          <>
          <div className="result-symbol">
          ◌
          </div>

         <h3>
          Analyzing your document...
         </h3>

         <p>
          Gemini is processing the document and generating your result.
         </p>
         </>
         ) : error ? (
         <>
      <div className="result-symbol">
        !
      </div>

      <h3>
        Something went wrong
      </h3>

      <p>
        {error}
      </p>
      </>
      ) : result ? (
      <>
      <div className="result-symbol">
        ✦
      </div>

      <h3>
        AI Response
      </h3>

      <div className="result-content">
        {result}
      </div>
       </>
       ) : (
      <>
      <div className="result-symbol">
        ✦
      </div>

      <h3>
        Your AI result will appear here
      </h3>

      <p>
        Upload a document and select an AI
        capability to begin.
      </p>
      </>
      )}
     </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <span>
          © 2026 DocuMind · AI Document Analyst
        </span>

        <span>
          Powered by Gemini · FastAPI · React
        </span>

      </footer>

    </div>
  );
}

export default App;