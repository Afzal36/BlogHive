import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { ArticleContext } from '../../contexts/ArticleContext';
import './UserProfile.css';

function UserProfile() {
  const {
    searchTerm,
    filterOpen,
    mobileMenuOpen,
    filters,
    activeFilterCount,
    setFilterOpen,
    setMobileMenuOpen,
    handleSearch,
    handleFilterChange,
    clearAllFilters
  } = useContext(ArticleContext);

  return (
    <div className='UserProfile'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div className="container-fluid nav-container">
          <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </div>
          
          <div className={`nav-section ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink 
                  to="articles" 
                  className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className={`search-filter-section ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-button">
                
              </button>
            </div>
            
            <div className="filter-container">
              <button 
                className={`filter-button ${filterOpen ? 'active' : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
                data-testid="filter-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.921L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                <span>Categories</span>
                {activeFilterCount > 0 && (
                  <span className="filter-count" data-testid="filter-count">{activeFilterCount}</span>
                )}
              </button>
              
              {filterOpen && (
                <div className="filter-dropdown" data-testid="filter-dropdown">
                  <div className="filter-header">
                    <span>Filter by Category</span>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="programming" 
                      checked={filters.programming}
                      onChange={() => handleFilterChange('programming')}
                      data-testid="filter-programming"
                    />
                    <label htmlFor="programming">Programming</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="aiml" 
                      checked={filters.aiml}
                      onChange={() => handleFilterChange('aiml')}
                      data-testid="filter-aiml"
                    />
                    <label htmlFor="aiml">AI & ML</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="database" 
                      checked={filters.database}
                      onChange={() => handleFilterChange('database')}
                      data-testid="filter-database"
                    />
                    <label htmlFor="database">Database</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="webDevelopment" 
                      checked={filters.webDevelopment}
                      onChange={() => handleFilterChange('webDevelopment')}
                      data-testid="filter-webdev"
                    />
                    <label htmlFor="webDevelopment">Web Development</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="cybersecurity" 
                      checked={filters.cybersecurity}
                      onChange={() => handleFilterChange('cybersecurity')}
                      data-testid="filter-cybersecurity"
                    />
                    <label htmlFor="cybersecurity">Cybersecurity</label>
                  </div>
                  
                  {activeFilterCount > 0 && (
                    <div className="filter-actions">
                      <button 
                        className="clear-filters"
                        onClick={clearAllFilters}
                        data-testid="clear-filters"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;