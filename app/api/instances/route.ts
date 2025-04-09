import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Instance } from "@/types/instance";

// In-memory storage for instances (replace with database in production)
let instances: Instance[] = [
  {
    id: "1",
    name: "Authentication Service",
    url: "https://auth.example.com",
    status: "Offline",
    interval: "5m",
    responseTime: "450ms",
    uptime: "98.2%",
  },
  {
    id: "2",
    name: "Database Cluster",
    url: "https://db.example.com",
    status: "Offline",
    interval: "1m",
    responseTime: null,
    uptime: "95.7%",
  },
];

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// GET /api/instances
export async function GET() {
  return NextResponse.json(instances);
}

// POST /api/instances
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.url || !body.interval) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newInstance: Instance = {
      id: generateId(),
      name: body.name,
      url: body.url,
      status: "Offline", // Default status
      interval: body.interval,
      responseTime: null,
      uptime: "0%",
    };

    instances.push(newInstance);
    return NextResponse.json(newInstance, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create instance" },
      { status: 500 }
    );
  }
}

// PUT /api/instances
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Instance ID is required" },
        { status: 400 }
      );
    }

    const index = instances.findIndex((i) => i.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    instances[index] = { ...instances[index], ...body };
    return NextResponse.json(instances[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update instance" },
      { status: 500 }
    );
  }
}

// DELETE /api/instances
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Instance ID is required" },
        { status: 400 }
      );
    }

    const index = instances.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    instances = instances.filter((i) => i.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete instance" },
      { status: 500 }
    );
  }
}
