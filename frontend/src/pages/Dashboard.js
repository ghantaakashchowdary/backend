import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [taskData, setTaskData] = useState({ title: '', description: '', status: 'pending' });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/api/tasks');
      // Handle response.data being an array or containing an array
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data?.tasks && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Form input change handlers
  const handleInputChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/api/tasks', {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'pending'
      });
      
      // Close modal and reset form
      setShowCreateModal(false);
      setTaskData({ title: '', description: '', status: 'pending' });
      
      // Refresh list
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to create task.');
    }
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setEditingTaskId(task._id || task.id);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status || 'pending'
    });
    setShowEditModal(true);
  };

  // Update Task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.put(`/api/tasks/${editingTaskId}`, taskData);
      setShowEditModal(false);
      setEditingTaskId(null);
      setTaskData({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  // Fast Status Toggle
  const toggleTaskStatus = async (task) => {
    const id = task._id || task.id;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await API.put(`/api/tasks/${id}`, {
        ...task,
        status: newStatus
      });
      // Quick local state update for snappy UI
      setTasks(tasks.map(t => {
        const tid = t._id || t.id;
        if (tid === id) {
          return { ...t, status: newStatus };
        }
        return t;
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to update status.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setError('');
    try {
      await API.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => (t._id || t.id) !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          TaskStream
        </Link>
        <div className="navbar-actions">
          {isAdmin && (
            <Link to="/admin" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
              Admin Panel
            </Link>
          )}
          <div className="nav-user">
            <span className="nav-username">{user.name || 'User'}</span>
            <span className="nav-role">{user.role || 'user'}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="main-content">
        {error && <div className="alert alert-danger" style={{ marginBottom: '24px' }}>{error}</div>}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Tasks</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage and track your active workflow items</p>
          </div>
          <button onClick={() => {
            setTaskData({ title: '', description: '', status: 'pending' });
            setShowCreateModal(true);
          }} className="btn btn-primary">
            + Create Task
          </button>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">No tasks found</h3>
                <p className="empty-desc">Get started by creating your first task above.</p>
                <button onClick={() => {
                  setTaskData({ title: '', description: '', status: 'pending' });
                  setShowCreateModal(true);
                }} className="btn btn-primary" style={{ width: 'auto' }}>
                  Create Task
                </button>
              </div>
            ) : (
              tasks.map((task) => {
                const id = task._id || task.id;
                const isCompleted = task.status === 'completed';
                return (
                  <div key={id} className={`task-card ${task.status === 'completed' ? 'completed' : 'pending'}`}>
                    <div>
                      <div className="task-header">
                        <h3 className="task-title" style={{ textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.7 : 1 }}>
                          {task.title}
                        </h3>
                        <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
                          {task.status || 'pending'}
                        </span>
                      </div>
                      <p className="task-description" style={{ opacity: isCompleted ? 0.6 : 1 }}>
                        {task.description || 'No description provided.'}
                      </p>
                    </div>
                    
                    <div className="task-footer">
                      <span className="task-date">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                      <div className="task-actions">
                        <button 
                          onClick={() => toggleTaskStatus(task)} 
                          className="btn-icon" 
                          title={isCompleted ? "Mark Pending" : "Mark Completed"}
                        >
                          {isCompleted ? '↩️' : '✓'}
                        </button>
                        <button onClick={() => openEditModal(task)} className="btn-icon" title="Edit Task">
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteTask(id)} className="btn-icon btn-icon-danger" title="Delete Task">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="e.g. Learn React"
                  value={taskData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  rows="4"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="e.g. Build the core frontend components..."
                  value={taskData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  value={taskData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-title">Task Title</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  className="form-input"
                  value={taskData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="form-input"
                  rows="4"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  value={taskData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  className="form-input"
                  value={taskData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => {
                  setShowEditModal(false);
                  setEditingTaskId(null);
                }} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
