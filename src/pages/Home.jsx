import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchEngine } from '../services/search';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('search') || '';

  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Trigger search on query change
  useEffect(() => {
    if (query) {
      setLoadingSearch(true);
      SearchEngine.query(query)
        .then(results => {
          setSearchResults(results);
          setLoadingSearch(false);
        })
        .catch(() => {
          setSearchResults([]);
          setLoadingSearch(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const clearSearch = () => {
    setSearchParams({});
  };

  const navigateToSection = (url) => {
    navigate(url);
  };

  // Render search results view
  if (query) {
    return (
      <div className="homepage-container">
        <section className="search-results-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title text-2xl weight-bold" id="search-query-info">
                {loadingSearch ? 'Searching...' : `Found ${searchResults.length} result(s) for "${query}"`}
              </h2>
              <p className="text-secondary text-sm">Unified search result matching index entries</p>
            </div>
            <button className="btn btn-glass" onClick={clearSearch}>✕ Clear Results</button>
          </div>

          {loadingSearch ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
              <p className="text-lg">Searching databases...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
              <p className="text-lg weight-semibold">No matches found.</p>
              <p className="text-sm text-muted">Try searching with a different keyword like "Google", "Python", or "Harvard".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="search-results-grid">
              {searchResults.map((hit, idx) => {
                let badgeClass = 'badge-primary';
                if (hit.type === 'internship') badgeClass = 'badge-secondary';
                if (hit.type === 'course') badgeClass = 'badge-success';
                if (hit.type === 'roadmap') badgeClass = 'badge-warning';

                return (
                  <div className="card card-lift" key={idx}>
                    <div className="card-header">
                      <div>
                        <span className={`badge ${badgeClass}`} style={{ marginBottom: '8px' }}>{hit.type}</span>
                        <h3 className="card-title">{hit.title}</h3>
                        <p className="card-subtitle">{hit.subtitle}</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="text-sm text-secondary">{hit.description}</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-glass" onClick={() => navigateToSection(hit.url)}>Go to section</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <Footer />
      </div>
    );
  }  // Render normal homepage view
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-grid-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">One Platform for<br />Every Student</h1>
          <p className="hero-description">Elevating students' potential through smart matching algorithms, tailored courses, and career blueprints.</p>
          <div className="flex gap-sm wrap" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={() => {
              const el = document.querySelector('.saas-services-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Opportunities
            </button>
            <button className="btn btn-glass" onClick={() => navigateToSection('/assistant')}>
              AI Career Assistant
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="trust-badges-grid">
            <div className="trust-badge-item">
              <span className="trust-badge-icon">✓</span> Government Verified
            </div>
            <div className="trust-badge-item">
              <span className="trust-badge-icon">✓</span> 5000+ Opportunities
            </div>
            <div className="trust-badge-item">
              <span className="trust-badge-icon">✓</span> Free Platform
            </div>
            <div className="trust-badge-item">
              <span className="trust-badge-icon">✓</span> Daily Updated
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="ai-mentor-container">
            <div className="floating-tag holo-scholarships">🎓</div>
            <div className="floating-tag holo-internships">💼</div>
            <div className="floating-tag holo-resume">📄</div>
            <div className="floating-tag holo-courses">📚</div>
            <div className="floating-tag holo-roadmaps">🧭</div>
            <svg className="robot-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="body-silver" x1="100" y1="150" x2="300" y2="350" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#e2e8f0" />
                  <stop offset="1" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="body-dark" x1="150" y1="200" x2="250" y2="350" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#475569" />
                  <stop offset="1" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="glow-blue" x1="100" y1="100" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="accent-purple" x1="150" y1="100" x2="250" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#c084fc" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <ellipse cx="200" cy="345" rx="110" ry="25" fill="url(#glow-blue)" opacity="0.1" />
              <ellipse cx="200" cy="345" rx="80" ry="18" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.4" strokeDasharray="6 4" />
              <ellipse cx="200" cy="345" rx="45" ry="10" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.3" />
              <path d="M140 345 L170 190 H230 L260 345 Z" fill="url(#glow-blue)" opacity="0.04" />

              <g className="robot-float-group">
                <rect x="190" y="210" width="20" height="25" rx="4" fill="url(#body-dark)" />
                <rect x="192" y="215" width="16" height="6" rx="2" fill="#38bdf8" filter="url(#neon-glow)" />

                <path d="M130 240 C130 220, 270 220, 270 240 L250 320 C250 330, 150 330, 150 320 Z" fill="url(#body-dark)" opacity="0.9" />
                <path d="M140 235 C140 225, 260 225, 260 235 L240 310 C240 318, 160 318, 160 310 Z" fill="url(#body-silver)" />
                
                <circle cx="200" cy="270" r="16" fill="url(#body-dark)" />
                <circle cx="200" cy="270" r="10" fill="#38bdf8" filter="url(#neon-glow)" className="core-breath-glow" />
                
                <circle cx="125" cy="245" r="14" fill="url(#accent-purple)" />
                <circle cx="275" cy="245" r="14" fill="url(#accent-purple)" />

                <path d="M115 250 L95 295 L110 320" stroke="url(#body-silver)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M285 250 L310 290 L275 320" stroke="url(#body-silver)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                
                <circle cx="110" cy="320" r="4" fill="#38bdf8" filter="url(#neon-glow)" />
                <circle cx="275" cy="320" r="4" fill="#38bdf8" filter="url(#neon-glow)" />

                <rect x="134" y="145" width="10" height="24" rx="4" fill="url(#accent-purple)" />
                <rect x="256" y="145" width="10" height="24" rx="4" fill="url(#accent-purple)" />
                <circle cx="139" cy="157" r="3" fill="#38bdf8" />
                <circle cx="261" cy="157" r="3" fill="#38bdf8" />

                <rect x="140" y="115" width="120" height="95" rx="40" fill="url(#body-silver)" />
                <rect x="150" y="135" width="100" height="36" rx="18" fill="url(#body-dark)" />
                <rect x="165" y="146" width="70" height="14" rx="7" fill="#38bdf8" filter="url(#neon-glow)" className="visor-eyes" />
                <path d="M155 190 Q175 195 200 190 Q225 195 245 190" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
              </g>

              <ellipse cx="200" cy="190" rx="90" ry="12" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.35" className="console-ring-1" />
              <ellipse cx="200" cy="190" rx="110" ry="16" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.2" className="console-ring-2" strokeDasharray="10 5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="feature-cards-section" style={{ marginTop: '24px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title text-2xl weight-bold">Quick Services</h2>
          <p className="text-secondary" style={{ maxWidth: '600px', marginTop: '8px' }}>Access our student tools and resources directly without any account constraints.</p>
        </div>
        
        <div className="saas-services-grid">
          <div className="saas-service-card" onClick={() => navigateToSection('/scholarships')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                🎓
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">Scholarships</h3>
              <p className="saas-card-desc">Explore merit funds, private grants, and study fellowships.</p>
            </div>
          </div>

          <div className="saas-service-card" onClick={() => navigateToSection('/internships')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                💼
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">Internships</h3>
              <p className="saas-card-desc">Find remote, onsite, and hybrid corporate entry positions.</p>
            </div>
          </div>

          <div className="saas-service-card" onClick={() => navigateToSection('/courses')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                📚
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">Free Courses</h3>
              <p className="saas-card-desc">Upskill with certification programs from top universities.</p>
            </div>
          </div>

          <div className="saas-service-card" onClick={() => navigateToSection('/roadmaps')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                🧭
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">Career Roadmaps</h3>
              <p className="saas-card-desc">Follow step-by-step paths to learn industry specializations.</p>
            </div>
          </div>

          <div className="saas-service-card" onClick={() => navigateToSection('/resume')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                📄
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">Resume Builder</h3>
              <p className="saas-card-desc">Create clean, professional, ATS-friendly resumes in minutes.</p>
            </div>
          </div>

          <div className="saas-service-card" onClick={() => navigateToSection('/assistant')}>
            <div className="saas-card-top">
              <div className="saas-card-icon-wrapper">
                🤖
              </div>
              <div className="saas-card-arrow">
                <SvgIcon name="chevronRight" size={16} />
              </div>
            </div>
            <div className="saas-card-content">
              <h3 className="saas-card-title">AI Career Assistant</h3>
              <p className="saas-card-desc">Get instant advice, placement tips, and skill guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Opportunities Section */}
      <section className="trending-opportunities-section" style={{ marginTop: '24px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title text-2xl weight-bold">Trending Opportunities</h2>
          <p className="text-secondary" style={{ maxWidth: '600px', marginTop: '8px' }}>Newly posted programs and highly trending items across StudentHub.</p>
        </div>

        <div className="trending-grid">
          {/* Latest Scholarships */}
          <div className="trending-column-card">
            <div className="trending-column-header">
              <div className="trending-column-icon-box" style={{ color: 'var(--primary)' }}>🏛</div>
              <h3 className="trending-column-title">Latest Scholarships</h3>
            </div>
            <div className="trending-items-list">
              <div className="trending-item-row">
                <span className="trending-item-title">Generation Google Scholarship (APAC)</span>
                <span className="trending-item-subtitle">Google • Open for Applications</span>
              </div>
              <div className="trending-item-row">
                <span className="trending-item-title">Reliance Foundation UG Scholarship</span>
                <span className="trending-item-subtitle">Reliance Foundation • First Year Students</span>
              </div>
            </div>
            <div className="trending-column-footer">
              <button className="btn btn-glass btn-sm" style={{ width: '100%' }} onClick={() => navigateToSection('/scholarships')}>
                View All
              </button>
            </div>
          </div>

          {/* Latest Internships */}
          <div className="trending-column-card">
            <div className="trending-column-header">
              <div className="trending-column-icon-box" style={{ color: 'var(--secondary)' }}>🏢</div>
              <h3 className="trending-column-title">Latest Internships</h3>
            </div>
            <div className="trending-items-list">
              <div className="trending-item-row">
                <span className="trending-item-title">Tesla Power Electronics Intern</span>
                <span className="trending-item-subtitle">Tesla Motors • Bengaluru (Hybrid)</span>
              </div>
              <div className="trending-item-row">
                <span className="trending-item-title">Microsoft SWE Summer Intern 2026</span>
                <span className="trending-item-subtitle">Microsoft • Hyderabad (On-site)</span>
              </div>
            </div>
            <div className="trending-column-footer">
              <button className="btn btn-glass btn-sm" style={{ width: '100%' }} onClick={() => navigateToSection('/internships')}>
                View All
              </button>
            </div>
          </div>

          {/* Top Free Courses */}
          <div className="trending-column-card">
            <div className="trending-column-header">
              <div className="trending-column-icon-box" style={{ color: 'var(--success)' }}>🎓</div>
              <h3 className="trending-column-title">Top Free Courses</h3>
            </div>
            <div className="trending-items-list">
              <div className="trending-item-row">
                <span className="trending-item-title">Java Programming for Beginners</span>
                <span className="trending-item-subtitle">Helsinki MOOC • 6 Weeks • Certificate</span>
              </div>
              <div className="trending-item-row">
                <span className="trending-item-title">Python for Everybody Specialization</span>
                <span className="trending-item-subtitle">Coursera • 10 Weeks • Financial Aid</span>
              </div>
            </div>
            <div className="trending-column-footer">
              <button className="btn btn-glass btn-sm" style={{ width: '100%' }} onClick={() => navigateToSection('/courses')}>
                View All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Benefits (Statistics Cards) */}
      <section className="student-benefits-section" style={{ marginTop: '24px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title text-2xl weight-bold">Student Benefits</h2>
          <p className="text-secondary" style={{ maxWidth: '600px', marginTop: '8px' }}>Explore how StudentHub empowers thousands of students to learn and secure opportunities worldwide.</p>
        </div>

        <div className="benefits-stats-grid">
          <div className="stat-benefit-card">
            <div className="stat-benefit-icon-box" style={{ color: 'var(--primary)' }}>🏛</div>
            <div className="stat-benefit-info">
              <span className="stat-benefit-number">50+</span>
              <span className="stat-benefit-label">Government Scholarships</span>
            </div>
          </div>

          <div className="stat-benefit-card">
            <div className="stat-benefit-icon-box" style={{ color: 'var(--secondary)' }}>🏢</div>
            <div className="stat-benefit-info">
              <span className="stat-benefit-number">100+</span>
              <span className="stat-benefit-label">Verified Companies</span>
            </div>
          </div>

          <div className="stat-benefit-card">
            <div className="stat-benefit-icon-box" style={{ color: 'var(--accent)' }}>🧭</div>
            <div className="stat-benefit-info">
              <span className="stat-benefit-number">30+</span>
              <span className="stat-benefit-label">Career Roadmaps</span>
            </div>
          </div>

          <div className="stat-benefit-card">
            <div className="stat-benefit-icon-box" style={{ color: 'var(--success)' }}>📚</div>
            <div className="stat-benefit-info">
              <span className="stat-benefit-number">5000+</span>
              <span className="stat-benefit-label">Free Courses</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="ai-banner-section" style={{ marginTop: '24px' }}>
        <div className="ai-banner-container">
          <div className="ai-banner-left">
            <div className="floating-tag" style={{ position: 'relative', fontSize: '3rem', width: '80px', height: '80px', background: 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🤖
            </div>
          </div>
          <div className="ai-banner-right">
            <h2 className="ai-banner-title">Need Career Guidance?</h2>
            <p className="ai-banner-desc">Talk to our AI Career Assistant for instant guidance on placements, custom blueprints, resume reviews, and scholarships.</p>
            <button className="btn btn-primary" onClick={() => navigateToSection('/assistant')}>
              Chat with AI
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
