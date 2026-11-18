/**
 * Zero-dependency Brevo SMTP verification script in pure Node.js
 * Uses native 'tls' and 'net' modules - no npm install required!
 */

import tls from "node:tls";
import net from "node:net";

const CONFIG = {
  host: "smtp-relay.brevo.com",
  port: 587,
  user: "c2812c001@smtp-brevo.com",
  pass: process.env.BREVO_SMTP_KEY || "",
};

async function run() {
  console.log("=".repeat(60));
  console.log("Node.js Brevo SMTP Connection & Auth Tester (Native)");
  console.log("=".repeat(60));
  console.log(`Host:  ${CONFIG.host}:${CONFIG.port}`);
  console.log(`User:  ${CONFIG.user}`);
  console.log("-".repeat(60));

  return new Promise((resolve, reject) => {
    let socket = net.createConnection(CONFIG.port, CONFIG.host);
    let step = 0;

    function send(cmd) {
      console.log(`> ${cmd.startsWith("AUTH") ? "AUTH LOGIN" : cmd}`);
      socket.write(cmd + "\r\n");
    }

    socket.on("connect", () => {
      console.log("[1/4] TCP socket connected...");
    });

    socket.on("data", (data) => {
      const response = data.toString();
      console.log(`< ${response.trim()}`);

      const code = parseInt(response.slice(0, 3), 10);

      // Handshake sequence
      if (step === 0 && code === 220) {
        step = 1;
        send("EHLO localhost");
      } else if (step === 1 && code === 250) {
        step = 2;
        console.log("\n[2/4] Requesting STARTTLS encryption...");
        send("STARTTLS");
      } else if (step === 2 && code === 220) {
        step = 3;
        console.log("\n[3/4] Upgrading to secure TLS socket...");

        // Upgrade socket to TLS
        socket = tls.connect({
          socket: socket,
          host: CONFIG.host,
          servername: CONFIG.host
        }, () => {
          console.log("[*] TLS handshake established successfully!");
          send("EHLO localhost");
        });

        socket.on("data", handleTlsData);
        socket.on("error", (err) => {
          console.error("[!] TLS Error:", err.message);
          reject(err);
        });
      }
    });

    let tlsStep = 0;
    function handleTlsData(data) {
      const response = data.toString();
      console.log(`< ${response.trim()}`);
      const code = parseInt(response.slice(0, 3), 10);

      if (tlsStep === 0 && code === 250) {
        tlsStep = 1;
        console.log("\n[4/4] Sending AUTH LOGIN credentials...");
        send("AUTH LOGIN");
      } else if (tlsStep === 1 && code === 334) {
        tlsStep = 2;
        // Send base64 username
        const b64User = Buffer.from(CONFIG.user).toString("base64");
        socket.write(b64User + "\r\n");
      } else if (tlsStep === 2 && code === 334) {
        tlsStep = 3;
        // Send base64 password
        const b64Pass = Buffer.from(CONFIG.pass).toString("base64");
        socket.write(b64Pass + "\r\n");
      } else if (tlsStep === 3 && code === 235) {
        console.log("\n" + "=".repeat(60));
        console.log(">>> SUCCESS: Brevo SMTP Authentication Succeeded! <<<");
        console.log("=".repeat(60));
        send("QUIT");
        socket.end();
        resolve(true);
      } else if (code >= 400) {
        console.error(`\n[!] SMTP Error: ${response.trim()}`);
        send("QUIT");
        socket.end();
        reject(new Error(response));
      }
    }

    socket.on("error", (err) => {
      console.error("[!] Socket Error:", err.message);
      reject(err);
    });
  });
}

run().catch(() => process.exit(1));

