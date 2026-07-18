import React, { useState } from 'react';
import { SvgIcon } from '../components/SvgIcon';
import Footer from '../components/Footer';
import './ResumeBuilder.css';

export default function ResumeBuilder() {
  const [template, setTemplate] = useState('minimalist');

  const [formData, setFormData] = useState({
    fullname: 'Alex Rivera',
    role: 'Software Engineering Intern',
    email: 'alex.rivera@university.edu',
    phone: '+1 (555) 019-2834',
    github: 'github.com/alexrivera',
    portfolio: 'linkedin.com/in/alexrivera',
    school: 'Stanford University',
    degree: 'B.S. in Computer Science',
    gpa: '3.92 / 4.0',
    jobTitle: 'Web Intern',
    company: 'Google (Summer 2025)',
    jobDesc: `- Maintained responsive elements using modern layouts.\n- Optimized data fetches resulting in 15% reduction in load times.`,
    projectName: 'Real-time Collaborative Whiteboard',
    projectDesc: 'Built a Canvas based collaborative whiteboard synced over Node.js and WebSockets with room configurations.',
    skills: 'JavaScript, Python, C++, React, Node.js, SQL, Git'
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const exportPDF = () => {
    window.print();
  };

  // Process experience bullets
  const jobBullets = formData.jobDesc
    .split('\n')
    .map(bullet => bullet.trim())
    .filter(bullet => bullet.length > 0)
    .map(bullet => bullet.replace(/^[-\*\+]/, '').trim());

  // Process skills tags
  const skillsList = formData.skills
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);

  return (
    <>
      {/* Page Header */}
      <div className="section-header resume-section-header">
        <div>
          <h1 className="section-title">Resume Builder</h1>
          <p className="text-secondary">Create a professional, ATS-friendly resume. Changes are rendered in real time.</p>
        </div>
        <div className="flex gap-sm" style={{ alignItems: 'center' }}>
          <select 
            id="resume-template-select" 
            className="form-input" 
            style={{ width: '160px', height: '42px', fontSize: '0.85rem' }}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="minimalist">Minimalist (Standard)</option>
            <option value="corporate">Corporate (Elegant)</option>
            <option value="modern">Modern (Creative)</option>
          </select>
          <button className="btn btn-primary" onClick={exportPDF}>
            <SvgIcon name="apply" size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Split Layout for Builder and Canvas */}
      <section className="resume-layout">
        
        {/* Left: Form inputs */}
        <div className="resume-form-pane">
          {/* Personal Details */}
          <div className="glass-panel form-card">
            <h3 className="form-card-title">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.fullname} 
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Role</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / LinkedIn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="glass-panel form-card">
            <h3 className="form-card-title">Education</h3>
            <div className="flex flex-col gap-sm" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">School Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Degree & Major</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GPA / Grade</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="glass-panel form-card">
            <h3 className="form-card-title">Experience</h3>
            <div className="flex flex-col gap-sm" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name & Period</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Bullet Points</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  style={{ resize: 'vertical' }}
                  value={formData.jobDesc}
                  onChange={(e) => handleInputChange('jobDesc', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="glass-panel form-card">
            <h3 className="form-card-title">Featured Project</h3>
            <div className="flex flex-col gap-sm" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  style={{ resize: 'vertical' }}
                  value={formData.projectDesc}
                  onChange={(e) => handleInputChange('projectDesc', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-panel form-card">
            <h3 className="form-card-title">Skills</h3>
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Skills (Comma-separated)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
              />
            </div>
          </div>

          {/* ATS Tips Banner */}
          <div className="glass-panel form-card ats-tips-card">
            <h4 className="text-sm weight-bold" style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SvgIcon name="notifications" size={16} /> ATS Formatting Tips
            </h4>
            <ul className="roadmap-list" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
              <li>Keep it to one page; print layout fits exactly on a single A4 sheet.</li>
              <li>Avoid graphics or complex multi-column tables.</li>
              <li>Write clear, quantifiable metrics (e.g. "optimized API loads by 20%").</li>
            </ul>
          </div>
        </div>

        {/* Right: Real-time Canvas Sheet Preview */}
        <div className="resume-preview-pane">
          <div className={`resume-sheet-container template-${template}`} id="resume-sheet">
            <header className="resume-header">
              <h1 className="resume-name">{formData.fullname}</h1>
              <p className="resume-role">{formData.role}</p>
              <div className="resume-contacts">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span> • {formData.phone}</span>}
                {formData.github && <span> • {formData.github}</span>}
                {formData.portfolio && <span> • {formData.portfolio}</span>}
              </div>
            </header>

            <section>
              <h2 className="resume-section-title">Education</h2>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>{formData.school}</span>
                  {formData.gpa && <span>GPA: {formData.gpa}</span>}
                </div>
                <div className="resume-item-sub">{formData.degree}</div>
              </div>
            </section>

            <section>
              <h2 className="resume-section-title">Experience</h2>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>{formData.jobTitle}</span>
                  <span>{formData.company}</span>
                </div>
                {jobBullets.length > 0 && (
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#334155', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {jobBullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section>
              <h2 className="resume-section-title">Featured Project</h2>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>{formData.projectName}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px', lineHeight: 1.4 }}>
                  {formData.projectDesc}
                </p>
              </div>
            </section>

            <section>
              <h2 className="resume-section-title">Skills & Technologies</h2>
              <div className="skills-container-preview" style={{ marginTop: '6px' }}>
                {skillsList.map((skill, idx) => (
                  <span 
                    key={idx} 
                    style={{ display: 'inline-block', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', marginRight: '6px', marginBottom: '6px', fontWeight: '600' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}
