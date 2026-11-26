import { Component, type ReactNode } from 'react'

export class SceneBoundary extends Component<{
  onFail: () => void
  children: ReactNode
}, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFail() }
  render() { return this.state.failed ? null : this.props.children }
}
