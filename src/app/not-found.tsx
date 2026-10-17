import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-foreground">
      <div className="flex max-w-md flex-col items-center text-center space-y-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl">
          HF
        </div>

        <div className="space-y-1.5">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
            404
          </h1>
          <h2 className="text-base font-semibold text-foreground">
            Desk Page Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested subpath does not exist or has moved. The HackForge Digital Team Desk is hosted at the root workspace URL.
          </p>
        </div>

        <div className="pt-2">
          <Button asChild size="sm" className="gap-2 text-xs font-medium">
            <Link href="/">
              <LayoutDashboard className="size-3.5" />
              <span>Back to Digital Team Desk</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
