import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sortByDateConsistent } from '../utils/dateUtils';

const AdmitCardsPage = () => {
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdmitCards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admit_cards')
        .select('*');

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedAdmitCards = sortByDateConsistent(data, 'post_time', 'created_at');
        setAdmitCards(sortedAdmitCards);
      }
      setLoading(false);
    };

    fetchAdmitCards();
  }, []);

  // Filter admit cards based on search
  const filteredAdmitCards = admitCards.filter(card =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Admit Cards</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search admit cards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-skeleton">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : filteredAdmitCards.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🎫</div>
          <h3>No admit cards found</h3>
          <p>{search ? `No admit cards match "${search}"` : 'No admit cards available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredAdmitCards.map(card => (
            <div key={card.id} className="item-card">
              <Link to={`/admit-cards/${card.slug}`} className="item-link">
                <h3>{card.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${card.status.toLowerCase()}`}>
                    {card.status}
                  </span>
                  <span className="date">{new Date(card.created_at).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdmitCardsPage; 