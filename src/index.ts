#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "./app.js";
import debugLib from "debug";
import * as http from "http";
import * as net from "net";

const debug = debugLib("Product-server");

const port: string | number = normalizePort(process.env.PORT || "8000") as
  | string
  | number;
app.set("port", port);

/**
 * Create HTTP server.
 */

const server: http.Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.log(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address() as string | net.AddressInfo;
  if (typeof addr === "string") {
    console.log("Listening on " + addr);
  } else {
    const bind = "port " + addr.port;
    debug("Listening on " + bind);
    console.log("Listening on " + "http://localhost:" + addr.port);
  }
}
