import { Button } from "@/components/base/button"
import { ArrowRight, Plus, Trash2 } from "lucide-react"

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm text-neutral-500">{children}</p>
  )
}

function ButtonCell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  )
}

function StateRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-8">
      <span className="w-24 shrink-0 text-sm text-neutral-500">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function Divider() {
  return <hr className="border-neutral-200" />
}

export default function DesignTestPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-white p-10">
      <section className="flex flex-col gap-4">
        <SectionLabel>Variants</SectionLabel>
        <div className="flex flex-wrap items-start gap-6">
          <ButtonCell label="default">
            <Button variant="default" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="secondary">
            <Button variant="secondary" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="destructive">
            <Button variant="destructive" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="outline">
            <Button variant="outline" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="ghost">
            <Button variant="ghost" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="link">
            <Button variant="link" size="md">
              Button
            </Button>
          </ButtonCell>
        </div>
      </section>

      <Divider />

      <section className="flex flex-col gap-4">
        <SectionLabel>Sizes</SectionLabel>
        <div className="flex flex-wrap items-start gap-6">
          <ButtonCell label="sm">
            <Button variant="default" size="sm">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="md">
            <Button variant="default" size="md">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="lg">
            <Button variant="default" size="lg">
              Button
            </Button>
          </ButtonCell>
          <ButtonCell label="icon">
            <Button variant="default" size="icon" aria-label="Add">
              <Plus className="h-4 w-4" />
            </Button>
          </ButtonCell>
        </div>
      </section>

      <Divider />

      <section className="flex flex-col gap-6">
        <SectionLabel>States</SectionLabel>

        <StateRow label="Loading">
          <Button variant="default" isLoading>
            Button
          </Button>
          <Button variant="secondary" isLoading>
            Button
          </Button>
          <Button variant="destructive" isLoading>
            Button
          </Button>
        </StateRow>

        <StateRow label="Selected">
          <Button variant="default" selected>
            Button
          </Button>
          <Button variant="secondary" selected>
            Button
          </Button>
          <Button variant="outline" selected>
            Button
          </Button>
        </StateRow>

        <StateRow label="Disabled">
          <Button variant="default" disabled>
            Button
          </Button>
          <Button variant="secondary" disabled>
            Button
          </Button>
          <Button variant="destructive" disabled>
            Button
          </Button>
          <Button variant="outline" disabled>
            Button
          </Button>
          <Button variant="ghost" disabled>
            Button
          </Button>
          <Button variant="link" disabled>
            Button
          </Button>
        </StateRow>

        <StateRow label="With icon">
          <Button variant="default" leadingIcon={<Plus />}>
            Button
          </Button>
          <Button variant="secondary" trailingIcon={<ArrowRight />}>
            Button
          </Button>
          <Button variant="destructive" size="sm" leadingIcon={<Trash2 />}>
            Button
          </Button>
        </StateRow>
      </section>
    </div>
  )
}
