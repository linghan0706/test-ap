"use client"

import React from 'react'

type Props = {
  fallback?: React.ReactNode
  onReset?: () => void
  children?: React.ReactNode
}

type State = {
  hasError: boolean
  error?: unknown
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[ErrorBoundary] caught error in modal', { error, info })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-md bg-black/60 text-white p-4">
            <p className="text-sm">加载失败：组件未能正常渲染。</p>
            <button
              className="mt-2 px-3 py-1 rounded bg-white/20 hover:bg-white/30"
              onClick={this.props.onReset}
            >
              关闭
            </button>
          </div>
        )
      )
    }
    return this.props.children as React.ReactNode
  }
}