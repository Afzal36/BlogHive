import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin-api/userauthors`);
      
      const allUsers = response.data.payload || [];
      console.log(allUsers);
      
      // Filter out admin users first
      const nonAdminUsers = allUsers.filter(user => user.role?.toLowerCase() !== 'admin');
      
      // Then filter by active status
      const active = nonAdminUsers.filter(user => user.isActive !== false);
      const blocked = nonAdminUsers.filter(user => user.isActive === false);
      
      setUsers(active);
      setBlockedUsers(blocked);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const handleToggleStatus = async (email, newActiveStatus) => {
    try {
      const data = encodeURIComponent(email);
      console.log(data);
      await axios.put(`${import.meta.env.VITE_API_URL}/admin-api/userauthors/${data}/status`,
        { isActive: newActiveStatus }
      );
          
      // Refresh users after status change
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status. Please try again.');
    }
  };
  
  return (
    <div style={{ backgroundColor: "#1e2124", minHeight: "100vh" }}>
      {/* Admin Sub-Header */}
      <div style={{ 
        backgroundColor: "#3a5285", 
        color: "#fff",
        padding: "15px 0",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
      }}>
        <div className="container">
          <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold" }}>Admin</h2>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="container py-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}>
            <button
              className={`py-2 px-4 border-0 ${activeTab === 'users' ? 'text-white' : 'text-secondary'}`}
              style={{ 
                backgroundColor: activeTab === 'users' ? '#2c3a56' : 'transparent',
                borderRadius: '4px 4px 0 0',
                fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
            <button
              className={`py-2 px-4 border-0 ${activeTab === 'blocked' ? 'text-white' : 'text-secondary'}`}
              style={{ 
                backgroundColor: activeTab === 'blocked' ? '#2c3a56' : 'transparent',
                borderRadius: '4px 4px 0 0',
                fontWeight: activeTab === 'blocked' ? 'bold' : 'normal',
                marginLeft: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onClick={() => setActiveTab('blocked')}
            >
              Blocked Users ({blockedUsers.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "#64a0e0" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-light">Loading users...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'users' ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "1.5rem" }}>Active Users</h3>
                  <button 
                    onClick={fetchUsers} 
                    className="btn"
                    style={{ 
                      backgroundColor: "rgba(100, 160, 224, 0.15)", 
                      color: "#64a0e0",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 15px",
                      transition: "all 0.2s ease"
                    }}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                </div>
                
                {users.length === 0 ? (
                  <p className="text-secondary">No active users found.</p>
                ) : (
                  <div style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}>
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>NAME</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>EMAIL</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>ROLE</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6",
                            textAlign: "center"
                          }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user._id || index} style={{ 
                            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9"
                          }}>
                            <td style={{ padding: "15px", color: "#333" }}>
                              {user.firstName || user.name || 'N/A'}
                            </td>
                            <td style={{ padding: "15px", color: "#333" }}>
                              {user.email}
                            </td>
                            <td style={{ padding: "15px" }}>
                              <span style={{ 
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                backgroundColor: user.role?.toLowerCase() === 'author' ? "#4285F4" : "#777",
                                color: "#fff"
                              }}>
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td style={{ padding: "15px", textAlign: "center" }}>
                              <button
                                onClick={() => handleToggleStatus(user.email, false)}
                                style={{ 
                                  backgroundColor: "#dc3545",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "5px 15px",
                                  transition: "all 0.2s ease"
                                }}
                                disabled={loading}
                              >
                                Block
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "1.5rem" }}>Blocked Users</h3>
                  <button 
                    onClick={fetchUsers} 
                    className="btn"
                    style={{ 
                      backgroundColor: "rgba(100, 160, 224, 0.15)", 
                      color: "#64a0e0",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 15px",
                      transition: "all 0.2s ease"
                    }}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                </div>
                
                {blockedUsers.length === 0 ? (
                  <p className="text-secondary">No blocked users found.</p>
                ) : (
                  <div style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}>
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>NAME</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>EMAIL</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6"
                          }}>ROLE</th>
                          <th style={{ 
                            padding: "15px", 
                            fontWeight: "bold", 
                            color: "#333",
                            borderBottom: "2px solid #dee2e6",
                            textAlign: "center"
                          }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockedUsers.map((user, index) => (
                          <tr key={user._id || index} style={{ 
                            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9"
                          }}>
                            <td style={{ padding: "15px", color: "#333" }}>
                              {user.firstName || user.name || 'N/A'}
                            </td>
                            <td style={{ padding: "15px", color: "#333" }}>
                              {user.email}
                            </td>
                            <td style={{ padding: "15px" }}>
                              <span style={{ 
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                backgroundColor: user.role?.toLowerCase() === 'author' ? "#4285F4" : "#777",
                                color: "#fff"
                              }}>
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td style={{ padding: "15px", textAlign: "center" }}>
                              <button
                                onClick={() => handleToggleStatus(user.email, true)}
                                style={{ 
                                  backgroundColor: "#28a745",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "5px 15px",
                                  transition: "all 0.2s ease"
                                }}
                                disabled={loading}
                              >
                                Unblock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;