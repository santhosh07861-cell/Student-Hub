import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';
import './Roadmaps.css';
import './Subject.css';

// Dynamic categories mapping
const categoryMap = {
  "software-engineer": "software",
  "full-stack-developer": "software",
  "java-developer": "software",
  "python-developer": "software",
  "frontend-developer": "software",
  "backend-developer": "software",
  "android-developer": "software",
  "ai-engineer": "data-ai",
  "machine-learning-engineer": "data-ai",
  "data-scientist": "data-ai",
  "data-analyst": "data-ai",
  "cloud-engineer": "infrastructure",
  "devops-engineer": "infrastructure",
  "cyber-security-engineer": "infrastructure",
  "ui-ux-designer": "infrastructure",
  "electrical-engineer": "core-eng",
  "electronics-engineer": "core-eng",
  "mechanical-engineer": "core-eng",
  "civil-engineer": "core-eng",
  "embedded-systems-engineer": "core-eng",
  "plc-scada-engineer": "core-eng",
  "government-jobs-eee": "government",
  "government-jobs-cse": "government",
  "government-jobs-ece": "government",
  "government-jobs-mechanical": "government",
  "government-jobs-civil": "government"
};

// Image assets mapping
const imagesMap = {
  "software-engineer": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "full-stack-developer": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  "java-developer": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
  "python-developer": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  "frontend-developer": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  "backend-developer": "https://images.unsplash.com/photo-1627390215543-c435b37919be?auto=format&fit=crop&w=600&q=80",
  "ai-engineer": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
  "machine-learning-engineer": "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=600&q=80",
  "data-scientist": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  "data-analyst": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "cloud-engineer": "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
  "devops-engineer": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
  "cyber-security-engineer": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "android-developer": "https://images.unsplash.com/photo-1610433572201-110753c6cff9?auto=format&fit=crop&w=600&q=80",
  "ui-ux-designer": "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80",
  "electrical-engineer": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
  "electronics-engineer": "https://images.unsplash.com/photo-1517055720413-77a282b81d3b?auto=format&fit=crop&w=600&q=80",
  "mechanical-engineer": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  "civil-engineer": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "embedded-systems-engineer": "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
  "plc-scada-engineer": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
  "government-jobs-eee": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  "government-jobs-cse": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  "government-jobs-ece": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "government-jobs-mechanical": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  "government-jobs-civil": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80"
};

// Acronym and formatted title mapping helper
const formatAcronymName = (id) => {
  const acronyms = {
    'html': 'HTML',
    'css': 'CSS',
    'api': 'APIs',
    'nosql': 'NoSQL',
    'mongodb': 'MongoDB',
    'jvm': 'JVM',
    'dbms': 'DBMS',
    'sql': 'SQL',
    'oop': 'OOP',
    'dsa': 'DSA',
    'os': 'OS',
    'cn': 'CN',
    'gate': 'GATE Exam',
    'ese': 'ESE Exam',
    'ssc': 'SSC JE',
    'rrb': 'RRB JE',
    'psu': 'PSUs Recruitment',
    'aws': 'AWS Cloud',
    'ci-cd': 'CI/CD Pipelines',
    'soc': 'SOC Security Operations',
    'rtos': 'RTOS (Real-Time OS)',
    'plc': 'PLC Programming Logic',
    'scada': 'SCADA Systems',
    'hmi': 'HMI Interfaces',
    'cad': 'CAD Designs',
    'kicad': 'KiCad EDA layouts',
    'hdl': 'HDL Digital Design',
    'pcb': 'PCB Board Designs',
    'gk': 'General Knowledge',
    'eee': 'Electrical & Electronics',
    'cse': 'Computer Science',
    'ece': 'Electronics & Communication'
  };

  if (acronyms[id.toLowerCase()]) {
    return acronyms[id.toLowerCase()];
  }

  return id.split('-').map(word => {
    if (acronyms[word.toLowerCase()]) {
      return acronyms[word.toLowerCase()];
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

// Fallback Heuristics
const generateSubjectFallback = (id) => {
  const cleanName = formatAcronymName(id);
  const isProject = id.includes('project') || id.includes('portfolio');
  const time = isProject ? "6 Weeks" : "4 Weeks";
  
  let topics = [];
  let whyImportant = `Mastering ${cleanName} is critical to establishing direct engineering competence and qualifying for target vacancies.`;
  let description = `Comprehensive syllabus checklist outlining core topics, important formulas, and analysis guidelines for ${cleanName}.`;
  
  if (id.includes('project') || id.includes('portfolio')) {
    topics = ["Project Boundaries Definition", "System Architecture & Layout Plans", "Data Store Schema designs", "Component Interfaces validation", "Error Exception handling matrices", "Continuous Integration runs", "Unit and Integration Testing", "Documentation readmes formatting"];
    whyImportant = `Completing structured projects validates your ability to compile multiple software/hardware segments into a unified system product.`;
    description = `Applied system assembly checklist detailing resource planning, component integrations, verification tests, and code setups for ${cleanName}.`;
  } else if (id.includes('math') || id.includes('statistics')) {
    topics = ["Fundamental Theorems rules", "Matrix Vector calculations", "Linear equations transformations", "Differential calculations", "Probability metrics distributions", "Random Variable variables", "Statistical hypothesis tests", "Regression parameter forecasts", "Convergence limits checks", "Applied problem solver sets"];
    whyImportant = `Forms the quantitative mathematical analytical core evaluated across academic tests and research calculations.`;
  } else if (id.includes('security') || id.includes('crypto') || id.includes('penetration') || id.includes('threat')) {
    topics = ["Security vulnerabilities review", "Cryptographic standard ciphers", "Boundary firewall rule logs", "Access control boundary lists", "Intrusion trace logs alerts", "Target network scanners maps", "Exploitation scripts triggers", "Incident response containment plans", "Security patch code checklists", "Auditing reports logs documentation"];
    whyImportant = `Essential to safeguard corporate database records, configure secure cloud access policies, and prevent resource hijacking.`;
  } else if (id.includes('cloud') || id.includes('devops') || id.includes('docker') || id.includes('terraform') || id.includes('kubernetes') || id.includes('pipelines')) {
    topics = ["Virtual cloud server networks", "Containerized runtime configuration files", "Infrastructure as code declarations", "Automated deployment triggers", "Secret vault credential lists", "Cluster nodes scaling parameters", "Proxy routing configuration keys", "Log alerts collectors databases", "Continuous delivery configurations", "Cost configuration optimizations"];
    whyImportant = `Automates application deployments, scaling compute nodes dynamically, and managing cloud server resources.`;
  } else {
    topics = [
      "Introduction and core fundamentals of " + cleanName,
      "Standard parameters, units and metrics definitions",
      "Analysis configurations and performance profiles",
      "Design methodologies and standard workflow guidelines",
      "System testing & troubleshooting rules",
      cleanName + " advanced specializations & tools",
      "Practical project assignments & solver keys",
      "Hiring assessment evaluations & mock quizzes"
    ];
  }

  return {
    subjectName: cleanName,
    description,
    estimatedTime: time,
    whyImportant,
    topics,
    usefulFor: ["Semester Exams", "Technical Interviews", "Placements"]
  };
};

export default function Roadmaps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const careerId = searchParams.get('career') || '';
  const subjectId = searchParams.get('subject') || '';

  const [roadmapsList, setRoadmapsList] = useState([]);
  const [subjectsDB, setSubjectsDB] = useState({});
  const [topicsDB, setTopicsDB] = useState({});
  const [loading, setLoading] = useState(true);

  // Directory state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Accordion active item state (Subject view)
  const [activeAccordion, setActiveAccordion] = useState('acc-topic-0');

  // Fetch Databases
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('./data/roadmaps.json').then(res => res.json()).catch(() => []),
      fetch('./data/subjects.json').then(res => res.json()).catch(() => ({})),
      fetch('./data/topics.json').then(res => res.json()).catch(() => ({}))
    ]).then(([roadmaps, subjects, topics]) => {
      setRoadmapsList(roadmaps);
      setSubjectsDB(subjects);
      setTopicsDB(topics);
      setLoading(false);
    });
  }, []);

  const selectCareer = (id) => {
    setSearchParams({ career: id });
  };

  const selectSubject = (id) => {
    setSearchParams({ career: careerId, subject: id });
  };

  const backToCareers = () => {
    setSearchParams({});
  };

  const backToRoadmap = () => {
    setSearchParams({ career: careerId });
  };

  // 1. SUBJECT DETAIL VIEW
  if (careerId && subjectId) {
    const rawSubject = subjectsDB[subjectId];
    const subject = rawSubject || generateSubjectFallback(subjectId);
    const subjectSubtopics = topicsDB[subjectId] || {};

    return (
      <>
        {/* Back Navigation Header */}
        <div className="subject-header-nav-panel">
          <button className="back-to-roadmap-btn" onClick={backToRoadmap}>
            <SvgIcon name="apply" size={18} style={{ transform: 'rotate(180deg)', display: 'inline-block' }} />
            <span>Back to Career Roadmap</span>
          </button>
          
          <div className="subject-title-container">
            <div className="subject-title-row">
              <h1 className="subject-active-name">{subject.subjectName}</h1>
              <span className="subject-time-badge">Study Time: {subject.estimatedTime}</span>
            </div>
            <p className="subject-short-desc">{subject.description}</p>
          </div>
        </div>

        {/* Split Layout for Subject Syllabus */}
        <section className="subject-layout-grid">
          {/* Left Side: Syllabus Topics Accordion */}
          <div className="glass-panel syllabus-topics-pane">
            <h2 className="syllabus-pane-title">
              <SvgIcon name="resume" size={20} />
              Important Topics to Study
            </h2>
            <p className="syllabus-pane-subtitle">Familiarize yourself with these core concepts and subtopics. Click headers to expand subtopics details.</p>
            
            <div className="topics-accordion-list">
              {(subject.topics && subject.topics.length > 0) ? (
                subject.topics.map((topic, idx) => {
                  const itemId = `acc-topic-${idx}`;
                  const isOpen = activeAccordion === itemId;

                  let subtopics = subjectSubtopics[topic] || [];
                  if (subtopics.length === 0) {
                    subtopics = [
                      `${topic} fundamental concepts and definitions`,
                      `${topic} practical applications and standard practices`,
                      `Solving standard problems & numericals on ${topic}`,
                      `Common technical interview question focus areas for ${topic}`
                    ];
                  }

                  return (
                    <div className={`subject-accordion-item ${isOpen ? 'active' : ''}`} key={idx}>
                      <button 
                        className="subject-accordion-header" 
                        onClick={() => setActiveAccordion(isOpen ? '' : itemId)}
                      >
                        <span className="topic-title-wrapper">
                          <span className="topic-index-badge">{idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}</span>
                          <span className="topic-title-text">{topic}</span>
                        </span>
                        <SvgIcon 
                          name="chevronRight" 
                          size={14} 
                          className="subject-accordion-icon" 
                          style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>
                      <div className="subject-accordion-panel" style={{ maxHeight: isOpen ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.3s ease-out' }}>
                        <div className="subject-accordion-panel-content">
                          <ul className="subtopics-bullets-list">
                            {subtopics.map((sub, sIdx) => (
                              <li key={sIdx}>{sub}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-topics-found">No specific topics defined for this subject.</p>
              )}
            </div>
          </div>

          {/* Right Side: Usage & Context */}
          <div className="subject-utility-pane flex flex-col gap-lg">
            <div className="glass-panel utility-meta-card">
              <h3 className="utility-card-title">
                <SvgIcon name="assistant" size={18} />
                Why Study This?
              </h3>
              <p className="utility-text">{subject.whyImportant}</p>
            </div>

            <div className="glass-panel utility-meta-card">
              <h3 className="utility-card-title">
                <SvgIcon name="check" size={18} />
                Syllabus Relevance
              </h3>
              <p className="utility-text" style={{ marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This subject is frequently evaluated in the following exam categories:</p>
              <div className="useful-for-tags-container">
                {(subject.usefulFor || []).map(badge => (
                  <span className="useful-badge" key={badge}>{badge}</span>
                ))}
              </div>
            </div>

            <div className="glass-panel utility-meta-card notice-highlight-card">
              <h4 className="notice-title">
                <SvgIcon name="notifications" size={16} />
                Syllabus Guidance Only
              </h4>
              <p className="notice-desc">StudentHub provides structural curriculum guides (Syllabus details & key topics lists) to define what you should study. Comprehensive lessons and detailed reference notes will be provided in LearningHub.</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // 2. ROADMAP DETAIL VIEW
  if (careerId) {
    const roadmap = roadmapsList.find(r => r.id === careerId);
    if (!roadmap) {
      return (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p className="text-lg">Roadmap not found.</p>
          <button className="btn btn-primary" onClick={backToCareers}>Go back</button>
        </div>
      );
    }

    const rolesText = (roadmap.jobRoles && roadmap.jobRoles.length > 0) ? roadmap.jobRoles.join(', ') : 'Specialist roles';

    return (
      <div className="fade-in">
        {/* Back Link */}
        <button 
          className="back-to-roadmap-btn" 
          onClick={backToCareers}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}
        >
          <SvgIcon name="apply" size={16} style={{ transform: 'rotate(180deg)' }} />
          <span>Back to Career Directory</span>
        </button>

        <div className="roadmap-active-title-block" style={{ marginBottom: '32px' }}>
          <h1 className="roadmap-active-title">{roadmap.careerName} Roadmap</h1>
          <p className="roadmap-active-desc">{roadmap.description}</p>
          <div className="roadmap-meta-info-row">
            <div className="meta-info-badge">
              <SvgIcon name="clock" size={14} />
              <span id="roadmap-meta-time">Duration: {roadmap.estimatedTime}</span>
            </div>
            <div className="meta-info-badge">
              <SvgIcon name="profile" size={14} />
              <span id="roadmap-meta-roles">Job Roles: {rolesText}</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid Split */}
        <div className="roadmap-layout">
          {/* Left Flowchart Timeline */}
          <div className="roadmap-flowchart-pane">
            <div className="timeline-vertical-connector"></div>
            <div id="roadmap-steps-container" className="flex flex-col gap-lg">
              {roadmap.steps.map((stepId, idx) => {
                const subject = subjectsDB[stepId] || {
                  subjectName: formatAcronymName(stepId),
                  description: "Explore the core concepts and examination topics of this subject.",
                  estimatedTime: "3 Weeks"
                };

                return (
                  <div 
                    className="roadmap-step-card-link fade-in" 
                    key={stepId}
                    onClick={() => selectSubject(stepId)}
                    style={{ cursor: 'pointer', zIndex: 2 }}
                  >
                    <div className="roadmap-step-card">
                      <div className="step-node-indicator">{idx + 1}</div>
                      <div className="step-card-content">
                        <div className="step-card-header">
                          <div className="step-meta-info">
                            <span className="step-number-tag">Step 0{idx + 1}</span>
                            <h3 className="step-title">{subject.subjectName}</h3>
                          </div>
                          <span className="step-duration-pill">{subject.estimatedTime}</span>
                        </div>
                        <p className="step-description">{subject.description}</p>
                        <div className="step-clickable-indicator">
                          <span>View Important Topics</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar Panel: Career Overview, Required Skills, Opportunities, Timeline */}
          <div className="roadmap-details-pane flex flex-col gap-lg">
            <div className="glass-panel details-card">
              <h3 className="details-card-title">
                <SvgIcon name="assistant" size={18} />
                Career Overview
              </h3>
              <p className="panel-paragraph">
                The study blueprint below organizes the core curriculum and important subjects required to prepare for {roadmap.careerName} opportunities. Follow the step-by-step path, clicking on individual subjects to explore the key topics, concepts, and examination focus fields required for your target.
              </p>
            </div>

            <div className="glass-panel details-card">
              <h3 className="details-card-title">
                <SvgIcon name="resume" size={18} />
                Required Skills
              </h3>
              <div className="skills-tags-cloud" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {roadmap.skills.map(skill => (
                  <span className="cloud-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="glass-panel details-card">
              <h3 className="details-card-title">
                <SvgIcon name="clock" size={18} />
                Estimated Duration
              </h3>
              <p className="panel-paragraph">
                Estimated overall preparation timeline to qualify for placement standards is approximately <strong>{roadmap.estimatedTime}</strong>. This estimate covers full conceptual exploration and exam syllabus reviews.
              </p>
            </div>

            <div className="glass-panel details-card">
              <h3 className="details-card-title">
                <SvgIcon name="check" size={18} />
                Career Opportunities
              </h3>
              <ul className="opportunities-list" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {roadmap.jobRoles.map(role => (
                  <li className="opportunity-item" key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <SvgIcon name="check" size={14} style={{ color: 'var(--success)' }} />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel details-card">
              <h3 className="details-card-title">
                <SvgIcon name="apply" size={18} />
                Step Quick-Nav
              </h3>
              <div className="subject-quick-nav-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {roadmap.steps.map((stepId, idx) => {
                  const subject = subjectsDB[stepId] || { subjectName: formatAcronymName(stepId) };
                  return (
                    <button 
                      key={stepId} 
                      className="subject-quick-link"
                      onClick={() => selectSubject(stepId)}
                      style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <span>{idx + 1}. {subject.subjectName}</span>
                      <SvgIcon name="chevronRight" size={12} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 3. ROADMAPS DIRECTORY VIEW
  const filteredRoadmaps = roadmapsList.filter(roadmap => {
    const matchesSearch = !searchQuery || 
      roadmap.careerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());

    const cId = roadmap.id;
    const cat = categoryMap[cId] || 'software';
    const matchesCategory = activeCategory === 'all' || cat === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="section-title">Career Roadmaps</h1>
          <p className="text-secondary">Explore structured syllabuses, core subjects, and examination topics for your dream career path.</p>
        </div>
      </div>

      <div className="section-header-platform">
        {/* Large Search & Filter Platform */}
        <div className="search-platform-container glass-panel">
          <div className="search-input-wrapper">
            <SvgIcon name="search" size={22} className="search-svg-icon" />
            <input 
              type="text" 
              className="careers-search-input" 
              placeholder="Search careers (e.g. Software Engineer, Machine Learning, Mechanical, Civil...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Selector Pills */}
        <div className="category-filters-pills" id="category-pills-container">
          <button className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All Fields</button>
          <button className={`filter-pill ${activeCategory === 'software' ? 'active' : ''}`} onClick={() => setActiveCategory('software')}>Software Dev</button>
          <button className={`filter-pill ${activeCategory === 'data-ai' ? 'active' : ''}`} onClick={() => setActiveCategory('data-ai')}>Data & AI</button>
          <button className={`filter-pill ${activeCategory === 'infrastructure' ? 'active' : ''}`} onClick={() => setActiveCategory('infrastructure')}>Infrastructure & Design</button>
          <button className={`filter-pill ${activeCategory === 'core-eng' ? 'active' : ''}`} onClick={() => setActiveCategory('core-eng')}>Core Engineering</button>
          <button className={`filter-pill ${activeCategory === 'government' ? 'active' : ''}`} onClick={() => setActiveCategory('government')}>Government Jobs</button>
        </div>
      </div>

      {/* Careers Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="careers-grid-container">
        {loading ? (
          <>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
            <div className="card skeleton"></div>
          </>
        ) : filteredRoadmaps.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <p className="text-lg weight-semibold">No career roadmaps found matching your search.</p>
          </div>
        ) : (
          filteredRoadmaps.map(roadmap => {
            const cardImg = imagesMap[roadmap.id] || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";

            return (
              <div 
                className="card card-lift career-card" 
                key={roadmap.id}
                onClick={() => selectCareer(roadmap.id)}
                style={{ cursor: 'pointer', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img src={cardImg} alt={roadmap.careerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(15,23,42,0.95))' }}></div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 className="card-title text-base" style={{ marginBottom: '6px' }}>{roadmap.careerName}</h3>
                  <p className="text-xs text-muted" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px', marginBottom: '12px' }}>
                    {roadmap.description}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="card-skill-tag" style={{ color: 'var(--primary)', background: 'var(--primary-light)', fontWeight: 700 }}>
                      {roadmap.estimatedTime}
                    </span>
                    <span className="card-skill-tag">
                      {roadmap.steps.length} Steps
                    </span>
                  </div>
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
