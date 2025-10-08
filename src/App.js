import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Logo Section */}
        <div style={{ marginBottom: "20px" }}>
          <h1>Akash Portfolio</h1>
        </div>

        {/* About Section */}
        <section style={{ marginBottom: "20px" }}>
          <h2>About Me</h2>
          <p>
            Hello! I am Akash, a web developer. I build clean, modern, and
            responsive web applications.
          </p>
        </section>

        {/* Projects Section */}
        <section style={{ marginBottom: "20px" }}>
          <h2>Projects</h2>
          <ul>
            <li>
              <a
                href="https://github.com/akash/project1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project 1
              </a>
            </li>
            <li>
              <a
                href="https://github.com/akash/project2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project 2
              </a>
            </li>
          </ul>
        </section>

        {/* Contact Section */}
        <section>
          <h2>Contact</h2>
          <p>Email: akash@example.com</p>
          <p>Phone: +91-XXXXXXXXXX</p>
        </section>
      </header>
    </div>
  );
}

export default App;
