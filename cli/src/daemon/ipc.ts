import net from 'node:net';
import fs from 'node:fs';
import type { DaemonEventBus } from './event-bus.js';
import type { StateStore } from '../state/store.js';
import { socketPath } from '../utils/paths.js';
import { logger } from '../utils/logger.js';

export interface IpcRequest {
  method: string;
  params?: Record<string, unknown>;
}

export interface IpcResponse {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export class IpcServer {
  private server: net.Server | null = null;
  private bus: DaemonEventBus;
  private store: StateStore;
  private root: string;
  private logSubscribers: Set<net.Socket> = new Set();

  constructor(bus: DaemonEventBus, store: StateStore, root: string) {
    this.bus = bus;
    this.store = store;
    this.root = root;

    // Forward daemon logs to subscribers
    this.bus.onTyped('daemon:log', (source, message) => {
      const payload = JSON.stringify({ type: 'log', source, message, ts: Date.now() }) + '\n';
      for (const socket of this.logSubscribers) {
        try { socket.write(payload); } catch { this.logSubscribers.delete(socket); }
      }
    });
  }

  start(): void {
    const sockPath = socketPath(this.root);

    // Remove stale socket
    try { fs.unlinkSync(sockPath); } catch {}

    this.server = net.createServer((socket) => {
      let buffer = '';

      socket.on('data', (chunk) => {
        buffer += chunk.toString();
        const parts = buffer.split('\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          if (!part.trim()) continue;
          this.handleMessage(socket, part.trim());
        }
      });

      socket.on('close', () => {
        this.logSubscribers.delete(socket);
      });

      socket.on('error', () => {
        this.logSubscribers.delete(socket);
      });
    });

    this.server.listen(sockPath, () => {
      logger.info('ipc', `Listening on ${sockPath}`);
    });
  }

  private handleMessage(socket: net.Socket, raw: string): void {
    let req: IpcRequest;
    try {
      req = JSON.parse(raw);
    } catch {
      this.respond(socket, { ok: false, error: 'Invalid JSON' });
      return;
    }

    switch (req.method) {
      case 'status':
        this.respond(socket, { ok: true, data: this.store.toJSON() });
        break;

      case 'subscribe:logs':
        this.logSubscribers.add(socket);
        this.respond(socket, { ok: true, data: 'subscribed' });
        break;

      case 'ping':
        this.respond(socket, { ok: true, data: 'pong' });
        break;

      default:
        this.respond(socket, { ok: false, error: `Unknown method: ${req.method}` });
    }
  }

  private respond(socket: net.Socket, response: IpcResponse): void {
    try {
      socket.write(JSON.stringify(response) + '\n');
    } catch {}
  }

  async stop(): Promise<void> {
    for (const socket of this.logSubscribers) {
      socket.destroy();
    }
    this.logSubscribers.clear();

    return new Promise((resolve) => {
      if (!this.server) { resolve(); return; }
      this.server.close(() => resolve());
    });
  }
}

// Client helper for CLI commands to talk to daemon
export async function ipcRequest(root: string, req: IpcRequest): Promise<IpcResponse> {
  return new Promise((resolve, reject) => {
    const sockPath = socketPath(root);
    const socket = net.createConnection(sockPath);
    let buffer = '';

    socket.on('connect', () => {
      socket.write(JSON.stringify(req) + '\n');
    });

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const idx = buffer.indexOf('\n');
      if (idx >= 0) {
        try {
          resolve(JSON.parse(buffer.slice(0, idx)));
        } catch {
          reject(new Error('Invalid response'));
        }
        socket.end();
      }
    });

    socket.on('error', (err) => {
      reject(new Error(`Cannot connect to daemon: ${err.message}`));
    });

    setTimeout(() => {
      socket.destroy();
      reject(new Error('IPC timeout'));
    }, 5000);
  });
}
