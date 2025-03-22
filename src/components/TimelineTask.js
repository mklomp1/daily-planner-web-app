import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TaskContext, PRIORITY_LEVELS } from '../contexts/TaskContext';
import { formatTime } from '../utils/timeUtils';
import TaskModal from './TaskModal';

const TaskContainer = styled.div`
  position: relative;
  margin: 10px 0;
  padding: 12px 15px;
  border-radius: 6px;
  background-color: ${props => props.color || '#4285f4'};
  opacity: ${props => props.completed ? 0.7 : 1};
  min-height: 70px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  
  .project-badge {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 3px 6px;
    border-radius: 3px;
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .task-time {
    font-size: 13px;
    margin-bottom: 5px;
    opacity: 0.9;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .task-title {
    font-weight: 500;
    font-size: 16px;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    white-space: normal;
    line-height: 1.3;
    max-height: 2.6em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .task-description {
    font-size: 13px;
    margin-top: 6px;
    opacity: 0.9;
    max-height: ${props => props.expanded ? '100px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .priority-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: ${props => props.priorityColor || 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: white;
    font-weight: bold;
  }
  
  .subtasks-indicator {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 5px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

const WeeklyTaskContainer = styled(TaskContainer)`
  position: absolute;
  left: 5px;
  right: 5px;
  height: 75px;
  margin: 5px;
  padding: 0;
  min-height: 0;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  
  .task-time {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 30px;
    font-size: 11px;
    opacity: 0.9;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .task-title {
    position: absolute;
    top: 30px;
    left: 10px;
    right: 10px;
    font-size: 13px;
    font-weight: 500;
    white-space: normal;
    overflow: hidden;
    max-width: calc(100% - 20px);
    line-height: 17px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .project-badge {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 3px 6px;
    font-size: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    max-width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .priority-indicator {
    position: absolute;
    width: 15px;
    height: 15px;
    font-size: 9px;
    right: 10px;
    top: 10px;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
  }
`;

const TaskIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.color || '#333'};
  flex-shrink: 0;
  font-size: 20px;
`;

const WeeklyTaskIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 4px 4px 0 8px;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
`;

const TaskIndicator = styled.div`
  width: 8px;
  flex-shrink: 0;
  background-color: ${props => props.color || '#333'};
  border-radius: 4px;
  margin: 0 10px;
`;

const TaskContent = styled.div`
  flex: 1;
  background-color: #2A2A2A;
  padding: 15px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: #333;
  }
`;

const WeeklyTaskContent = styled.div`
  flex: 1;
  padding: 4px 8px 4px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; /* Ensures proper text truncation */
`;

const TaskTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TaskDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
  margin-bottom: 6px;
  line-height: 1.4;
  max-height: ${props => props.expanded ? 'none' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const WeeklyTaskTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskTime = styled.div`
  font-size: 14px;
  color: #999;
`;

const WeeklyTaskTime = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 14px; /* Make room for the project badge */
`;

const WeeklyProjectBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.9);
`;

const CompletionIndicator = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  background-color: ${props => props.completed ? props.color : 'transparent'};
  border: 2px solid ${props => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const WeeklyCompletionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 10px;
`;

const EditForm = styled.form`
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  margin: 15px 0;
  border: 1px solid #444;
  
  label {
    display: block;
    margin-bottom: 15px;
    font-size: 14px;
    color: #ddd;
    
    input, select {
      display: block;
      width: 100%;
      padding: 10px;
      margin-top: 6px;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 14px;
      background-color: #333;
      color: #fff;
      
      &:focus {
        outline: none;
        border-color: #ff4081;
        box-shadow: 0 0 0 2px rgba(255, 64, 129, 0.2);
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.type === 'submit' ? '#ff4081' : '#333'};
  color: white;
  border: none;
  padding: 10px 16px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.type === 'submit' ? '#f50057' : '#444'};
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
`;

const ActionButton = styled.button`
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 6px;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
    transform: scale(1.1);
  }
`;

const SubtasksContainer = styled.div`
  margin-top: 15px;
`;

const SubtaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const SubtaskInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #555;
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: #f44336;
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    color: #d32f2f;
  }
`;

const AddButton = styled.button`
  background-color: transparent;
  border: 1px solid #666;
  color: #ccc;
  padding: 8px 15px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #333;
  }
`;

const PrioritySelect = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const PriorityOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  border: 3px solid ${props => props.selected ? '#fff' : 'transparent'};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const TimelineTask = ({ task, isWeeklyView = false }) => {
  const { 
    deleteTask, 
    completeTask, 
    editTask,
    projects, 
    PRIORITY_LEVELS 
  } = useContext(TaskContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({...task});
  const [newSubtask, setNewSubtask] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const handleComplete = () => {
    completeTask(task.id);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    editTask(updatedTask);
    setIsEditing(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({...updatedTask, [name]: value});
  };
  
  const handleCancel = () => {
    setUpdatedTask({...task});
    setIsEditing(false);
  };
  
  const handlePrioritySelect = (priority) => {
    setUpdatedTask(prev => ({ ...prev, priority }));
  };
  
  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setUpdatedTask(prev => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          { id: `subtask-${Date.now()}`, title: newSubtask.trim(), completed: false }
        ]
      }));
      setNewSubtask('');
    }
  };
  
  const handleRemoveSubtask = (index) => {
    setUpdatedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };
  
  const handleToggleSubtaskCompletion = (index) => {
    setUpdatedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === index ? {...subtask, completed: !subtask.completed} : subtask
      )
    }));
  };
  
  const handleClick = (e) => {
    if (!isWeeklyView && !e.target.closest('button')) {
      setExpanded(!expanded);
    } else if (isWeeklyView) {
      setShowModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const formatTimeDisplay = (time, isWeeklyView = false) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    if (isWeeklyView) {
      // More compact format for weekly view
      return `${displayHour}:${minutes}${ampm}`;
    }
    
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  // Improved handling for displaying titles appropriately for the view type
  const getDisplayTitle = () => {
    if (!isWeeklyView) return task.title;
    
    // For weekly view, keep the original special cases for backward compatibility
    if (task.title === 'Weekend Run') return 'Run';
    if (task.title === 'Morning Workout') return 'Workout';
    if (task.title === 'Check Email') return 'Email';
    if (task.title === 'Comforttotaal Freelance Dag opening') {
      return 'Freelance Meeting';
    }
    
    // Return the original title - it will now wrap onto a second line if needed
    return task.title;
  };
  
  const displayTitle = getDisplayTitle();
  
  // Get project name
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unassigned';
  };
  
  if (isEditing) {
    return (
      <EditForm onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={updatedTask.title}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Description:
          <textarea
            name="description"
            value={updatedTask.description || ''}
            onChange={handleChange}
            placeholder="Add a description..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '100px'
            }}
          />
        </label>
        
        <label>
          Project:
          <select
            name="projectId"
            value={updatedTask.projectId || ''}
            onChange={handleChange}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={updatedTask.startTime}
            onChange={handleChange}
          />
        </label>
        
        <label>
          End Time:
          <input
            type="time"
            name="endTime"
            value={updatedTask.endTime}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={updatedTask.dueDate || ''}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Priority:
          <PrioritySelect>
            {Object.values(PRIORITY_LEVELS).map(priority => (
              <PriorityOption
                key={priority.name}
                color={priority.color}
                selected={updatedTask.priority?.name === priority.name}
                onClick={() => handlePrioritySelect(priority)}
              >
                {priority.name}
              </PriorityOption>
            ))}
          </PrioritySelect>
        </label>
        
        <label>
          Subtasks:
          {updatedTask.subtasks && updatedTask.subtasks.length > 0 && (
            <SubtasksContainer>
              {updatedTask.subtasks.map((subtask, index) => (
                <SubtaskItem key={subtask.id || index}>
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtaskCompletion(index)}
                  />
                  <SubtaskInput
                    type="text"
                    value={subtask.title}
                    onChange={(e) => {
                      const newSubtasks = [...updatedTask.subtasks];
                      newSubtasks[index].title = e.target.value;
                      setUpdatedTask(prev => ({ ...prev, subtasks: newSubtasks }));
                    }}
                  />
                  <RemoveButton 
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                  >
                    ×
                  </RemoveButton>
                </SubtaskItem>
              ))}
            </SubtasksContainer>
          )}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <SubtaskInput
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Enter a subtask..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddSubtask}
              style={{ padding: '0 15px' }}
            >
              Add
            </Button>
          </div>
        </label>
        
        <ButtonGroup>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
        </ButtonGroup>
      </EditForm>
    );
  }
  
  const Container = isWeeklyView ? WeeklyTaskContainer : TaskContainer;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const priorityColor = task.priority?.color || 'transparent';
  const hasDescription = task.description && task.description.trim().length > 0;
  
  return (
    <>
      <Container 
        completed={task.completed} 
        color={task.color}
        onClick={handleClick}
        priorityColor={priorityColor}
        expanded={expanded}
      >
        {task.priority && (
          <div className="priority-indicator">
            {task.priority.name}
          </div>
        )}
        
        {task.projectId && (
          <div className="project-badge">
            {getProjectName(task.projectId)}
          </div>
        )}
        
        <div className="task-time">
          {formatTimeDisplay(task.startTime, isWeeklyView)} - {formatTimeDisplay(task.endTime, isWeeklyView)}
        </div>
        
        <div className="task-title">
          {displayTitle}
        </div>
        
        {!isWeeklyView && hasDescription && expanded && (
          <div className="task-description">
            {task.description}
          </div>
        )}
        
        {hasSubtasks && !isWeeklyView && (
          <div className="subtasks-indicator">
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
          </div>
        )}
        
        {!isWeeklyView && (
          <ActionButtons>
            <ActionButton onClick={(e) => { e.stopPropagation(); handleComplete(); }}>
              {task.completed ? '↩' : '✓'}
            </ActionButton>
            <ActionButton onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
              ×
            </ActionButton>
          </ActionButtons>
        )}
      </Container>
      
      {showModal && (
        <TaskModal 
          task={task}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TimelineTask;
