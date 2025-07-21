"use client"

import Image from "next/image"

interface FlagIconProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-3",
  md: "w-6 h-4",
  lg: "w-8 h-6",
}

export function FlagIcon({ src, alt, size = "md", className = "" }: FlagIconProps) {
  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden rounded-sm border border-gray-200 ${className}`}>
      <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" sizes="32px" priority={false} />
    </div>
  )
}
