import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';
import './Courses.css';

export default function Courses() {
  const { bookmarks, toggleBookmark } = useContext(AppContext);

  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [certificateFilter, setCertificateFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    fetch('./data/courses.json')
      .then(res => res.json())
      .then(data => {
        setCoursesList(data);
        setLoading(false);
      })
      .catch(() => {
        setCoursesList([]);
        setLoading(false);
      });
  }, []);

  // Extract unique categories and platforms
  const categories = ['all', ...new Set(coursesList.map(item => item.category).filter(Boolean))];
  const platforms = ['all', ...new Set(coursesList.map(item => item.platform).filter(Boolean))];

  // Filtering logic
  const filteredList = coursesList.filter(item => {
    const searchVal = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchVal || 
      (item.courseName || '').toLowerCase().includes(searchVal) ||
      (item.platform || '').toLowerCase().includes(searchVal) ||
      (item.category || '').toLowerCase().includes(searchVal) ||
      (item.description || '').toLowerCase().includes(searchVal) ||
      (item.instructor && item.instructor.toLowerCase().includes(searchVal));

    const matchesCategory = categoryFilter === 'all' || (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || (item.platform && item.platform.toLowerCase() === platformFilter.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || (item.difficulty && item.difficulty.toLowerCase() === difficultyFilter.toLowerCase());

    let matchesCertificate = true;
    if (certificateFilter !== 'all') {
      const hasFreeCert = item.certificate && (
        item.certificate.toLowerCase().includes('free certification') || 
        item.certificate.toLowerCase().includes('100% free') ||
        item.certificate.toLowerCase() === 'free'
      );
      matchesCertificate = (certificateFilter === 'free') ? hasFreeCert : !hasFreeCert;
    }

    let matchesDuration = true;
    if (durationFilter !== 'all') {
      const durStr = (item.duration || '').toLowerCase();
      const hoursMatch = durStr.match(/(\d+)\s*hour/);
      const weeksMatch = durStr.match(/(\d+)\s*week/);
      const monthsMatch = durStr.match(/(\d+)\s*month/);

      let hours = 0;
      if (hoursMatch) hours = parseInt(hoursMatch[1]);
      else if (weeksMatch) hours = parseInt(weeksMatch[1]) * 10;
      else if (monthsMatch) hours = parseInt(monthsMatch[1]) * 40;
      else if (durStr.includes('hour')) hours = 5;

      if (durationFilter === 'short') {
        matchesDuration = hours < 10;
      } else if (durationFilter === 'medium') {
        matchesDuration = hours >= 10 && hours <= 40;
      } else {
        matchesDuration = hours > 40;
      }
    }

    let matchesBranch = true;
    if (branchFilter !== 'all') {
      const itemCat = (item.category || '').toLowerCase();
      let itemBranch = 'general';

      if (['programming', 'web development', 'artificial intelligence', 'data science', 'cloud computing', 'cyber security'].includes(itemCat)) {
        itemBranch = 'cs';
      } else if (itemCat === 'electrical engineering') {
        itemBranch = 'electrical';
      } else if (itemCat === 'mechanical engineering') {
        itemBranch = 'mechanical';
      } else if (itemCat === 'civil engineering') {
        itemBranch = 'civil';
      }

      matchesBranch = itemBranch === branchFilter;
    }

    return matchesSearch && matchesCategory && matchesPlatform && matchesDifficulty && matchesCertificate && matchesDuration && matchesBranch;
  });

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="section-title">Free Courses</h1>
          <p className="text-secondary">Explore top-quality free courses, certification classes, and online lectures on StudentHub.</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <section className="glass-panel search-toolbar-panel">
        <div className="search-box-container">
          <SvgIcon name="search" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search courses, certificates or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters-container">
          <select className="form-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select className="form-input" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="all">All Platforms</option>
            {platforms.filter(p => p !== 'all').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select className="form-input" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select className="form-input" value={certificateFilter} onChange={(e) => setCertificateFilter(e.target.value)}>
            <option value="all">All Certificates</option>
            <option value="free">Free Certificate</option>
            <option value="audit">Free Audit Only</option>
          </select>

          <select className="form-input" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
            <option value="all">All Durations</option>
            <option value="short">Short (&lt; 10 hrs)</option>
            <option value="medium">Medium (10 - 40 hrs)</option>
            <option value="long">Long (&gt; 40 hrs)</option>
          </select>

          <select className="form-input" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="cs">Computer Science / IT</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
          </select>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="courses-grid">
        {loading ? (
          <>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
          </>
        ) : filteredList.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <p className="text-lg weight-semibold">No courses found matching your criteria.</p>
          </div>
        ) : (
          filteredList.map(item => {
            const isBookmarked = (bookmarks.courses || []).includes(item.id);

            return (
              <div className="card card-lift" key={item.id}>
                <div className="course-card-image-container" style={{ position: 'relative' }}>
                  <img src={item.image} alt={item.courseName} className="course-card-image" />
                  <span className="badge badge-primary" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    {item.category}
                  </span>
                </div>
                <div className="card-header" style={{ marginTop: '8px' }}>
                  <div className="flex align-center gap-sm" style={{ minWidth: 0, flex: 1 }}>
                    <div className="card-logo-container" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img 
                        src={item.logo} 
                        alt={item.platform} 
                        style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="card-logo-fallback" style={{ display: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
                        {item.platform.charAt(0)}
                      </div>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 className="card-title text-base" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '2px' }}>
                        {item.courseName}
                      </h3>
                      <p className="card-subtitle">{item.platform}</p>
                    </div>
                  </div>
                  <button 
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark('courses', item.id)}
                    title="Bookmark"
                  >
                    <SvgIcon name={isBookmarked ? 'bookmarkFilled' : 'bookmark'} />
                  </button>
                </div>
                <div className="card-body">
                  <p className="text-xs text-muted" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px' }}>
                    {item.description}
                  </p>
                  <div className="card-info-item" style={{ marginTop: '8px' }}>
                    <SvgIcon name="clock" size={14} />
                    <span>{item.duration}</span>
                    <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>{item.difficulty}</span>
                  </div>
                  <div className="card-info-item" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>Certificate:</strong> {item.certificate}
                  </div>
                  <div className="card-info-item" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>Language:</strong> {item.language}
                    {item.instructor && (
                      <span style={{ marginLeft: 'auto' }}>
                        <strong>Instructor:</strong> {item.instructor}
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-actions" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <a href={item.officialCoursePage} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Start Learning <SvgIcon name="apply" size={14} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </section>

      <Footer />
    </>
  );
}
