import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
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
  const initialNodes: Node[] = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      type: 'taskNode',
      position: task.position || { x: Math.random() * 500, y: Math.random() * 300 },
      data: { task },
    }))
  }, [tasks])

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = []
    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          edges.push({
            id: `${depId}-${task.id}`,
            source: depId,
            target: task.id,
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
              color: '#64748b',
            },
          })
        })
      }
    })
    return edges
  }, [tasks])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

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
    <div className="h-[500px] sm:h-[600px] w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50 dark:bg-slate-800"
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
