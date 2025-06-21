"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-200 ring-2 ring-white shadow-lg",
        className,
      )}
      {...props}
    />
  ),
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src?: string
    onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
  }
>(({ className, onLoadingStatusChange, src, ...props }, ref) => {
  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<"loading" | "loaded" | "error">("loading")

  React.useEffect(() => {
    if (!src || typeof src !== "string") {
      setImageLoadingStatus("error")
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImageLoadingStatus("loaded")
      onLoadingStatusChange?.("loaded")
    }
    img.onerror = () => {
      setImageLoadingStatus("error")
      onLoadingStatusChange?.("error")
    }
    img.src = src
  }, [src, onLoadingStatusChange])

  if (imageLoadingStatus === "loaded" && src) {
    return (
      <img
        ref={ref}
        className={cn(
          "aspect-square h-full w-full object-cover transition-all duration-300 hover:scale-105",
          className,
        )}
        src={src || "/placeholder.svg"}
        {...props}
      />
    )
  }

  return null
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-sm font-semibold text-white",
        className,
      )}
      {...props}
    />
  ),
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
