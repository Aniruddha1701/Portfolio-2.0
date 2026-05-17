import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Track server start time
const startTime = Date.now();

/**
 * Health Check Endpoint — GET /api/health
 *
 * Returns system status for monitoring tools (UptimeRobot, Vercel, etc.)
 * Statuses: "healthy" | "degraded" | "unhealthy"
 */
export async function GET() {
  const now = Date.now();
  const uptimeMs = now - startTime;

  // Check MongoDB connection state
  const dbState = mongoose.connection.readyState;
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const dbStatus = dbStateMap[dbState] || 'unknown';
  const dbHealthy = dbState === 1;

  // Check memory usage
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
  const memoryHealthy = heapPercent < 85;

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (dbHealthy && memoryHealthy) {
    status = 'healthy';
  } else if (!dbHealthy && !memoryHealthy) {
    status = 'unhealthy';
  } else {
    status = 'degraded';
  }

  const httpStatus = status === 'unhealthy' ? 503 : 200;

  const response = {
    status,
    timestamp: new Date().toISOString(),
    uptime: {
      ms: uptimeMs,
      human: formatUptime(uptimeMs),
    },
    checks: {
      database: {
        status: dbHealthy ? 'pass' : 'fail',
        state: dbStatus,
      },
      memory: {
        status: memoryHealthy ? 'pass' : 'warn',
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        utilization: `${heapPercent}%`,
      },
    },
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  };

  return NextResponse.json(response, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Health-Status': status,
    },
  });
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
