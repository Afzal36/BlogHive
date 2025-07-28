import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArticleContext } from '../../contexts/ArticleContext';
import './Articles.css';

function Articles({ contextSource = 'author' }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const { searchTerm, filters } = useContext(ArticleContext);

  async function getArticles() {
    setLoading(true);
    try {
      const token = await getToken();
      const endpoint = contextSource === 'author' 
        ? `${import.meta.env.VITE_API_URL}/author-api/articles`
        : `${import.meta.env.VITE_API_URL}/user-api/articles`;
        
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }

  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, [contextSource]);

  useEffect(() => {
    if (articles.length > 0) {
      let result = [...articles];
      
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        result = result.filter(article => 
          article.title?.toLowerCase().includes(lowercasedSearch) || 
          article.content?.toLowerCase().includes(lowercasedSearch) ||
          (article.authorData?.nameOfAuthor && 
            article.authorData.nameOfAuthor.toLowerCase().includes(lowercasedSearch))
        );
      }
      
      const activeFilters = Object.entries(filters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeFilters.length > 0) {
        result = result.filter(article => {
          const category = article.category ? article.category.toLowerCase() : '';
          
          const categoryMapping = {
            'programming': 'programming',
            'aiml': 'ai & ml',
            'database': 'database',
            'webDevelopment': 'web development',
            'cybersecurity': 'cybersecurity'
          };
          
          return activeFilters.some(filter => 
            category.includes(categoryMapping[filter].toLowerCase())
          );
        });
      }
      
      setFilteredArticles(result);
    }
  }, [searchTerm, filters, articles]);

  function getCategoryBadgeColor(category) {
    if (!category) return '#2c6faf'; // Default blue
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('programming')) {
      return '#007bff';  // Bright Blue for Programming
    } else if (categoryLower.includes('ai') || categoryLower.includes('ml')) {
      return '#28a745';  // Green for AI & ML
    } else if (categoryLower.includes('database')) {
      return '#dc3545';  // Red for Database
    } else if (categoryLower.includes('web')) {
      return '#17a2b8';  // Teal for Web Development
    } else if (categoryLower.includes('cyber')) {
      return '#6f42c1';  // Purple for Cybersecurity
    }
    return '#2c6faf';  // Default blue
  }

  const SkeletonCards = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="article-card" key={`skeleton-${item}`}>
          <div className="skeleton-card">
            <div className="skeleton-badge"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-excerpt"></div>
            <div className="skeleton-link"></div>
            <div className="skeleton-footer">
              <div className="skeleton-author">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-name"></div>
              </div>
              <div className="skeleton-date"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const NoResults = () => (
    <div className="no-data-message">
      <h3>No articles found</h3>
      <p>Sorry, no articles match your current search criteria.</p>
    </div>
  );

  return (
    <div className='articles-container'>
      {error && <p className='error-message'>{error}</p>}
      
      <div className='articles-grid'>
        {loading ? (
          <SkeletonCards />
        ) : (
          <>
            {filteredArticles.length === 0 ? (
              <NoResults />
            ) : (
              filteredArticles.map((articleObj) => (
                <div className='article-card' key={articleObj.articleId}>
                  <div className="article-card-inner">
                    <div className="category-label">
                      <span 
                        className="category-badge" 
                        style={{ background: getCategoryBadgeColor(articleObj.category) }}
                      >
                        {articleObj.category || 'programming'}
                      </span>
                    </div>
                    <h2 className="article-title">{articleObj.title}</h2>
                    <p className="article-excerpt">
                      {articleObj.content.substring(0, 120) + "..."}
                    </p>
                    <div className="read-more-link" onClick={() => gotoArticleById(articleObj)}>
                      <span>Read article</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </div>
                    <div className="article-footer">
                      <div className="author-info">
                        <div className="author-avatar">
                          {articleObj.authorData?.nameOfAuthor?.charAt(0) || 'A'}
                        </div>
                        <span className="author-name">
                          {articleObj.authorData?.nameOfAuthor || 'Anonymous'}
                        </span>
                      </div>
                      <span className="modified-date">
                        {articleObj.dateOfModification || 'No date'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Articles;