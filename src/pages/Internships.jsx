import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';
import './Internships.css';
import { fetchInternships } from '../services/api';

export default function Internships() {
  const { bookmarks, toggleBookmark } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('government');
  const [governmentList, setGovernmentList] = useState([]);
  const [privateList, setPrivateList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [paidFilter, setPaidFilter] = useState('all');

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetchInternships()
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

  // Extract dynamic filters
  const states = ['all', ...new Set(activeList.map(item => item.state).filter(Boolean))];
  const companies = ['all', ...new Set(activeList.map(item => item.companyName || item.organization || item.org).filter(Boolean))];

  // Filtering logic
  const filteredList = activeList.filter(item => {
    const roleName = (item.role || item.internshipName || '').toLowerCase();
    const org = (item.companyName || item.organization || item.org || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const skills = (item.requiredSkills || []).map(s => s.toLowerCase());
    const query = searchQuery.toLowerCase().trim();

    // Search query match
    const matchesSearch = !query ||
      roleName.includes(query) ||
      org.includes(query) ||
      desc.includes(query) ||
      skills.some(s => s.includes(query));

    // Type filter match
    let matchesType = true;
    if (typeFilter !== 'all') {
      const title = roleName;
      if (typeFilter === 'technical') {
        matchesType = title.includes('software') || title.includes('developer') || title.includes('tech') || title.includes('embedded') || title.includes('engineering') || title.includes('avionics') || title.includes('hardware') || title.includes('grid') || title.includes('nuclear');
      } else if (typeFilter === 'research') {
        matchesType = title.includes('research') || title.includes('fellowship') || desc.includes('research') || title.includes('planning') || title.includes('policy');
      } else if (typeFilter === 'management') {
        matchesType = title.includes('management') || title.includes('consulting') || title.includes('logistics') || title.includes('mba') || desc.includes('business');
      } else {
        matchesType = !title.includes('software') && !title.includes('developer') && !title.includes('tech') && !title.includes('research');
      }
    }

    // State filter match
    const matchesState = stateFilter === 'all' || item.state === stateFilter;

    // Branch filter match
    let matchesBranch = true;
    if (branchFilter !== 'all') {
      const branch = item.engineeringBranch || '';
      matchesBranch = branch.toLowerCase().includes(branchFilter.toLowerCase());
    }

    // Company filter match
    const itemCompany = item.companyName || item.organization || item.org || '';
    const matchesCompany = companyFilter === 'all' || itemCompany === companyFilter;

    // Mode filter match
    const matchesMode = modeFilter === 'all' || (item.mode && item.mode.toLowerCase() === modeFilter.toLowerCase());

    // Duration filter match
    let matchesDuration = true;
    if (durationFilter !== 'all') {
      const durationVal = parseInt(item.duration) || 0;
      if (durationFilter === 'short') {
        matchesDuration = durationVal < 3;
      } else if (durationFilter === 'medium') {
        matchesDuration = durationVal >= 3 && durationVal <= 6;
      } else {
        matchesDuration = durationVal > 6;
      }
    }

    // Paid filter match
    let matchesPaid = true;
    if (paidFilter !== 'all') {
      const stipend = (item.stipend || '').toLowerCase();
      const isPaid = stipend !== 'unpaid' && stipend !== 'none' && stipend !== 'nil' && stipend !== '0' && stipend !== '';
      matchesPaid = paidFilter === 'paid' ? isPaid : !isPaid;
    }

    return matchesSearch && matchesType && matchesState && matchesBranch && matchesCompany && matchesMode && matchesDuration && matchesPaid;
  });

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="section-title">Internships</h1>
          <p className="text-secondary">Find remote, hybrid, and onsite entry-level positions.</p>
        </div>
      </div>

      {/* Modern Tabs Menu */}
      <section className="internship-tabs-container w-full px-4">
        <div className="scholarship-tabs flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto p-1.5 rounded-xl sm:rounded-full">
          <button 
            className={`tab-btn w-full sm:w-auto ${activeTab === 'government' ? 'active' : ''}`}
            onClick={() => { setActiveTab('government'); setSearchQuery(''); }}
          >
            🏛 Government Internships
          </button>
          <button 
            className={`tab-btn w-full sm:w-auto ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => { setActiveTab('private'); setSearchQuery(''); }}
          >
            🏢 Private Internships
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
            placeholder="Search by role, organization, location or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters-container">
          <select className="form-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="technical">Technical / STEM</option>
            <option value="research">Research</option>
            <option value="management">Management</option>
            <option value="other">Other Fields</option>
          </select>

          <select className="form-input" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            <option value="all">All States</option>
            {states.filter(s => s !== 'all').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select className="form-input" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="computer science">Computer Science / IT</option>
            <option value="electronics">Electronics / Communication</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
            <option value="chemical">Chemical / Metallurgical</option>
          </select>

          <select className="form-input" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
            <option value="all">All Companies</option>
            {companies.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select className="form-input" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
            <option value="all">All Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>

          <select className="form-input" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
            <option value="all">All Durations</option>
            <option value="short">Under 3 Months</option>
            <option value="medium">3-6 Months</option>
            <option value="long">Over 6 Months</option>
          </select>

          <select className="form-input" value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)}>
            <option value="all">All Pay Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </section>

      {/* Internships Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="internships-grid">
        {loading ? (
          <>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
          </>
        ) : filteredList.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <p className="text-lg weight-semibold">No internships found matching your criteria.</p>
          </div>
        ) : (
          filteredList.map(item => {
            const isBookmarked = (bookmarks.internships || []).includes(item.id);
            const roleName = item.role || item.internshipName || '';
            const org = item.companyName || item.organization || item.org || '';
            const detailsHeader = activeTab === 'government' ? 'Required Documents' : 'Required Skills';
            const detailsList = activeTab === 'government' ? (item.requiredDocuments || []) : (item.requiredSkills || []);

            let statusClass = 'badge-secondary';
            if (item.status === 'Open') statusClass = 'badge-primary';
            if (item.status === 'Closed') statusClass = 'badge-danger';
            if (item.status === 'Upcoming') statusClass = 'badge-warning';

            return (
              <div className="card card-lift" key={item.id}>
                <div className="card-header">
                  <div className="flex align-center gap-sm" style={{ minWidth: 0, flex: 1 }}>
                    <div className="card-logo-container">
                      <img 
                        src={item.logo} 
                        alt={org} 
                        className="card-logo-img" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="card-logo-fallback" style={{ display: 'none' }}>
                        {org.charAt(0)}
                      </div>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 className="card-title text-base" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {roleName}
                      </h3>
                      <p className="card-subtitle">{org}</p>
                    </div>
                  </div>
                  <button 
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark('internships', item.id)}
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
                    <li><strong>{detailsHeader}:</strong> {detailsList.slice(0, 3).join(', ') + (detailsList.length > 3 ? '...' : '')}</li>
                  </ul>

                  <div className="card-skills" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <span className="card-skill-tag" style={{ color: 'var(--primary)', background: 'var(--primary-light)', fontWeight: 700 }}>
                      {item.stipend}
                    </span>
                    <span className="card-skill-tag">{item.mode}</span>
                    <span className="card-skill-tag">{item.duration}</span>
                    <span className="card-skill-tag">{item.engineeringBranch}</span>
                  </div>
                </div>
                
                <div className="card-actions" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', gap: '8px' }}>
                  <span className={`badge ${statusClass}`} style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.status}
                  </span>
                  <a href={item.officialApplicationPage || item.officialInternshipPage} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
                    Apply Now <SvgIcon name="apply" size={14} />
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
