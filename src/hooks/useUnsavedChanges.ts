'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function useUnsavedChanges(params: {
  hasUnsaved: boolean
  isLoading?: boolean
  fallbackPath?: string
}) {
  const { hasUnsaved, isLoading = false, fallbackPath = '/vendedor/produtos' } = params
  const router = useRouter()
  const pathname = usePathname()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allowNavigation, setAllowNavigation] = useState(false)

  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [hasUnsaved])

  useEffect(() => {
    if (!hasUnsaved) return

    const handleLinkClick = (e: MouseEvent) => {
      if (isSubmitting || allowNavigation) return
      const target = e.target as HTMLElement
      if (target.closest('button[type="submit"]')) return
      const link = target.closest('a')
      if (link && hasUnsaved && !showCancelDialog) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && href !== pathname) {
          e.preventDefault()
          e.stopPropagation()
          setPendingNavigation(href)
          setShowCancelDialog(true)
        }
      }
    }

    const originalPush = router.push.bind(router) as typeof router.push
    const originalBack = router.back.bind(router) as typeof router.back
    const originalReplace = router.replace.bind(router) as typeof router.replace

    const targetOf = (url: unknown): string => {
      if (typeof url === 'string') return url
      if (typeof url === 'object' && url !== null) {
        const u = url as { pathname?: string; href?: string }
        return u.pathname || u.href || ''
      }
      return ''
    }

    const handleRouterPush: typeof router.push = (url, options) => {
      if (hasUnsaved && !showCancelDialog && !isLoading && !isSubmitting && !allowNavigation) {
        const targetUrl = targetOf(url)
        const currentPath = window.location.pathname
        if (targetUrl && targetUrl !== pathname && targetUrl !== currentPath) {
          setPendingNavigation(targetUrl)
          setShowCancelDialog(true)
          return Promise.resolve()
        }
      }
      return originalPush(url, options)
    }

    const handleRouterBack: typeof router.back = () => {
      if (hasUnsaved && !showCancelDialog && !isSubmitting && !allowNavigation) {
        setPendingNavigation(null)
        setShowCancelDialog(true)
        return
      }
      return originalBack()
    }

    const handleRouterReplace: typeof router.replace = (url, options) => {
      if (hasUnsaved && !showCancelDialog && !isSubmitting && !allowNavigation) {
        const targetUrl = targetOf(url)
        const currentPath = window.location.pathname
        if (targetUrl && targetUrl !== pathname && targetUrl !== currentPath) {
          setPendingNavigation(targetUrl)
          setShowCancelDialog(true)
          return Promise.resolve()
        }
      }
      return originalReplace(url, options)
    }

    ;(router as unknown as { push: typeof router.push }).push = handleRouterPush
    ;(router as unknown as { back: typeof router.back }).back = handleRouterBack
    ;(router as unknown as { replace: typeof router.replace }).replace = handleRouterReplace

    document.addEventListener('click', handleLinkClick, true)

    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      ;(router as unknown as { push: typeof router.push }).push = originalPush
      ;(router as unknown as { back: typeof router.back }).back = originalBack
      ;(router as unknown as { replace: typeof router.replace }).replace = originalReplace
    }
  }, [hasUnsaved, showCancelDialog, pathname, router, isLoading, isSubmitting, allowNavigation])

  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    setAllowNavigation(true)
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    } else {
      router.push(fallbackPath)
    }
  }

  const handleCancelDialogClose = (open: boolean) => {
    if (!open) {
      setShowCancelDialog(false)
      setPendingNavigation(null)
    }
  }

  return {
    showCancelDialog,
    setShowCancelDialog,
    pendingNavigation,
    isSubmitting,
    setIsSubmitting,
    allowNavigation,
    setAllowNavigation,
    handleConfirmCancel,
    handleCancelDialogClose,
  }
}
