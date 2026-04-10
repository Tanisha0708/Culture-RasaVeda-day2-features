import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { openApiEndpoints } from "../../data/openApiEndpoints";
import "./styles.css";

function generateFakeApiKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return `${hex()}${hex()}${hex()}${hex()}-${hex()}${hex()}${hex()}${hex()}-4${hex()}${hex()}${hex()}${hex()}-a${hex()}${hex()}${hex()}${hex()}-${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}`.toLowerCase();
}

function formatJson(value) {
  if (value == null) return "// No request body";
  return JSON.stringify(value, null, 2);
}

const METHOD_BADGE_CLASS = {
  GET: "api-method api-method--get",
  POST: "api-method api-method--post",
};

export default function OpenAPI() {
  const [expanded, setExpanded] = useState(() => new Set());
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [copyState, setCopyState] = useState("idle");

  const toggleEndpoint = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim();
    if (!name || !email) return;
    setApiKey(generateFakeApiKey());
    setCopyState("idle");
  };

  const handleCopyKey = useCallback(async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = apiKey;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
      } catch {
        setCopyState("error");
      }
    }
  }, [apiKey]);

  return (
    <div className="feature-page api-docs">
      <Link to="/" className="page-back">
        ← Back
      </Link>
      <h1>Open Recipe API</h1>
      <p className="api-lead">
        Public reference for integrators. Register below to receive a demo API key
        (generated locally — not stored on a server).
      </p>

      <section className="api-section" aria-labelledby="endpoints-heading">
        <h2 id="endpoints-heading" className="api-section-title">
          Endpoints
        </h2>
        <ul className="api-endpoint-list">
          {openApiEndpoints.map((ep) => {
            const isOpen = expanded.has(ep.id);
            return (
              <li key={ep.id} className="api-endpoint-item">
                <button
                  type="button"
                  className={`api-endpoint-trigger${isOpen ? " is-open" : ""}`}
                  onClick={() => toggleEndpoint(ep.id)}
                  aria-expanded={isOpen}
                >
                  <span className={METHOD_BADGE_CLASS[ep.method] || "api-method"}>
                    {ep.method}
                  </span>
                  <code className="api-path">{ep.path}</code>
                  <span className="api-chevron" aria-hidden>
                    {isOpen ? "▾" : "▸"}
                  </span>
                </button>
                <p className="api-desc">{ep.description}</p>
                {isOpen && (
                  <div className="api-examples">
                    <div className="api-example-block">
                      <h3 className="api-example-label">Request example</h3>
                      <pre className="api-code">
                        <code>{formatJson(ep.requestExample)}</code>
                      </pre>
                    </div>
                    <div className="api-example-block">
                      <h3 className="api-example-label">Response example</h3>
                      <pre className="api-code">
                        <code>{formatJson(ep.responseExample)}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="api-section" aria-labelledby="key-heading">
        <h2 id="key-heading" className="api-section-title">
          API key registration
        </h2>
        <form className="api-reg-form" onSubmit={handleRegister}>
          <label className="api-field">
            <span>Name</span>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="name"
              required
            />
          </label>
          <label className="api-field">
            <span>Email</span>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="ada@example.com"
              autoComplete="email"
              required
            />
          </label>
          <button type="submit" className="api-btn api-btn--primary">
            Generate API key
          </button>
        </form>

        {apiKey && (
          <div className="api-key-box">
            <p className="api-key-label">Your demo API key</p>
            <div className="api-key-row">
              <code className="api-key-value">{apiKey}</code>
              <button
                type="button"
                className="api-btn api-btn--ghost"
                onClick={handleCopyKey}
              >
                {copyState === "copied"
                  ? "Copied"
                  : copyState === "error"
                    ? "Copy failed"
                    : "Copy key"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
