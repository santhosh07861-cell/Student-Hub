import { fetchScholarships, fetchInternships, fetchCourses, fetchRoadmaps } from './api';

export const SearchEngine = {
  async indexAll() {
    const [scholarships, internships, courses, roadmaps] = await Promise.all([
      fetchScholarships().catch(() => []),
      fetchInternships().catch(() => []),
      fetchCourses().catch(() => []),
      fetchRoadmaps().catch(() => [])
    ]);

    const index = [];

    scholarships.forEach(item => {
      index.push({
        type: 'scholarship',
        title: item.scholarshipName || item.name || '',
        subtitle: item.provider || item.organization || '',
        description: item.description || item.eligibility || '',
        url: '/scholarships',
        raw: item
      });
    });

    internships.forEach(item => {
      index.push({
        type: 'internship',
        title: item.role || '',
        subtitle: item.companyName || item.org || '',
        description: item.description || `Location: ${item.location || ''} (${item.mode || ''}).`,
        url: '/internships',
        raw: item
      });
    });

    courses.forEach(item => {
      index.push({
        type: 'course',
        title: item.courseName || item.title || '',
        subtitle: item.platform || '',
        description: item.description || '',
        url: '/courses',
        raw: item
      });
    });

    roadmaps.forEach(item => {
      index.push({
        type: 'roadmap',
        title: item.title ? `${item.title} Career Roadmap` : 'Career Roadmap',
        subtitle: 'Visual Career Path',
        description: item.description || '',
        url: '/roadmaps',
        raw: item
      });
    });

    return index;
  },

  async query(queryString) {
    const index = await this.indexAll();
    const query = queryString.toLowerCase().trim();
    if (!query) return [];

    return index.filter(item => {
      return (
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.type && item.type.toLowerCase().includes(query))
      );
    });
  }
};
