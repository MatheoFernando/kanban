import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import type { Task } from '../types/task'
import { kanbanColumns } from '../data/mockTasks'
import KanbanColumn from './KanbanColumn.tsx'
import TaskCard from './TaskCard.tsx'

interface KanbanViewProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onUpdateTasks: (tasks: Task[]) => void
}

const KanbanView = ({ tasks, onUpdateTask, onUpdateTasks }: KanbanViewProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (kanbanColumns.some(col => col.id === overId)) {
      const task = tasks.find(t => t.id === activeId)
      if (task && task.status !== overId) {
        onUpdateTask({ ...task, status: overId as Task['status'] })
      }
      return
    }

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)
    
    if (!activeTask || !overTask) return
    if (activeTask.status === overTask.status) return

    onUpdateTask({ ...activeTask, status: overTask.status })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(t => t.status === activeTask.status)
      const activeIndex = columnTasks.findIndex(t => t.id === activeId)
      const overIndex = columnTasks.findIndex(t => t.id === overId)

      if (activeIndex !== overIndex) {
        const newColumnTasks = arrayMove(columnTasks, activeIndex, overIndex)
        const otherTasks = tasks.filter(t => t.status !== activeTask.status)
        onUpdateTasks([...otherTasks, ...newColumnTasks])
      }
    }
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {kanbanColumns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanView
