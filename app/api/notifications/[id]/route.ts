import { NextResponse, NextRequest } from "next/server";

// DELETE /api/instances/:id
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete instance" },
      { status: 500 }
    );
  }
}

// PUT /api/instances/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update instance" },
      { status: 500 }
    );
  }
}
