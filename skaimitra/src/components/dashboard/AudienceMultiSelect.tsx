import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Search } from 'lucide-react'
import {
  announcementAudienceTree,
  getAudienceLabel,
  type AudienceId,
  type AudienceTreeNode,
} from '../../lib/dashboardData'

type AudienceMultiSelectProps = {
  value: AudienceId[]
  onChange: (nextValue: AudienceId[]) => void
  allowedIds?: AudienceId[]
  placeholder?: string
}

function collectLeafIds(node: AudienceTreeNode): AudienceId[] {
  if (!node.children?.length) return [node.id]
  return node.children.flatMap(collectLeafIds)
}

function collectAllIds(node: AudienceTreeNode): AudienceId[] {
  return [node.id, ...(node.children?.flatMap(collectAllIds) ?? [])]
}

function AudienceMultiSelect({
  value,
  onChange,
  allowedIds,
  placeholder = 'Select audience',
}: AudienceMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<AudienceId[]>([])
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const allowedSet = useMemo(() => (allowedIds ? new Set(allowedIds) : null), [allowedIds])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return
      if (event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleTree = useMemo(() => {
    function filterNodes(nodes: AudienceTreeNode[]): AudienceTreeNode[] {
      const results: AudienceTreeNode[] = []

      nodes.forEach((node) => {
        if (allowedSet && !collectAllIds(node).some((id) => allowedSet.has(id))) {
          return
        }

        const filteredChildren = node.children?.length ? filterNodes(node.children) : undefined
        const selfMatches = node.label.toLowerCase().includes(query.trim().toLowerCase())
        const hasChildrenMatch = Boolean(filteredChildren?.length)

        if (!query.trim()) {
          results.push({
            ...node,
            ...(filteredChildren ? { children: filteredChildren } : {}),
          })
          return
        }

        if (selfMatches) {
          results.push({
            ...node,
            ...(filteredChildren ?? node.children ? { children: filteredChildren ?? node.children } : {}),
          })
          return
        }

        if (hasChildrenMatch) {
          results.push({
            ...node,
            children: filteredChildren,
          })
        }
      })

      return results
    }

    return filterNodes(announcementAudienceTree)
  }, [allowedSet, query])

  useEffect(() => {
    if (!query.trim()) return

    const nextExpanded = visibleTree
      .filter((node) => node.children?.length)
      .map((node) => node.id)

    setExpandedIds((prev) => Array.from(new Set([...prev, ...nextExpanded])))
  }, [query, visibleTree])

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    listRef.current.scrollTop = 0
  }, [isOpen])

  const selectedSet = useMemo(() => new Set(value), [value])

  function isNodeChecked(node: AudienceTreeNode, parentSelected = false): boolean {
    if (!node.children?.length) return parentSelected || selectedSet.has(node.id)
    if (selectedSet.has(node.id)) return true

    const leafIds = collectLeafIds(node)
    return leafIds.length > 0 && leafIds.every((id) => selectedSet.has(id))
  }

  function isNodePartial(node: AudienceTreeNode): boolean {
    if (!node.children?.length || selectedSet.has(node.id)) return false

    const leafIds = collectLeafIds(node)
    const selectedChildren = leafIds.filter((id) => selectedSet.has(id))
    return selectedChildren.length > 0 && selectedChildren.length < leafIds.length
  }

  function toggleParentNode(node: AudienceTreeNode) {
    const descendantIds = collectLeafIds(node)
    const next = new Set(selectedSet)
    const fullySelected = selectedSet.has(node.id) || descendantIds.every((id) => next.has(id))

    if (fullySelected) {
      next.delete(node.id)
      descendantIds.forEach((id) => next.delete(id))
    } else {
      descendantIds.forEach((id) => next.delete(id))
      next.add(node.id)
    }

    onChange(Array.from(next))
  }

  function toggleLeafNode(node: AudienceTreeNode, parent?: AudienceTreeNode) {
    const next = new Set(selectedSet)
    const nextSelected = !isNodeChecked(node, Boolean(parent && selectedSet.has(parent.id)))

    if (parent && next.has(parent.id)) {
      next.delete(parent.id)
      collectLeafIds(parent).forEach((id) => {
        if (id !== node.id) next.add(id)
      })
      if (nextSelected) next.add(node.id)
      else next.delete(node.id)
      onChange(Array.from(next))
      return
    }

    if (nextSelected) next.add(node.id)
    else next.delete(node.id)

    if (parent) {
      const siblingLeafIds = collectLeafIds(parent)
      const allSelected = siblingLeafIds.every((id) => next.has(id))
      if (allSelected) {
        siblingLeafIds.forEach((id) => next.delete(id))
        next.add(parent.id)
      }
    }

    onChange(Array.from(next))
  }

  function toggleExpand(id: AudienceId) {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const selectedSummary = useMemo(() => {
    if (value.length === 0) return placeholder
    return value.map((id) => getAudienceLabel(id)).join(', ')
  }, [placeholder, value])

  function renderNode(node: AudienceTreeNode, level = 0, parent?: AudienceTreeNode) {
    const expanded = expandedIds.includes(node.id)
    const checked = isNodeChecked(node, Boolean(parent && selectedSet.has(parent.id)))
    const partial = isNodePartial(node)
    const hasChildren = Boolean(node.children?.length)

    return (
      <div key={node.id} className="audience-node-wrap">
        <div className={`audience-node audience-node-level-${level}`}>
          <div className="audience-checkbox-row">
            <button
              type="button"
              className="audience-checkbox-main"
              onClick={() => {
                if (hasChildren) toggleParentNode(node)
                else toggleLeafNode(node, parent)
              }}
            >
              <span className={`audience-checkbox ${checked ? 'is-checked' : ''} ${partial ? 'is-partial' : ''}`}>
                <span className="audience-checkbox-mark">
                  {partial ? <span className="audience-checkbox-dash" /> : checked ? <Check size={12} /> : null}
                </span>
              </span>

              <span className="audience-label-copy">
                <span className="audience-label">
                  {node.label}
                  {node.kind === 'class' ? <span className="audience-inline-note">Select entire class</span> : null}
                </span>
              </span>
            </button>

            {hasChildren ? (
              <button
                type="button"
                className="audience-expand-btn"
                aria-label={expanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
                onClick={() => toggleExpand(node.id)}
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <span className="audience-expand-spacer" />
            )}
          </div>
        </div>

        {hasChildren && expanded ? (
          <div className="audience-children">
            {node.children?.map((child) => renderNode(child, level + 1, node))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="audience-select" ref={rootRef}>
      <button
        type="button"
        className={`audience-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="audience-trigger-copy">
          <span className={value.length === 0 ? 'audience-placeholder' : 'audience-summary'}>{selectedSummary}</span>
        </div>
        <ChevronDown size={16} className="audience-trigger-icon" />
      </button>

      {isOpen ? (
        <div className="audience-select-dropdown">
          <div className="audience-select-list" ref={listRef}>
            {visibleTree.length ? (
              visibleTree.map((node) => renderNode(node))
            ) : (
              <p className="audience-empty">No audience matches your search.</p>
            )}
          </div>

          <div className="audience-search-row audience-search-row-bottom">
            <Search size={14} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search classes, sections, or groups"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AudienceMultiSelect
