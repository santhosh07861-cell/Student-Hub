import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';
import './Scholarships.css';
import { fetchScholarships } from '../services/api';

const isRecentlyAdded = (dateString) => {
  if (!dateString) return false;
  const createdDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export default function Scholarships() {

  const { bookmarks, toggleBookmark } = useContext(AppContext);


  const [activeTab, setActiveTab] = useState('government');
  const [governmentList, setGovernmentList] = useState([]);
  const [privateList, setPrivateList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modal details state
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch lists
  useEffect(() => {
    setLoading(true);
    fetchScholarships()
      .then(data => {
        const gov = data.filter(item => item.isGovernment);
        const pvt = data.filter(item => !item.isGovernment);
        setGovernmentList(gov);
        setPrivateList(pvt);
        setLoading(false);
      })
      .catch(() => {
        setGovernmentList([]);
        setPrivateList([]);
        setLoading(false);
      });
  }, []);


  const activeList = activeTab === 'government' ? governmentList : privateList;

  // Filter logic
  const filteredList = activeList.filter(item => {
    const sName = (item.scholarshipName || item.name || '').toLowerCase();
    const sProvider = (item.provider || item.organization || '').toLowerCase();
    const sDesc = (item.description || '').toLowerCase();
    const sElig = (item.eligibility || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query ||
      sName.includes(query) ||
      sProvider.includes(query) ||
      sDesc.includes(query) ||
      sElig.includes(query);

    const catVal = categoryFilter.toLowerCase();
    const matchesCat = catVal === 'all' || 
      (item.category && item.category.toLowerCase().includes(catVal)) || 
      (catVal === 'general' && item.category && item.category.toLowerCase() === 'general');

    const stateVal = stateFilter.toLowerCase();
    const matchesState = stateVal === 'all' ||
      (item.state && item.state.toLowerCase() === stateVal);

    const courseVal = courseFilter.toLowerCase();
    const matchesCourse = courseVal === 'all' ||
      (item.educationLevel && item.educationLevel.toLowerCase() === courseVal);

    return matchesSearch && matchesCat && matchesState && matchesCourse;
  });

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="section-title">Scholarships</h1>
          <p className="text-secondary">Discover Government and Private Scholarships available for Indian students.</p>
        </div>
      </div>

      {/* Modern Tabs Menu */}
      <section className="scholarship-tabs-container w-full px-4">
        <div className="scholarship-tabs flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto p-1.5 rounded-xl sm:rounded-full">
          <button 
            className={`tab-btn w-full sm:w-auto ${activeTab === 'government' ? 'active' : ''}`}
            onClick={() => { setActiveTab('government'); setSelectedItem(null); }}
          >
            🏛 Government Scholarships
          </button>
          <button 
            className={`tab-btn w-full sm:w-auto ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => { setActiveTab('private'); setSelectedItem(null); }}
          >
            🏢 Private Scholarships
          </button>
        </div>
      </section>

      {/* Filters & Search Toolbar */}
      <section className="glass-panel search-toolbar-panel">
        <div className="search-box-container">
          <SvgIcon name="search" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by scholarship name, organization or criteria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters-container">
          <select 
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Category (All)</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="obc">OBC</option>
            <option value="ews">EWS</option>
            <option value="general">General</option>
            <option value="minority">Minority</option>
          </select>
          
          <select 
            className="form-input"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="all">State (All)</option>
            <option value="all india">All India</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="telangana">Telangana</option>
            <option value="andhra pradesh">Andhra Pradesh</option>
          </select>

          <select 
            className="form-input"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">Course (All)</option>
            <option value="engineering">Engineering</option>
            <option value="degree">Degree</option>
            <option value="diploma">Diploma</option>
            <option value="medical">Medical</option>
            <option value="mba">MBA</option>
            <option value="iti">ITI</option>
          </select>
        </div>
      </section>

      {/* Scholarships Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="scholarships-grid">
        {loading ? (
          <>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
          </>
        ) : filteredList.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <p className="text-lg weight-semibold">No scholarships found matching your criteria.</p>
          </div>
        ) : (
          filteredList.map(item => {
            const isBookmarked = (bookmarks.scholarships || []).includes(item.id);
            const sName = item.scholarshipName || item.name || '';
            const sProvider = item.provider || item.organization || '';

            return (
              <div className="card card-lift" key={item.id}>
                <div className="card-header">
                  <div className="flex align-center gap-sm" style={{ minWidth: 0, flex: 1 }}>
                    <div className="card-logo-container">
                      <img 
                        src={item.logo} 
                        alt={sProvider} 
                        className="card-logo-img" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="card-logo-fallback" style={{ display: 'none' }}>
                        {sProvider.charAt(0)}
                      </div>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 className="card-title text-base" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sName}
                        {isRecentlyAdded(item.created_at) && (
                          <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '0.65rem', padding: '2px 6px', display: 'inline-block', verticalAlign: 'middle' }}>New</span>
                        )}
                      </h3>

                      <p className="card-subtitle">{sProvider}</p>
                    </div>
                  </div>
                  <button 
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark('scholarships', item.id)}
                    title="Bookmark"
                  >
                    <SvgIcon name={isBookmarked ? 'bookmarkFilled' : 'bookmark'} />
                  </button>
                </div>
                
                <div className="card-body">
                  <p className="text-xs text-muted" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '8px' }}>
                    {item.description}
                  </p>
                  
                  <ul className="card-details-list">
                    <li><strong>Who Can Apply:</strong> {item.whoCanApply}</li>
                    <li><strong>Eligibility:</strong> {item.eligibility}</li>
                    <li><strong>Benefits:</strong> {item.benefits}</li>
                  </ul>

                  <div className="card-skills" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <span className="card-skill-tag" style={{ color: 'var(--primary)', background: 'var(--primary-light)', fontWeight: 700 }}>
                      {item.amount}
                    </span>
                    <span className="card-skill-tag">{item.educationLevel}</span>
                    <span className="card-skill-tag">{item.category}</span>
                    <span className="card-skill-tag">{item.state}</span>
                  </div>
                </div>
                
                <div className="card-actions" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <a href={item.officialApplicationPage || item.officialScholarshipPage || item.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    Apply Now <SvgIcon name="apply" size={14} />
                  </a>
                  <button className="btn btn-glass btn-sm" onClick={() => setSelectedItem(item)}>
                    Requirements
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Detailed Document Requirements Modal */}
      {selectedItem && (
        <div className="glass-modal active" onClick={(e) => { if (e.target.classList.contains('glass-modal')) setSelectedItem(null); }}>
          <div className="glass-modal-content">
            <button className="close-modal-btn" onClick={() => setSelectedItem(null)}>&times;</button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div className="card-logo-container">
                  <img 
                    src={selectedItem.logo} 
                    alt={selectedItem.provider || selectedItem.organization || ''} 
                    className="card-logo-img" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="card-logo-fallback" style={{ display: 'none' }}>
                    {(selectedItem.provider || selectedItem.organization || 'S').charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="modal-title" style={{ marginBottom: 0, fontSize: '1.3rem' }}>
                    {selectedItem.scholarshipName || selectedItem.name}
                  </h2>
                  <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    {selectedItem.provider || selectedItem.organization}
                  </p>
                </div>
              </div>
              
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{selectedItem.amount}</span>
              <p className="text-sm text-secondary" style={{ lineHeight: '1.6', marginBottom: '16px' }}>{selectedItem.description}</p>
              
              <div className="modal-section-title">Eligibility Criteria</div>
              <p className="text-sm text-secondary">{selectedItem.eligibility}</p>
              
              <div className="modal-section-title">Income Criteria</div>
              <p className="text-sm text-secondary">{selectedItem.incomeCriteria || "Not specified"}</p>

              <div className="modal-section-title">Required Documents</div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {(selectedItem.requiredDocuments || selectedItem.documents || []).map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>

              <div className="flex gap-sm" style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <a href={selectedItem.officialApplicationPage || selectedItem.officialScholarshipPage || selectedItem.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Apply Now <SvgIcon name="apply" size={16} />
                </a>
                <a href={selectedItem.officialScholarshipPage || selectedItem.officialWebsite} target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ flexGrow: 1 }}>
                  Official Website
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
