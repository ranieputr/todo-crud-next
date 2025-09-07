import { NextResponse } from 'next/server'

type Todo = {
  id: string
  title: string
  done: boolean
}

// Simpan sementara di memori server (reset tiap restart)
let todos: Todo[] = []

// GET → ambil semua todos
export async function GET() {
  return NextResponse.json(todos)
}

// POST → tambah todo
export async function POST(req: Request) {
  const body = await req.json()
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: body.title || "Untitled",
    done: body.done ?? false, // default false
  }
  todos.push(newTodo)
  return NextResponse.json(newTodo)
}

// PUT → update todo
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const body = await req.json()

  todos = todos.map((t) =>
    t.id === id ? { ...t, ...body, done: !!body.done } : t
  )

  const updated = todos.find((t) => t.id === id)
  return NextResponse.json(updated)
}

// DELETE → hapus todo
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  todos = todos.filter((t) => t.id !== id)
  return NextResponse.json({ success: true })
}
