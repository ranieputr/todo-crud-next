'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from './page.module.css'

type Todo = {
  id: string
  title: string
  done: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // Ambil data awal
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then((data: Todo[]) => setTodos(data))
      .catch(() => setTodos([]))
  }, [])

  // Tambah todo baru
  const addTodo = useCallback(async () => {
    if (!newTodo.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo })
    })
    const todo: Todo = await res.json()
    setTodos((prev) => [...prev, todo])
    setNewTodo("")
  }, [newTodo])

  // Toggle selesai/belum
  const toggleTodo = async (id: string, done: boolean) => {
    await fetch(`/api/todos?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    })
    setTodos((prev) => prev.map(t => t.id === id ? { ...t, done } : t))
  }

  // Hapus todo
  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' })
    setTodos((prev) => prev.filter(t => t.id !== id))
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Todo CRUD</h1>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Tambah todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className={styles.input}
        />
        <button onClick={addTodo} className={styles.button}>
          Tambah
        </button>
      </div>

      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
              />
              <span className={todo.done ? styles.done : ""}>
                {todo.title}
              </span>
            </label>
            <button
              className={styles.deleteButton}
              onClick={() => deleteTodo(todo.id)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
