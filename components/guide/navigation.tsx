"use client"

import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GuideTabs {
  id: string
  label: string
  content: ReactNode
}

interface GuideTabsProps {
  tabs: GuideTabs[]
  defaultTab?: string
  onChange?: (value: string) => void
}

export function GuideTabs({ tabs, defaultTab, onChange }: GuideTabsProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0].id} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

interface GuideNavigationProps {
  prevLink?: {
    href: string
    label: string
  }
  nextLink?: {
    href: string
    label: string
  }
  homeLink?: {
    href: string
    label: string
  }
}

export function GuideNavigation({ prevLink, nextLink, homeLink }: GuideNavigationProps) {
  return (
    <div className="flex justify-between items-center border-t mt-8 pt-4">
      <div>
        {prevLink && (
          <Link href={prevLink.href}>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {prevLink.label}
            </Button>
          </Link>
        )}
      </div>

      <div>
        {homeLink && (
          <Link href={homeLink.href}>
            <Button variant="ghost">{homeLink.label}</Button>
          </Link>
        )}
      </div>

      <div>
        {nextLink && (
          <Link href={nextLink.href}>
            <Button variant="outline" className="flex items-center gap-2">
              {nextLink.label}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

interface TableOfContentsItem {
  id: string
  title: string
  items?: {
    id: string
    title: string
  }[]
}

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  activeId?: string
  onSelect?: (id: string) => void
}

export function TableOfContents({ items, activeId, onSelect }: TableOfContentsProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium mb-3">Table of Contents</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={`text-left w-full px-2 py-1 rounded hover:bg-gray-200 ${activeId === item.id ? "bg-gray-200 font-medium" : ""}`}
              onClick={() => onSelect && onSelect(item.id)}
            >
              {item.title}
            </button>

            {item.items && (
              <ul className="pl-4 mt-1 space-y-1">
                {item.items.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      className={`text-left w-full px-2 py-1 text-sm rounded hover:bg-gray-200 ${activeId === subItem.id ? "bg-gray-200 font-medium" : ""}`}
                      onClick={() => onSelect && onSelect(subItem.id)}
                    >
                      {subItem.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
