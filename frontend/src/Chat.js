import React, { useState, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [prompt, setPrompt] = useState("");
  const [body, setBody] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setScreenshot(url);
    };

    return () => ws.close();
  }, []);

  async function sendEmail() {
    const response = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, prompt }),
    });

    const data = await response.json();
    setBody(data.body);
  }

  return (
    <div className="chat-container">
      <input
        type="text"
        placeholder="Recipient Email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Write your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button onClick={sendEmail}>Generate & Send Email</button>

      <div className="output">
        <h3>Generated Email Body:</h3>
        <pre>{body}</pre>
      </div>

      {screenshot && (
        <div className="screenshot">
          <h3>Live Gmail Screenshot:</h3>
          <img src={screenshot} alt="Gmail Screenshot" />
        </div>
      )}
    </div>
  );
}
