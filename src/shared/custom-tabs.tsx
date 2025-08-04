import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/shared/utils"

const tabsListVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground h-9 w-fit rounded-lg p-[3px]",
      editor: "h-7 justify-start rounded-none bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:outline-ring dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] flex-1 gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        editor:
          "tab-trigger relative flex h-8 w-[160px] gap-2 rounded-none border-[var(--tab-border)] border-r px-2 py-1 pr-8 after:absolute after:top-0 after:right-0 after:left-0 after:z-10 after:h-1 after:bg-transparent after:content-[''] data-[state=active]:bg-[var(--tab-accent)] data-[state=active]:after:bg-[var(--tab-active-line)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2 bg-[var(--tab-background)]", className)}
      data-slot="tabs"
      {...props}
    />
  )
}

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant }), className)}
      data-slot="tabs-list"
      {...props}
    />
  )
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(tabsTriggerVariants({ variant }), className)}
      data-slot="tabs-trigger"
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
