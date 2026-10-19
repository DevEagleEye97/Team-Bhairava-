import { TerminalLoader } from "@/components/ui/terminal-loader"

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent p-4">
      <TerminalLoader title="HackForge System" text="Loading..." />
    </div>
  )
}
