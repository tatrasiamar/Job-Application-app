import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(302, { Location: `http://localhost:3000${req.url || "/"}` });
  res.end();
});

server.listen(3001, () => {
  console.log("Redirect server listening on port 3001 -> 3000");
});

