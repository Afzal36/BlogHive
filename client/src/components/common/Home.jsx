import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
// Import React Icons
import { FaBook, FaPen, FaGithub, FaInstagram, FaLinkedin, FaReact, FaNodeJs, FaSpinner } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiBootstrap, SiClerk} from 'react-icons/si';
import { MdSecurity, MdOutlineContentPaste, MdDashboard} from 'react-icons/md';
import { BsFillHexagonFill } from "react-icons/bs";
import './Home.css';
import { FaMedapps } from "react-icons/fa";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function onSelectRole(role) {
    // Check if user is inactive first
    if (currentUser && currentUser.isActive === false) {
      return; // Don't proceed if user is inactive
    }
    
    setError('');
    setIsSubmitting(true);
    
    const selectedRole = role;
    const updatedUser = { ...currentUser, role: selectedRole };
    
    try {
      const endpoint = selectedRole === 'author' 
        ? `${import.meta.env.VITE_API_URL}/author-api/author`
        : `${import.meta.env.VITE_API_URL}/user-api/user`;
      
      const res = await axios.post(endpoint, updatedUser);
      const { message, payload } = res.data;
      
      if (message === selectedRole) {
        setCurrentUser({ ...currentUser, ...payload });
        localStorage.setItem("currentuser", JSON.stringify(payload));
      } else {
        setError(message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const scrollToFooter = (e) => {
    e.preventDefault();
    document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Check if the user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isSignedIn && user) {
        setIsChecking(true);
        try {
          // First set the basic user info
          const userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0].emailAddress,
            profileImageUrl: user.imageUrl,
          };
          
          setCurrentUser({
            ...currentUser,
            ...userInfo
          });
          
          // Check if user exists in the database and if they are an admin
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin-api/check-admin?email=${userInfo.email}`
          );
          
          if (response.data.isAdmin) {
            // User is an admin, set the user in context and navigate
            const updatedUserInfo = {
              ...userInfo,
              role: response.data.role,
              userId: response.data.userId
            };
            
            setCurrentUser({
              ...currentUser,
              ...updatedUserInfo
            });
            
            // Save to localStorage with expiration time (e.g., 1 hour)
            const expiresAt = new Date().getTime() + (60 * 60 * 1000);
            localStorage.setItem("currentUser", JSON.stringify({
              ...updatedUserInfo,
              expiresAt
            }));
            
            navigate('/admin');
          } else {
            // User exists but is not an admin
            localStorage.setItem("currentUser", JSON.stringify({
              ...userInfo,
              role: 'user'
            }));
          }
        } catch (err) {
          console.error("Admin check error:", err);
          // Clear any admin status if there was an error
          const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
          if (storedUser.role === 'admin') {
            localStorage.setItem("currentUser", JSON.stringify({
              ...storedUser,
              role: 'user'
            }));
          }
        } finally {
          setIsChecking(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setIsChecking(false);
        // Clear user data when signed out
        localStorage.removeItem("currentUser");
      }
    };
    
    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);
  
  useEffect(() => {
    // Don't navigate if user is inactive
    if (currentUser?.isActive === false) {
      return;
    }
    
    // Check various roles and navigate
    if (currentUser?.role === "admin" && error.length === 0) {
      navigate('/admin');
    } else if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    } else if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);


  if (!isSignedIn) {
    return (
      <>
        {/* Hero Banner - Redesigned */}
        <section className="hero-section">
          <div className="gradient-overlay"></div>
          <div className="particles-background"></div>
          <div className="hero-pattern"></div>
          <div className="accent-circle accent-circle-1"></div>
          <div className="accent-circle accent-circle-2"></div>
          
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center hero-content">
                <h1 className="hero-title">
                  <FaMedapps className="logo-icon" color='#3A8BC4' size={80}/>
                  <span className="hero-title-blog">Blog</span>
                  <span className="hero-title-hive">Hive</span>
                </h1>
                
                <div className="hero-description-container">
                  <p className="hero-description">
                    Where ideas take flight and creative minds connect. Discover, create, and share 
                    thought-provoking content in our vibrant community of writers and readers.
                  </p>
                  
                  <div className="decorative-line"></div>
                </div>
                
                <div className="hero-buttons">
                  <button className="btn btn-lg get-started-btn btn-light" onClick={()=>{navigate('/signin')}}>Get Started</button>
                  <button className="btn btn-lg learn-more-btn btn-light" onClick={scrollToFooter}>Learn More</button>
                </div>
                
                <div className="scroll-indicator">
                  <div className="scroll-indicator-content">
                    <span>Scroll to explore</span><br/>
                    <IoIosArrowDown className="scroll-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Redesigned */}
        <section className="features-section">
          <div className="features-pattern"></div>
          <div className="container py-5">
            <div className="text-center mb-5">
              <div className="section-label">Why Choose BlogHive</div>
              <h2 className="section-title">Elevate Your Digital Voice</h2>
              <p className="section-subtitle">An innovative platform designed for modern creators and readers</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="feature-card author-card">
                  <div className="feature-glow"></div>
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon author-icon">
                      <FaPen />
                    </div>
                    <h3 className="feature-title">For Writers</h3>
                    <p className="feature-description">Powerful creation tools with SEO optimization, advanced analytics, and audience insights to amplify your reach.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card reader-card">
                  <div className="feature-glow"></div>
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon reader-icon">
                      <FaBook />
                    </div>
                    <h3 className="feature-title">For Readers</h3>
                    <p className="feature-description">Curated content discovery, personalized recommendations, and interactive discussions with your favorite creators.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card admin-card">
                  <div className="feature-glow"></div>
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon admin-icon">
                      <MdDashboard />
                    </div>
                    <h3 className="feature-title">For Admins</h3>
                    <p className="feature-description">Comprehensive analytics dashboard with intuitive management tools and content moderation capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <div className="feature-card-horizontal">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon-container me-3">
                        <MdSecurity className="feature-icon-small" />
                      </div>
                      <h3 className="feature-title-horizontal">Premium Security</h3>
                    </div>
                    <p className="feature-description">End-to-end encryption for all communications, multi-factor authentication, and rigorous data protection protocols.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="feature-card-horizontal">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon-container me-3">
                        <MdOutlineContentPaste className="feature-icon-small" />
                      </div>
                      <h3 className="feature-title-horizontal">Content Management</h3>
                    </div>
                    <p className="feature-description">Intuitive tools for creating, scheduling, and organizing your content library with detailed performance analytics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section - Redesigned */}
        <section className="tech-section">
          <div className="tech-pattern"></div>
          <div className="container py-5">
            <div className="text-center mb-5">
              <div className="section-label">Powered By</div>
              <h2 className="section-title">Cutting-Edge Technology</h2>
              <p className="section-subtitle">Built with state-of-the-art tools for reliability and performance</p>
            </div>
            
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="tech-showcase">
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <FaReact className="tech-icon react-icon" />
                    </div>
                    <p className="tech-name">React</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <FaNodeJs className="tech-icon node-icon" />
                    </div>
                    <p className="tech-name">Node.js</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <SiExpress className="tech-icon express-icon" />
                    </div>
                    <p className="tech-name">Express</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <SiMongodb className="tech-icon mongodb-icon" />
                    </div>
                    <p className="tech-name">MongoDB</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <SiBootstrap className="tech-icon bootstrap-icon" />
                    </div>
                    <p className="tech-name">Bootstrap</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <SiClerk className="tech-icon clerk-icon" />
                    </div>
                    <p className="tech-name">Clerk</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <div className="tech-icon-card">
                      <FaGithub className="tech-icon github-icon" />
                    </div>
                    <p className="tech-name">GitHub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Redesigned */}
        <footer className="footer-section">
          <div className="footer-waves">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
          </div>
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-3">
                <div className="footer-brand">
                  <BsFillHexagonFill className="footer-logo-icon" />
                  <h4 className="footer-logo-text">BlogHive</h4>
                </div>
                <p className="footer-description">A vibrant platform for writers, readers, and knowledge seekers to connect, share, and grow together.</p>
              </div>
              <div className="col-lg-3">
                <h5 className="footer-heading">Quick Links</h5>
                <ul className="list-unstyled footer-links">
                  <li className="footer-link-item"><a href="#" className="footer-link">Home</a></li>
                  <li className="footer-link-item"><a href="#" className="footer-link">Features</a></li>
                  <li className="footer-link-item"><a href="#" className="footer-link">About</a></li>
                  <li className="footer-link-item"><a href="#" className="footer-link">Contact</a></li>
                </ul>
              </div>
              <div className="col-lg-3">
                <h5 className="footer-heading">Other Projects</h5>
                <ul className="list-unstyled footer-links">
                  <li className="footer-link-item"><a href="https://lumora-web.netlify.app/" className="footer-link">LUMORA</a></li>
                  <li className="footer-link-item"><a href="#" className="footer-link">PROJ_2</a></li>
                </ul>
              </div>
              <div className="col-lg-3">
                <h5 className="footer-heading">Contact</h5>
                <p className="footer-contact">Email: shaikafzalelahi@gmail.com</p>
                <div className="social-icons">
                  <a href="" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <div className="social-icon-container">
                      <FaGithub className="social-icon" />
                    </div>
                  </a>
                  <a href="" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <div className="social-icon-container">
                      <FaInstagram className="social-icon" />
                    </div>
                  </a>
                  <a href="" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <div className="social-icon-container">
                      <FaLinkedin className="social-icon" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-divider"></div>
            <div className="row">
              <div className="col">
                <p className="copyright-text">
                  &copy; {new Date().getFullYear()} BlogHive. All rights reserved. Designed by Shaik Afzal Elahi
                </p>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }

  // Show loader while checking admin status
  if (isChecking) {
    return (
      <div className="loader-container">
        <div className="spinner-container">
          <div className="spinner-ring"></div>
          <p className="spinner-text">Checking user status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-selection-container">
      <div className="role-selection-pattern"></div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <div className="role-selection-card">
              {user && (
                <div className="role-selection-header">
                  <div className="text-center">
                    <div className="user-image-container">
                      <img 
                        src={user.imageUrl} 
                        className="user-profile-image"
                        alt={user.firstName}
                      />
                    </div>
                    <h2 className="user-name">{user.firstName} {user.lastName}</h2>
                    <p className="user-email">{user.emailAddresses[0].emailAddress}</p>
                  </div>
                </div>
              )}
              
              <div className="role-selection-body">
                <h3 className="role-selection-title">Choose Your Experience</h3>
                
                {error && (
                  <div className="alert alert-danger custom-alert" role="alert">
                    {error}
                  </div>
                )}
                
                {currentUser && currentUser.isActive === false ? (
                  <div className="alert alert-danger custom-alert" role="alert">
                    <h4 className="alert-heading">Account Temporarily Blocked</h4>
                    <p>Your account has been temporarily blocked by an admin. Please contact the administrator for assistance.</p>
                    <hr />
                    <p className="mb-0">Email: support@bloghive.com</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div 
                        className={`role-option author-role ${isSubmitting ? 'disabled' : ''}`}
                        onClick={() => !isSubmitting && onSelectRole('author')}
                      >
                        <div className="role-option-body">
                          <div className="role-icon-container">
                            <div className="role-icon author-role-icon">
                              <FaPen />
                            </div>
                          </div>
                          <h4 className="role-name">Creator</h4>
                          <p className="role-description">Share your voice and inspire others with your unique perspective</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div 
                        className={`role-option reader-role ${isSubmitting ? 'disabled' : ''}`}
                        onClick={() => !isSubmitting && onSelectRole('user')}
                      >
                        <div className="role-option-body">
                          <div className="role-icon-container">
                            <div className="role-icon reader-role-icon">
                              <FaBook />
                            </div>
                          </div>
                          <h4 className="role-name">Explorer</h4>
                          <p className="role-description">Discover amazing content and connect with inspiring creators</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isSubmitting && (
                  <div className="spinner-container text-center mt-4">
                    <div className="spinner-ring"></div>
                    <p className="spinner-text">Processing your selection...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;