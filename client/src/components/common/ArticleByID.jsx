
import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import "./ArticleByID.css";

function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  function enableEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...currentArticle, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    articleAfterChanges.dateOfModification = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "article modified") {
        setEditArticleStatus(false);
        setCurrentArticle(res.data.payload);
        navigate(`/author-profile/articles/${currentArticle.articleId}`, {
          state: res.data.payload,
        });
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  }
  
  async function addComment(commentObj) {
    try {
        const token = await getToken();
        if (!token) {
            setCommentStatus("Authentication error. Please log in again.");
            return;
        }

        // Retrieve user details from localStorage
        const storedUser = localStorage.getItem("currentuser");
        if (!storedUser) {
            setCommentStatus("Error: User not found. Please log in again.");
            return;
        }

        const currentUser = JSON.parse(storedUser); // Convert from string to object

        // Validate required fields
        if (!commentObj.comment || commentObj.comment.trim() === "") {
            setCommentStatus("Error: Comment cannot be empty.");
            return;
        }

        // Create payload based on schema
        const payload = {
            nameOfUser: currentUser.firstName, // Ensure this exists in localStorage
            comment: commentObj.comment.trim()
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        const res = await axios.put(
            `${import.meta.env.VITE_API_URL}/user-api/comment/${currentArticle.articleId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Comment response:", res.data);

        if (res.data.message === "comment added") {
            setCommentStatus("Comment added successfully");
            setShowCommentForm(false);
            setCurrentArticle(res.data.payload || {
                ...currentArticle,
                comments: [...(currentArticle.comments || []), payload]
            });
            reset();
        } else {
            setCommentStatus("Comment submitted successfully.");
        }
    } catch (error) {
        console.error("Error adding comment:", error);

        if (error.response) {
            console.error("Response data:", error.response.data);
            setCommentStatus(`Error: ${error.response.data.message || "Invalid data format."}`);
        } else if (error.request) {
            setCommentStatus("Network error: No response from server.");
        } else {
            setCommentStatus(`Error: ${error.message}`);
        }
    }
  }

  async function deleteArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      
      const updatedState = { ...currentArticle, isArticleActive: false };
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/author-api/articles/${currentArticle.articleId}`,
        updatedState,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }

  async function restoreArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      
      const updatedState = { ...currentArticle, isArticleActive: true };
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/author-api/articles/${currentArticle.articleId}`,
        updatedState,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error("Error restoring article:", error);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Unknown date";
    
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const categoryColors = {
    'programming': '#f59e0b', // Amber
    'AI&ML': '#10b981',       // Emerald
    'database': '#3b82f6',    // Blue
    'web development': '#8b5cf6', // Purple
    'cybersecurity': '#ec4899' // Pink
  };

  return (
    <div className="article-page-container">
      {editArticleStatus === false ? (
        <>
          <div className="article-view-container">
            <div className="article-wrapper">
              {/* Article Header */}
              <div className="article-header">
                {/* Category Badge */}
                <div 
                  className="category-badge"
                  style={{ backgroundColor: categoryColors[currentArticle.category] || '#6366f1' }}
                >
                  {currentArticle.category}
                </div>
                
                <h1 className="article-title">{currentArticle.title}</h1>
                
                <div className="article-meta">
                  <div className="author-info">
                    {currentArticle.authorData?.profileImageUrl ? (
                      <img
                        src={currentArticle.authorData.profileImageUrl}
                        className="author-image"
                        alt={currentArticle.authorData.nameOfAuthor}
                      />
                    ) : (
                      <div className="author-avatar">
                        {currentArticle.authorData?.nameOfAuthor?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="author-details">
                      <h5 className="author-name">{currentArticle.authorData?.nameOfAuthor || 'Anonymous'}</h5>
                      <div className="date-info">
                        <span>Published: {formatDate(currentArticle.dateOfCreation)}</span>
                        {currentArticle.dateOfModification && currentArticle.dateOfModification !== currentArticle.dateOfCreation && (
                          <span className="updated-date">Updated: {formatDate(currentArticle.dateOfModification)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Author Actions */}
                  {currentUser?.role === "author" && (
                    <div className="author-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={enableEdit}
                        title="Edit Article"
                      >
                        <FaEdit size={20} />
                        <span>Edit</span>
                      </button>
                      
                      {currentArticle.isArticleActive ? (
                        <button
                          className="action-button delete-button"
                          onClick={deleteArticle}
                          title="Delete Article"
                        >
                          <MdDelete size={22} />
                          <span>Delete</span>
                        </button>
                      ) : (
                        <button
                          className="action-button restore-button"
                          onClick={restoreArticle}
                          title="Restore Article"
                        >
                          <MdRestore size={22} />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Status Badge for Deleted Articles */}
                {currentArticle.isArticleActive === false && (
                  <div className="article-status-badge">
                    This article has been archived
                  </div>
                )}

              </div>
              
              {/* Article Content */}
              <div className="article-content">
                {currentArticle.content}
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="comments-section">
              <div className="comments-container">
                <h3 className="comments-title">
                  Comments {currentArticle.comments && currentArticle.comments.length > 0 && `(${currentArticle.comments.length})`}
                </h3>
                
                {/* Comment List */}
                <div className="comments-list">
                  {!currentArticle.comments || currentArticle.comments.length === 0 ? (
                    <div className="no-comments">
                      <p className="no-comments-text">No comments yet</p>
                      {currentUser?.role === "user" && (
                        <button 
                          className="comment-button"
                          onClick={() => setShowCommentForm(true)}
                        >
                          Be the first to comment
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="comments-grid">
                      {currentArticle.comments.map((commentObj, index) => (
                        <div key={commentObj._id || index} className="comment-card">
                          <div className="comment-header">
                            <div className="comment-avatar">
                              {commentObj.nameOfUser?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="comment-meta">
                              <h6 className="comment-author">{commentObj.nameOfUser || 'Anonymous'}</h6>
                              {commentObj.dateAdded && (
                                <span className="comment-date">{formatDate(commentObj.dateAdded)}</span>
                              )}
                            </div>
                          </div>
                          <p className="comment-text">{commentObj.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Comment Status */}
                {commentStatus && (
                  <div className="comment-status-alert" role="alert">
                    {commentStatus}
                  </div>
                )}
                
                {/* Add Comment UI */}
                {currentUser && currentUser.role === "user" && (
                  <>
                    {!showCommentForm && (currentArticle.comments && currentArticle.comments.length > 0) && (
                      <button 
                        className="comment-button"
                        onClick={() => setShowCommentForm(true)}
                      >
                        Add a comment
                      </button>
                    )}
                    
                    {showCommentForm && (
                      <form onSubmit={handleSubmit(addComment)} className="comment-form">
                        <div className="comment-form-container">
                          <textarea
                            rows="3"
                            placeholder="Share your thoughts..."
                            {...register("comment", { required: true })}
                            className="comment-textarea"
                          ></textarea>
                          <div className="comment-form-actions">
                            <button 
                              type="button" 
                              className="cancel-comment-button"
                              onClick={() => {
                                setShowCommentForm(false);
                                reset();
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="post-comment-button"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Edit Form */
        <div className="edit-article-container">
          <div className="edit-article-wrapper">
            <div className="edit-form-card">
              <h2 className="edit-form-title">Edit Article</h2>
              <form onSubmit={handleSubmit(onSave)}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    defaultValue={currentArticle.title}
                    {...register("title", { required: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    id="category"
                    className="form-select"
                    defaultValue={currentArticle.category}
                  >
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI & Machine Learning</option>
                    <option value="database">Database</option>
                    <option value="web development">Web Development</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    {...register("content", { required: true })}
                    className="form-textarea"
                    id="content"
                    rows="15"
                    defaultValue={currentArticle.content}
                  ></textarea>
                </div>
                
                <div className="edit-form-actions">
                  <button 
                    type="button" 
                    className="cancel-edit-button"
                    onClick={() => setEditArticleStatus(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;