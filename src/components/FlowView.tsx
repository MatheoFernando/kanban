import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from '@xyflow/react'
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Task } from '../types/task'
import TaskNode from './TaskNode.tsx'

interface FlowViewProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onUpdateTasks: (tasks: Task[]) => void
}

const nodeTypes: NodeTypes = {
  taskNode: TaskNode,
}

const FlowView = ({ tasks, onUpdateTask }: FlowViewProps) => {
  const computeNodes = useCallback((): Node[] => (
    tasks.map(task => ({
      id: task.id,
      type: 'taskNode',
      position: task.position || { x: Math.random() * 500, y: Math.random() * 300 },
      data: { task },
    }))
  ), [tasks])

  const computeEdges = useCallback((): Edge[] => {
    const edges: Edge[] = []
    const ids = new Set(tasks.map(t => t.id))
    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          if (ids.has(depId) && ids.has(task.id) && depId !== task.id) {
            edges.push({
              id: `${depId}-${task.id}`,
              source: depId,
              target: task.id,
              animated: true,
              style: { stroke: '#64748b', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#64748b' },
            })
          }
        })
      }
    })
    return edges
  }, [tasks])

  const [nodes, setNodes] = useState<Node[]>(computeNodes)
  const [edges, setEdges] = useState<Edge[]>(computeEdges)

  useEffect(() => {
    setNodes(prev => {
      // Preserve existing positions if ids match, otherwise regenerate
      const next = computeNodes()
      const posMap = new Map(prev.map(n => [n.id, n.position]))
      return next.map(n => ({ ...n, position: posMap.get(n.id) || n.position }))
    })
    setEdges(computeEdges())
  }, [computeNodes, computeEdges])

  const onNodesChange = useCallback((changes: any) => {
    setNodes(ns => applyNodeChanges(changes, ns))
  }, [])

  const onEdgesChange = useCallback((changes: any) => {
    setEdges(es => applyEdgeChanges(changes, es))
  }, [])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed' as const,
          color: '#64748b',
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      
      if (params.source && params.target) {
        const targetTask = tasks.find(t => t.id === params.target)
        if (targetTask) {
          const updatedTask = {
            ...targetTask,
            dependencies: [...(targetTask.dependencies || []), params.source]
          }
          onUpdateTask(updatedTask)
        }
      }
    },
    [tasks, onUpdateTask, setEdges]
  )

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      const task = tasks.find(t => t.id === node.id)
      if (task) {
        onUpdateTask({
          ...task,
          position: node.position
        })
      }
    },
    [tasks, onUpdateTask]
  )

  return (
    <div className="h-[400px] sm:h-[500px] w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ animated: true, style: { stroke: '#64748b', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed', color: '#64748b' } as any }}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50 dark:bg-slate-800 [&_.react-flow__node]:rounded-lg [&_.react-flow__edge-path]:stroke-slate-500"
      >
        <Controls className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
        <MiniMap 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          nodeColor={(node) => {
            const task = tasks.find(t => t.id === node.id)
            if (!task) return '#64748b'
            
            switch (task.priority) {
              case 'high': return '#ef4444'
              case 'medium': return '#f59e0b'
              case 'low': return '#10b981'
              default: return '#64748b'
            }
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          className="opacity-30" 
        />
      </ReactFlow>
    </div>
  )
}

export default FlowView