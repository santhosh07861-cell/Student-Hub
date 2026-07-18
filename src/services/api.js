import { supabase } from './supabase';

export const fetchScholarships = async () => {
  const { data, error } = await supabase
    .from('scholarship')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching scholarships from Supabase:", error.message);
    // Fallback to local file if database fails
    const res = await fetch('./data/scholarships.json');
    return res.json();
  }
  return data;
};

export const fetchInternships = async () => {
  const { data, error } = await supabase
    .from('internship')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching internships from Supabase:", error.message);
    // Fallback to local file if database fails
    const res = await fetch('./data/internships.json');
    return res.json();
  }
  return data;
};

export const fetchCourses = async () => {
  const res = await fetch('./data/courses.json');
  return res.json();
};

export const fetchRoadmaps = async () => {
  const res = await fetch('./data/roadmaps.json');
  return res.json();
};

