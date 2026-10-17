import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

async function TodosList() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: todos, error } = await supabase.from("todos").select()

  if (error) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
        <p className="font-semibold">Notice: Table &apos;todos&apos;</p>
        <p className="text-[11px] mt-0.5 text-muted-foreground">
          {error.message || "Table not created yet or RLS policy needs configuration in Supabase Dashboard."}
        </p>
      </div>
    )
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
        No rows found in table &apos;todos&apos;. You can insert test rows in Supabase Table Editor.
      </div>
    )
  }

  return (
    <ul className="space-y-2 text-xs">
      {todos.map((todo: { id: string | number; name?: string; title?: string }) => (
        <li key={todo.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
          <span className="font-medium text-foreground">{todo.name || todo.title || JSON.stringify(todo)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TodosPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-foreground font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <h1 className="text-base font-bold text-foreground">Supabase Database Test</h1>
            <p className="text-xs text-muted-foreground">Connected to project kbkasggnwispxwbafkpw</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground text-center animate-pulse">Connecting to Supabase...</div>}>
          <TodosList />
        </Suspense>

        <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href="/">
              <ArrowLeft className="size-3.5" />
              <span>Back to Team Desk</span>
            </Link>
          </Button>

          <span className="text-[10px] text-muted-foreground font-mono">
            /todos
          </span>
        </div>
      </div>
    </div>
  )
}
