import { supabase } from '../supabaseClient';

// Search categories with their corresponding tables and fields
// Order: Jobs -> Admit Cards -> Results -> Answer Keys -> Admissions -> Documents -> Syllabus
const SEARCH_CATEGORIES = {
  jobs: {
    table: 'jobs',
    searchFields: ['title', 'post_name', 'eligibility'],
    displayFields: ['id', 'title', 'slug', 'status', 'apply_end_date', 'created_at', 'post_time'],
    route: '/jobs',
    icon: '💼',
    label: 'Jobs',
    priority: 1
  },
  admit_cards: {
    table: 'admit_cards',
    searchFields: ['title', 'exam_name'],
    displayFields: ['id', 'title', 'slug', 'status', 'exam_date', 'created_at', 'post_time'],
    route: '/admit-card',
    icon: '🎫',
    label: 'Admit Cards',
    priority: 2
  },
  results: {
    table: 'results',
    searchFields: ['title', 'exam_name'],
    displayFields: ['id', 'title', 'slug', 'status', 'result_date', 'created_at', 'post_time'],
    route: '/results',
    icon: '📊',
    label: 'Results',
    priority: 3
  },
  answer_keys: {
    table: 'answer_keys',
    searchFields: ['title', 'exam_name'],
    displayFields: ['id', 'title', 'slug', 'status', 'exam_date', 'created_at', 'post_time'],
    route: '/answer-key',
    icon: '🔑',
    label: 'Answer Keys',
    priority: 4
  },
  admissions: {
    table: 'admissions',
    searchFields: ['title', 'course_name'],
    displayFields: ['id', 'title', 'slug', 'status', 'application_start', 'application_end', 'created_at', 'post_time'],
    route: '/admission',
    icon: '🎓',
    label: 'Admissions',
    priority: 5
  },
  documents: {
    table: 'documents',
    searchFields: ['title', 'description'],
    displayFields: ['id', 'title', 'slug', 'document_url', 'created_at', 'post_time'],
    route: '/documents',
    icon: '📄',
    label: 'Documents',
    priority: 6
  },
  syllabus: {
    table: 'syllabus',
    searchFields: ['title', 'exam_name', 'subject'],
    displayFields: ['id', 'title', 'slug', 'exam_name', 'subject', 'created_at', 'post_time'],
    route: '/syllabus',
    icon: '📚',
    label: 'Syllabus',
    priority: 7
  }
};

// Function to convert simple format to Date object for sorting
const convertSimpleFormatToDate = (postTime) => {
  if (!postTime) return new Date(0);
  try {
    if (postTime.includes('/')) {
      const parts = postTime.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0];
        const timePart = parts[1];
        const ampm = parts[2];
        
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        
        let hour24 = parseInt(hours);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
        return date;
      }
    }
    return new Date(postTime);
  } catch (error) {
    console.error('Error converting date:', error);
    return new Date(0);
  }
};

// Global search function that searches across all categories
export const globalSearch = async (query, categories = null, limit = 50) => {
  if (!query || query.trim().length < 2) {
    return { results: [], totalFound: 0 };
  }

  const searchTerm = query.trim().toLowerCase();
  
  // Get categories in priority order: Jobs -> Admit Cards -> Results -> etc.
  const categoriesToSearch = categories || Object.keys(SEARCH_CATEGORIES).sort((a, b) => {
    const priorityA = SEARCH_CATEGORIES[a].priority || 999;
    const priorityB = SEARCH_CATEGORIES[b].priority || 999;
    return priorityA - priorityB;
  });
  
  try {
    // Parallel searches across all categories
    const searchPromises = categoriesToSearch.map(async (categoryKey) => {
      const category = SEARCH_CATEGORIES[categoryKey];
      if (!category) return { category: categoryKey, results: [] };

      // Build search query with multiple field search
      let searchQuery = supabase
        .from(category.table)
        .select(category.displayFields.join(','))
        .limit(Math.ceil(limit / categoriesToSearch.length));

      // Create OR condition for multiple fields
      const orConditions = category.searchFields
        .map(field => `${field}.ilike.%${searchTerm}%`)
        .join(',');
      
      searchQuery = searchQuery.or(orConditions);

      // Order by post_time or created_at
      const orderField = category.displayFields.includes('post_time') ? 'post_time' : 'created_at';
      searchQuery = searchQuery.order(orderField, { ascending: false });

      const { data, error } = await searchQuery;

      if (error) {
        console.error(`Error searching ${categoryKey}:`, error);
        return { category: categoryKey, results: [] };
      }

      // Sort results by relevance and date
      const sortedResults = (data || [])
        .map(item => ({
          ...item,
          category: categoryKey,
          categoryLabel: category.label,
          route: `${category.route}/${item.slug}`,
          icon: category.icon,
          priority: category.priority || 999,
          relevanceScore: calculateRelevance(item, searchTerm, category.searchFields)
        }))
        .sort((a, b) => {
          // First sort by relevance, then by date
          if (a.relevanceScore !== b.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
          const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
          return dateB - dateA;
        });

      return { category: categoryKey, results: sortedResults };
    });

    const searchResults = await Promise.all(searchPromises);
    
    // Combine and sort all results with priority order
    const allResults = searchResults
      .flatMap(result => result.results)
      .sort((a, b) => {
        // First sort by category priority (Jobs -> Admit Cards -> Results -> etc.)
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        // Then sort by relevance score
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        // Finally sort by date (most recent first)
        const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
        const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
        return dateB - dateA;
      })
      .slice(0, limit);

    return {
      results: allResults,
      totalFound: allResults.length,
      categorizedResults: searchResults.reduce((acc, result) => {
        if (result.results.length > 0) {
          acc[result.category] = result.results;
        }
        return acc;
      }, {})
    };

  } catch (error) {
    console.error('Global search error:', error);
    return { results: [], totalFound: 0 };
  }
};

// Calculate relevance score based on search term match
const calculateRelevance = (item, searchTerm, searchFields) => {
  let score = 0;
  const term = searchTerm.toLowerCase();

  searchFields.forEach(field => {
    const fieldValue = (item[field] || '').toLowerCase();
    
    // Exact match in title gets highest score
    if (field === 'title' && fieldValue === term) {
      score += 100;
    }
    // Title starts with search term
    else if (field === 'title' && fieldValue.startsWith(term)) {
      score += 80;
    }
    // Title contains search term
    else if (field === 'title' && fieldValue.includes(term)) {
      score += 60;
    }
    // Other fields contain search term
    else if (fieldValue.includes(term)) {
      score += 30;
    }
    
    // Boost score for whole word matches
    const words = fieldValue.split(/\s+/);
    if (words.some(word => word === term)) {
      score += 40;
    }
  });

  return score;
};

// Quick search for specific category
export const categorySearch = async (query, category, limit = 20) => {
  const results = await globalSearch(query, [category], limit);
  return results.results;
};

// Get search suggestions based on partial input
export const getSearchSuggestions = async (query, limit = 10) => {
  if (!query || query.trim().length < 1) {
    return [];
  }

  try {
    // Get recent popular searches from multiple categories
    const suggestionPromises = Object.keys(SEARCH_CATEGORIES).map(async (categoryKey) => {
      const category = SEARCH_CATEGORIES[categoryKey];
      
      const { data } = await supabase
        .from(category.table)
        .select('title')
        .ilike('title', `%${query.trim()}%`)
        .limit(3)
        .order('created_at', { ascending: false });

      return (data || []).map(item => ({
        text: item.title,
        category: categoryKey,
        icon: category.icon
      }));
    });

    const allSuggestions = await Promise.all(suggestionPromises);
    
    return allSuggestions
      .flat()
      .slice(0, limit)
      .sort((a, b) => a.text.length - b.text.length); // Shorter matches first

  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

// Get trending searches (most recent posts)
export const getTrendingSearches = async (limit = 8) => {
  try {
    const trendingPromises = Object.entries(SEARCH_CATEGORIES).map(async ([categoryKey, category]) => {
      const { data } = await supabase
        .from(category.table)
        .select('title, slug, created_at, post_time')
        .limit(2)
        .order('created_at', { ascending: false });

      return (data || []).map(item => ({
        ...item,
        category: categoryKey,
        route: `${category.route}/${item.slug}`,
        icon: category.icon
      }));
    });

    const allTrending = await Promise.all(trendingPromises);
    
    return allTrending
      .flat()
      .sort((a, b) => {
        const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
        const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
        return dateB - dateA;
      })
      .slice(0, limit);

  } catch (error) {
    console.error('Error getting trending searches:', error);
    return [];
  }
};

export { SEARCH_CATEGORIES };
