export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single project
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
