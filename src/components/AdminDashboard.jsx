import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PushNotificationAdmin from './PushNotificationAdmin';
import PushNotificationTester from './PushNotificationTester';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '../utils/dateUtils';
import './AdminDashboard.css';

const TABS = [
  { key: 'jobs', label: 'Jobs' },
  { key: 'results', label: 'Results' },
  { key: 'admit_cards', label: 'Admit Cards' },
  { key: 'answer_keys', label: 'Answer Keys' },
  { key: 'documents', label: 'Documents' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'categories', label: 'Categories' },
  { key: 'organizations', label: 'Organizations' },
  { key: 'push_notifications', label: 'Push Notifications' },
  { key: 'push_tester', label: 'Push Tester' },
];

// Function to get current date in YYYY-MM-DD format (IST)
const getCurrentDate = () => {
  const now = new Date();
  // Convert to Indian Standard Time (UTC+5:30)
  const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  return istDate.toISOString().slice(0, 10);
};

// Function to get current time in simple IST format like "15/07/2025 5:19 AM"
const getCurrentISTTimestamp = () => {
  const now = new Date();
  // Convert to Indian Standard Time (UTC+5:30)
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  
  // Format as DD/MM/YYYY HH:MM AM/PM
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const year = istTime.getUTCFullYear();
  
  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

// Function to convert simple post_time format to date string for form display
const convertPostTimeToDate = (postTime) => {
  if (!postTime) return '';
  // postTime is already in format "DD/MM/YYYY HH:MM AM/PM"
  // Extract just the date part and convert to YYYY-MM-DD for input[type="date"]
  try {
    const datePart = postTime.split(' ')[0]; // Get "DD/MM/YYYY"
    const [day, month, year] = datePart.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting post_time to date:', error);
    return '';
  }
};

// Function to convert simple post_time format to time string for form display
const convertPostTimeToTime = (postTime) => {
  if (!postTime) return '12:00';
  // postTime is in format "DD/MM/YYYY HH:MM AM/PM"
  // Extract time part and convert to HH:MM for input[type="time"]
  try {
    const parts = postTime.split(' ');
    if (parts.length >= 3) {
      const timePart = parts[1]; // Get "HH:MM"
      const ampm = parts[2]; // Get "AM/PM"
      
      const [hours12, minutes] = timePart.split(':');
      let hours24 = parseInt(hours12);
      
      if (ampm === 'PM' && hours24 !== 12) {
        hours24 += 12;
      } else if (ampm === 'AM' && hours24 === 12) {
        hours24 = 0;
      }
      
      return `${String(hours24).padStart(2, '0')}:${minutes}`;
    }
    return '12:00';
  } catch (error) {
    console.error('Error converting post_time to time:', error);
    return '12:00';
  }
};

// Function to convert simple format to Date object for sorting
const convertSimpleFormatToDate = (postTime) => {
  if (!postTime) return new Date(0);
  try {
    // Handle both simple format "DD/MM/YYYY HH:MM AM/PM" and ISO format fallback
    if (postTime.includes('/')) {
      // Simple format "DD/MM/YYYY HH:MM AM/PM"
      const parts = postTime.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0]; // "DD/MM/YYYY"
        const timePart = parts[1]; // "HH:MM"
        const ampm = parts[2]; // "AM/PM"
        
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        
        let hour24 = parseInt(hours);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        
        // Create date with proper month (month - 1 because Date months are 0-indexed)
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
        console.log(`Parsed "${postTime}" as:`, date);
        return date;
      }
    }
    
    // Fallback to ISO format or direct Date parsing
    return new Date(postTime);
  } catch (error) {
    console.error('Error converting simple format to date:', error, 'Input:', postTime);
    return new Date(0);
  }
};

// Function to generate URL-friendly slug from title
const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 100 characters
    .substring(0, 100);
};

// Function to generate unique slug (will be used if we need to check for duplicates)
const generateUniqueSlug = async (baseSlug, tableName, currentId = null) => {
  if (!baseSlug) return '';
  
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists in database
  while (true) {
    let query = supabase
      .from(tableName)
      .select('id')
      .eq('slug', slug);
    
    // Exclude current item when editing
    if (currentId) {
      query = query.neq('id', currentId);
    }
    
    const { data, error } = await query;
    
    if (error || !data || data.length === 0) {
      // Slug is unique or error occurred, return it
      return slug;
    }
    
    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 100) {
      return `${baseSlug}-${Date.now()}`;
    }
  }
};

// Default form fields for each tab
const DEFAULT_FORMS = {
  jobs: {
    title: '',
    slug: '',
    post_name: '',
    total_posts: '',
    eligibility: '',
    apply_start_date: '',
    apply_end_date: '',
    fee_payment_date: '',
    exam_date: '',
    admit_card_date: '',
    result_date: '',
    fee_general: '',
    fee_sc_st: '',
    fee_female: '',
    age_min: '',
    age_max: '',
    age_relaxation: false,
    apply_link: '',
    notification_link: '',
    official_website: '',
    post_time: new Date().toISOString().slice(0, 10),
    status: 'active',
    is_featured: false,
    is_quick_link: false
  },
  results: {
    title: '',
    slug: '',
    category_id: '',
    organization_id: '',
    exam_name: '',
    result_date: '',
    result_pdf_url: '',
    status: 'published',
    view_count: 0,
    meta_title: '',
    meta_description: '',
    post_name: '',
    apply_start_date: '',
    apply_end_date: '',
    fee_payment_date: '',
    correction_start_date: '',
    correction_end_date: '',
    pe_exam_date: '',
    pm_pmm_exam_date: '',
    admit_card_date: '',
    result_declared_date: '',
    apply_link: '',
    notification_link: '',
    official_website: '',
    post_time: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_featured: false,
    is_quick_link: false
  },
  admit_cards: {
    title: '',
    slug: '',
    category_id: '',
    organization_id: '',
    exam_name: '',
    exam_date: '',
    admit_card_url: '',
    status: 'active',
    view_count: 0,
    meta_title: '',
    meta_description: '',
    post_name: '',
    admit_card_available_date: '',
    admit_card_download_last_date: '',
    exam_city_date: '',
    exam_shift_date: '',
    download_link: '',
    notification_link: '',
    official_website: '',
    post_time: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_featured: false,
    is_quick_link: false
  },
  answer_keys: {
    title: '',
    slug: '',
    category_id: '',
    organization_id: '',
    exam_name: '',
    answer_key_url: '',
    objection_url: '',
    status: 'active',
    view_count: 0,
    meta_title: '',
    meta_description: '',
    post_name: '',
    exam_date: '',
    admit_card_date: '',
    result_date: '',
    answer_key_release_date: '',
    objection_start_date: '',
    objection_end_date: '',
    download_link: '',
    notification_link: '',
    official_website: '',
    post_time: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_featured: false,
    is_quick_link: false
  },
  documents: {
    title: '',
    slug: '',
    category_id: '',
    organization_id: '',
    document_type: '',
    document_url: '',
    status: 'active',
    view_count: 0,
    meta_title: '',
    meta_description: '',
    post_time: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_featured: false,
    is_quick_link: false
  },
  admissions: {
    title: '',
    slug: '',
    category_id: '',
    organization_id: '',
    course_name: '',
    eligibility: '',
    application_start: '',
    application_end: '',
    admission_notice_url: '',
    apply_online_url: '',
    status: 'active',
    view_count: 0,
    meta_title: '',
    meta_description: '',
    institution_name: '',
    apply_start_date: '',
    apply_end_date: '',
    fee_payment_date: '',
    correction_start_date: '',
    correction_end_date: '',
    entrance_exam_date: '',
    admit_card_date: '',
    result_date: '',
    counselling_date: '',
    fee_general: '',
    fee_sc_st: '',
    fee_obc: '',
    apply_link: '',
    notification_link: '',
    official_website: '',
    post_time: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_featured: false,
    is_quick_link: false
  },
  categories: {
    name: '',
    slug: '',
    parent_id: '',
    sort_order: 0,
    is_active: true
  },
  organizations: {
    name: '',
    slug: '',
    description: '',
    website_url: '',
    logo_url: '',
    is_active: true
  }
};

// Add table column definitions for each table type
const TABLE_COLUMNS = {
  jobs: [
    'id', 'created_at', 'title', 'slug', 'post_name', 'total_posts', 'eligibility',
    'apply_start_date', 'apply_end_date', 'fee_payment_date', 'exam_date',
    'admit_card_date', 'result_date', 'fee_general', 'fee_sc_st', 'fee_female',
    'age_min', 'age_max', 'age_relaxation', 'selection_process', 'apply_link',
    'notification_link', 'official_website', 'post_time', 'required_documents',
    'status', 'is_featured', 'is_quick_link', 'display_order'
  ],
  results: [
    'id', 'created_at', 'title', 'slug', 'category_id', 'organization_id', 'exam_name',
    'result_date', 'result_pdf_url', 'status', 'view_count', 'meta_title', 'meta_description',
    'post_name', 'apply_start_date', 'apply_end_date', 'fee_payment_date', 'correction_start_date',
    'correction_end_date', 'pe_exam_date', 'pm_pmm_exam_date', 'admit_card_date',
    'result_declared_date', 'apply_link', 'notification_link', 'official_website',
    'post_time', 'display_order', 'is_featured', 'is_quick_link'
  ],
  admit_cards: [
    'id', 'created_at', 'title', 'slug', 'category_id', 'organization_id', 'exam_name', 'exam_date',
    'admit_card_url', 'status', 'view_count', 'meta_title', 'meta_description', 'post_name',
    'admit_card_available_date', 'admit_card_download_last_date', 'exam_city_date',
    'exam_shift_date', 'download_link', 'notification_link', 'official_website',
    'post_time', 'display_order', 'is_featured', 'is_quick_link'
  ],
  answer_keys: [
    'id', 'created_at', 'title', 'slug', 'category_id', 'organization_id', 'exam_name',
    'answer_key_url', 'objection_url', 'status', 'view_count', 'meta_title', 'meta_description',
    'post_name', 'exam_date', 'admit_card_date', 'result_date', 'answer_key_release_date',
    'objection_start_date', 'objection_end_date', 'download_link',
    'notification_link', 'official_website', 'post_time', 'display_order', 'is_featured',
    'is_quick_link'
  ],
  documents: [
    'id', 'created_at', 'title', 'slug', 'category_id', 'organization_id', 'document_type',
    'document_url', 'status', 'view_count', 'meta_title', 'meta_description', 'post_time',
    'display_order', 'is_featured', 'is_quick_link'
  ],
  admissions: [
    'id', 'created_at', 'title', 'slug', 'category_id', 'organization_id', 'course_name',
    'eligibility', 'application_start', 'application_end', 'admission_notice_url', 'apply_online_url',
    'status', 'view_count', 'meta_title', 'meta_description', 'institution_name',
    'apply_start_date', 'apply_end_date', 'fee_payment_date',
    'correction_start_date', 'correction_end_date', 'entrance_exam_date',
    'admit_card_date', 'result_date', 'counselling_date', 'fee_general',
    'fee_sc_st', 'fee_obc', 'apply_link', 'notification_link',
    'official_website', 'post_time', 'display_order', 'is_featured', 'is_quick_link'
  ],
  categories: [
    'id', 'created_at', 'name', 'slug', 'parent_id', 'sort_order', 'is_active'
  ],
  organizations: [
    'id', 'created_at', 'name', 'slug', 'description', 'website_url',
    'logo_url', 'is_active'
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORMS[activeTab]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { 
        replace: true,
        state: { error: 'Please login as admin to access this page.' }
      });
      return;
    }

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, authLoading]);



  React.useEffect(() => {
    // Reset form when changing tabs
    setForm(DEFAULT_FORMS[activeTab]);
    setEditing(null);
    setError('');
    setSuccess('');
    setShowForm(false);
    
    // Fetch data for the new tab
    if (isAdmin) {
      fetchData();
    }
  }, [activeTab, isAdmin]);

  // Real-time subscription for admin dashboard
  useEffect(() => {
    if (!isAdmin || !activeTab) return;

    const subscription = supabase
      .channel(`admin_${activeTab}_realtime_channel`, {
        config: {
          broadcast: { self: true },
          presence: { key: 'admin_user' }
        }
      })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: activeTab
        }, 
        (payload) => {
          console.log(`Real-time update received for ${activeTab}:`, payload);
          console.log('Event type:', payload.eventType);
          console.log('New data:', payload.new);
          
          if (payload.eventType === 'INSERT') {
            // Add new item to the list
            setData(prevData => {
              const newData = [payload.new, ...prevData];
              
              // Sort by post_time if it's a content table
              if (['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab)) {
                return newData.sort((a, b) => {
                  const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
                  const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
                  return dateB - dateA;
                });
              }
              
              return newData;
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing item
            setData(prevData => {
              const updatedData = prevData.map(item => 
                item.id === payload.new.id ? payload.new : item
              );
              
              // Sort by post_time if it's a content table
              if (['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab)) {
                return updatedData.sort((a, b) => {
                  const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
                  const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
                  return dateB - dateA;
                });
              }
              
              return updatedData;
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted item
            setData(prevData => prevData.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // For tables with post_time, order by it; otherwise use display_order or created_at
      const orderColumn = ['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab) 
        ? 'post_time' 
        : (activeTab === 'categories' || activeTab === 'organizations') 
          ? 'created_at' 
          : 'display_order';
      
      const { data: fetchedData, error } = await supabase
        .from(activeTab)
        .select(TABLE_COLUMNS[activeTab].join(','))
        .order(orderColumn, { ascending: false });
      
      if (error) {
        throw error;
      }

      // For content tables with post_time, sort client-side to ensure proper chronological order
      let sortedData = fetchedData || [];
      if (['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab)) {
        sortedData = sortedData.sort((a, b) => {
          const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
          const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
          return dateB - dateA; // Most recent first
        });
        
        console.log('Admin data sorted by post_time:', sortedData.map(item => ({
          title: item.title || item.name,
          post_time: item.post_time,
          parsed_date: convertSimpleFormatToDate(item.post_time)
        })));
      }

      setData(sortedData);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to fetch ${activeTab}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setError('');
    setSuccess('');
    
    // Load existing item data into form and convert dates to DD-MM-YYYY format for display
    const formData = { 
      ...item,
      // Keep existing slug if it exists, otherwise generate new one
      slug: item.slug || generateSlug(item.title || item.name || '')
    };
    
    // Convert date fields from YYYY-MM-DD to DD-MM-YYYY for form display
    Object.keys(formData).forEach(key => {
      if (key.includes('date') && key !== 'post_time' && formData[key]) {
        formData[key] = formatDateToDDMMYYYY(formData[key]);
      }
    });
    
    console.log('Loading edit form with data:', formData);
    setForm(formData);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setError('');
    
    try {
      // Optimistically remove item from UI for instant feedback
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      
      // Delete from database
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) {
        // If deletion fails, restore the item
        setData(data);
        throw error;
      }
      
      setSuccess('Item deleted successfully');
      console.log(`Item with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Failed to delete: ${error.message}`);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when title or name field changes
    if (name === 'title' || name === 'name') {
      setForm({ 
        ...form, 
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Always generate unique slug from title/name for consistency
      const formData = { ...form };
      if (formData.title || formData.name) {
        const baseSlug = generateSlug(formData.title || formData.name);
        formData.slug = await generateUniqueSlug(baseSlug, activeTab, editing);
        console.log('Generated unique slug:', formData.slug);
      }

      console.log('Form data before processing:', formData);

      // Convert string 'true'/'false' to boolean for boolean fields
      if (typeof formData.is_featured === 'string') {
        formData.is_featured = formData.is_featured === 'true';
      }
      if (typeof formData.is_quick_link === 'string') {
        formData.is_quick_link = formData.is_quick_link === 'true';
      }
      if (typeof formData.age_relaxation === 'string') {
        formData.age_relaxation = formData.age_relaxation === 'true';
      }

      // Handle post_time - keep existing value when editing, or set to current time for new items
      if (!editing && !formData.post_time) {
        // For new entries without post_time, set to current IST simple format
        formData.post_time = getCurrentISTTimestamp();
        console.log('Set default post_time for new entry (simple IST):', formData.post_time);
      } else if (formData.post_time && formData.post_time.includes('/')) {
        // post_time is already in simple format, keep it as is
        console.log('Keeping existing post_time format:', formData.post_time);
      }

      // Convert empty strings to null for optional fields (except post_time which is handled above)
      Object.keys(formData).forEach(key => {
        if (formData[key] === '' && key !== 'post_time') {
          formData[key] = null;
        }
        // Format other date fields to YYYY-MM-DD for database storage
        if ((key.includes('date') && key !== 'post_time') && formData[key]) {
          try {
            // Convert DD-MM-YYYY format to YYYY-MM-DD for database
            const convertedDate = formatDateToYYYYMMDD(formData[key]);
            if (convertedDate) {
              formData[key] = convertedDate;
            } else {
              // Fallback to original date processing for other formats
              if (typeof formData[key] === 'string' && !formData[key].includes('T')) {
                const date = new Date(formData[key]);
                if (isNaN(date.getTime())) {
                  throw new Error(`Invalid date for ${key}`);
                }
                formData[key] = date.toISOString().split('T')[0]; // Keep just the date part
              }
            }
          } catch (error) {
            console.error(`Date processing error for ${key}:`, error);
            throw new Error(`Invalid date format for ${key}: ${formData[key]}`);
          }
        }
      });

      // Convert numeric fields to numbers
      if (formData.total_posts) formData.total_posts = Number(formData.total_posts);
      if (formData.fee_general) formData.fee_general = Number(formData.fee_general);
      if (formData.fee_sc_st) formData.fee_sc_st = Number(formData.fee_sc_st);
      if (formData.fee_female) formData.fee_female = Number(formData.fee_female);
      if (formData.age_min) formData.age_min = Number(formData.age_min);
      if (formData.age_max) formData.age_max = Number(formData.age_max);

      console.log('Form data after processing:', formData);

      let result;
      if (editing) {
        // Update existing item
        result = await supabase
          .from(activeTab)
          .update(formData)
          .eq('id', editing)
          .select();
          
        if (result.data && result.data[0]) {
          // Optimistically update the data state for instant UI feedback
          const updatedData = data.map(item => 
            item.id === editing ? result.data[0] : item
          );
          
          // Sort by post_time if it's a content table
          if (['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab)) {
            updatedData.sort((a, b) => {
              const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
              const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
              return dateB - dateA; // Most recent first
            });
          }
          
          setData(updatedData);
        }
      } else {
        // Insert new item
        result = await supabase
          .from(activeTab)
          .insert([formData])
          .select();
          
        if (result.data && result.data[0]) {
          // Optimistically add the new item to data state for instant UI feedback
          let newData = [...data];
          
          // Add new item at the beginning (most recent)
          newData.unshift(result.data[0]);
          
          // Sort by post_time if it's a content table to ensure chronological order
          if (['jobs', 'results', 'admit_cards', 'answer_keys', 'admissions', 'documents'].includes(activeTab)) {
            newData.sort((a, b) => {
              const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
              const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
              return dateB - dateA; // Most recent first
            });
          }
          
          setData(newData);
          console.log('New entry added to top of list:', result.data[0].title || result.data[0].name);
        }
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
        throw new Error('No data returned from Supabase after operation');
      }

      setSuccess(editing ? 'Item updated successfully' : 'Item created successfully');
      setForm(DEFAULT_FORMS[activeTab]);
      setEditing(null);
      setShowForm(false);
      
      // Data is already updated optimistically above, no need to fetch again!
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'An error occurred while saving the data');
      setLoading(false);
      return;
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleQuickLinkToggle = async (id, currentValue) => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_quick_link: !currentValue })
        .eq('id', id);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      setError(`Failed to update quick link status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="loading-container">
          Loading...
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="no-items-container">
          No items found
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr className="table-header">
              {TABLE_COLUMNS[activeTab].map(column => (
                <th
                  key={column}
                  className="table-header-cell"
                >
                  {column.split('_').join(' ')}
                </th>
              ))}
              <th className="table-header-cell">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`table-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
              >
                {TABLE_COLUMNS[activeTab].map(column => (
                  <td
                    key={column}
                    className="table-cell"
                  >
                    {renderTableCell(item, column)}
                  </td>
                ))}
                <td className="table-cell">
                  <button
                    onClick={() => handleEdit(item)}
                    className="action-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="action-button delete-button"
                  >
                    Delete
                  </button>
                  {activeTab === 'jobs' && (
                    <button
                      onClick={() => handleQuickLinkToggle(item.id, item.is_quick_link)}
                      className={`action-button quick-link-button ${item.is_quick_link ? 'active' : ''}`}
                    >
                      Quick Link
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableCell = (item, column) => {
    const value = item[column];
    
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return <span className="text-muted">-</span>;
    }
    
    if (column === 'created_at' || column === 'post_time') {
      const dateTime = new Date(value);
      if (column === 'post_time') {
        // post_time is already in simple format like "08/07/2025 05:01 PM"
        return (
          <span 
            className="post-time-cell"
            onClick={() => {
              // Extract current date and time from simple format for prompt default
              const currentDateTime = value ? value : '';
              const currentDateOnly = currentDateTime ? currentDateTime.split(' ')[0] : '';
              const [day, month, year] = currentDateOnly.split('/');
              const defaultDate = year && month && day ? `${year}-${month}-${day}` : '';
              
              const newDate = prompt('Enter new post date (YYYY-MM-DD)', defaultDate);
              if (newDate) {
                // For quick edit, keep the existing time or use current time
                const existingTime = currentDateTime ? currentDateTime.split(' ').slice(1).join(' ') : '';
                const timeToUse = existingTime || getCurrentISTTimestamp().split(' ').slice(1).join(' ');
                const newDateTime = `${newDate.split('-').reverse().join('/')} ${timeToUse}`;
                handleQuickTimeUpdate(item.id, newDateTime);
              }
            }}
            title="Click to edit post date"
          >
            {value || 'No date'}
          </span>
        );
      }
      return dateTime.toLocaleDateString();
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (column.includes('date')) {
      return value ? formatDateToDDMMYYYY(value) || '-' : '-';
    }
    
    if (column.includes('_id') && typeof value === 'number') {
      return `ID: ${value}`;
    }
    
    if (column.includes('url') && value) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="url-link">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </a>
      );
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    if (typeof value === 'string' && value.length > 100) {
      return `${value.substring(0, 100)}...`;
    }
    
    return value.toString();
  };

  // Add function to handle quick post_time updates with instant UI update
  const handleQuickTimeUpdate = async (id, newDateTime) => {
    setError('');
    setSuccess('');
    
    try {
      let newTimestamp;
      
      // Check if newDateTime is already in our simple format or needs conversion
      if (newDateTime.includes('/') && newDateTime.includes(' ')) {
        // Already in simple format "DD/MM/YYYY HH:MM AM/PM"
        newTimestamp = newDateTime;
      } else {
        // Convert date (YYYY-MM-DD) to simple IST format with current time
        const selectedDate = new Date(newDateTime);
        const now = new Date();
        const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        
        // Format as DD/MM/YYYY HH:MM AM/PM
        const day = String(selectedDate.getUTCDate()).padStart(2, '0');
        const month = String(selectedDate.getUTCMonth() + 1).padStart(2, '0');
        const year = selectedDate.getUTCFullYear();
        
        let hours = istTime.getUTCHours();
        const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        newTimestamp = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      }
      
      console.log('Updating post_time for ID:', id, 'to:', newTimestamp);
      
      // INSTANT UI UPDATE - Update the data state immediately for instant feedback
      const updatedData = data.map(item => 
        item.id === id 
          ? { ...item, post_time: newTimestamp }
          : item
      );
      
      // Sort the updated data by post_time descending for instant reordering
      const sortedData = updatedData.sort((a, b) => {
        const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
        const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
        return dateB - dateA; // Most recent first
      });
      
      // Set the data immediately - INSTANT UPDATE!
      setData(sortedData);
      setSuccess('Post date updated successfully');
      
      // Update database in background (user doesn't wait)
      const { error } = await supabase
        .from(activeTab)
        .update({ post_time: newTimestamp })
        .eq('id', id);
      
      if (error) {
        console.error('Database update error:', error);
        // If database update fails, revert the UI change
        setData(data);
        setError(`Failed to update post date: ${error.message}`);
        return;
      }
      
      console.log('Database updated successfully');
      
    } catch (error) {
      console.error('Quick update error:', error);
      setError(`Failed to update post date: ${error.message}`);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="tabs-container">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-container">
        {activeTab === 'push_notifications' ? (
          <PushNotificationAdmin />
        ) : activeTab === 'push_tester' ? (
          <PushNotificationTester />
        ) : !showForm ? (
          <div className="add-new-button-container">
            <button
              onClick={() => {
                setShowForm(true);
                setEditing(null);
                setForm(DEFAULT_FORMS[activeTab]);
                setError('');
                setSuccess('');
              }}
              className="add-new-button"
            >
              Add New {TABS.find(t => t.key === activeTab)?.label.slice(0, -1)}
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className={`refresh-button ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>

          </div>
        ) : (
          <div className="form-container">
            <div className="form-header">
              <h3>
                {editing ? 'Edit' : 'Create'} {TABS.find(t => t.key === activeTab)?.label.slice(0, -1)}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setForm(DEFAULT_FORMS[activeTab]);
                  setError('');
                  setSuccess('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="form-grid">
              {/* Show auto-generated slug preview if title exists */}
              {(form.title || form.name) && form.slug && (
                <div className="slug-preview-container">
                  <div className="slug-preview-title">
                    Auto-generated URL slug:
                  </div>
                  <div className="slug-preview-value">
                    /{form.slug}
                  </div>
                </div>
              )}
              
              {Object.keys(DEFAULT_FORMS[activeTab]).map(key => {
                // Skip fields that are managed automatically
                if (key === 'display_order' || key === 'slug') return null;

                // Determine if this is a boolean field
                const isBoolean = typeof DEFAULT_FORMS[activeTab][key] === 'boolean';
                
                // Determine if this is a date field
                const isDate = key.toLowerCase().includes('date');
                
                // Determine if this is a post date field (post_time as date only)
                const isPostDate = key === 'post_time';
                
                // Determine if this is a number field
                const isNumber = ['fee_general', 'fee_sc_st', 'fee_obc', 'fee_female', 'total_posts', 'age_min', 'age_max'].includes(key);

                return (
                  <div key={key} className="form-group">
                    <label
                      htmlFor={key}
                      className="form-label"
                    >
                      {key.split('_').join(' ')}
                    </label>
                    
                    {isBoolean ? (
                      <select
                        id={key}
                        name={key}
                        value={form[key].toString()}
                        onChange={handleFormChange}
                        className="form-select"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : isPostDate ? (
                      <div className="date-time-inputs">
                        <input
                          type="date"
                          id={`${key}_date`}
                          value={form[key] ? convertPostTimeToDate(form[key]) : getCurrentDate()}
                          onChange={(e) => {
                            const date = e.target.value;
                            const currentTime = form[key] ? form[key].split(' ').slice(1).join(' ') : '12:00 PM';
                            const newDateTime = `${date.split('-').reverse().join('/')} ${currentTime}`;
                            handleFormChange({target: {name: key, value: newDateTime}});
                          }}
                          className="form-input date-input"
                        />
                        <input
                          type="time"
                          id={`${key}_time`}
                          value={form[key] ? convertPostTimeToTime(form[key]) : '12:00'}
                          onChange={(e) => {
                            const time24 = e.target.value; // HH:MM format
                            const [hours24, minutes] = time24.split(':');
                            let hours12 = parseInt(hours24);
                            const ampm = hours12 >= 12 ? 'PM' : 'AM';
                            hours12 = hours12 % 12;
                            hours12 = hours12 ? hours12 : 12;
                            const time12 = `${hours12}:${minutes} ${ampm}`;
                            
                            const currentDate = form[key] ? form[key].split(' ')[0] : getCurrentDate().split('-').reverse().join('/');
                            const newDateTime = `${currentDate} ${time12}`;
                            handleFormChange({target: {name: key, value: newDateTime}});
                          }}
                          className="form-input time-input"
                        />
                      </div>
                    ) : isDate ? (
                      <input
                        type="date"
                        id={key}
                        name={key}
                        value={form[key] || ''}
                        onChange={handleFormChange}
                        className="form-input"
                      />
                    ) : isNumber ? (
                      <input
                        type="number"
                        id={key}
                        name={key}
                        value={form[key] || ''}
                        onChange={handleFormChange}
                        className="form-input"
                      />
                    ) : key === 'status' ? (
                      <select
                        id={key}
                        name={key}
                        value={form[key]}
                        onChange={handleFormChange}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="Start">Start</option>
                        <option value="Date Extend">Date Extend</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        id={key}
                        name={key}
                        value={form[key] || ''}
                        onChange={handleFormChange}
                        className="form-input"
                      />
                    )}
                  </div>
                );
              })}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className={`submit-button ${loading ? 'disabled' : ''}`}
                >
                  {loading ? 'Processing...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && activeTab !== 'push_notifications' && activeTab !== 'push_tester' && renderTable()}
      </div>
    </div>
  );
};

export default AdminDashboard; 