'use client'
import { useEffect, useState, useCallback } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [todos, setTodos] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/todos"

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setTodos(data)
    } catch (err: any) {
      console.error("Gagal fetch todos:", err)
      setError("Gagal mengambil data todo")
    }
  }, [API_URL])

  useEffect(() => { refresh() }, [refresh])

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await fetch(API_URL, { 
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }) 
      })
      setTitle('')
      refresh()
    } catch (err) {
      console.error("Gagal tambah todo:", err)
    }
  }

  async function toggle(id: string, done: boolean) {
    try {
      await fetch(API_URL, { 
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !done }) 
      })
      refresh()
    } catch (err) {
      console.error("Gagal toggle todo:", err)
    }
  }

  async function remove(id: string) {
    try {
      await fetch(API_URL, { 
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }) 
      })
      refresh()
    } catch (err) {
      console.error("Gagal hapus todo:", err)
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>✅ Todo CRUD</h1>

      <form onSubmit={addTodo} className={styles.form}>
        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Tambah todo..."
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Tambah</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {todos.length === 0 ? (
        <p>Belum ada todo. Tambahkan di atas 👆</p>
      ) : (
        <ul className={styles.list}>
          {todos.map((t:any)=> (
            <li key={t.id} className={styles.item}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={()=>toggle(t.id,t.done)}
                />
                <span className={t.done ? styles.done : ""}>
                  {t.title}
                </span>
              </label>
              <button 
                onClick={()=>remove(t.id)} 
                className={styles.deleteButton}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
