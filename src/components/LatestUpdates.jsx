import React from 'react';
import { Link } from 'react-router-dom';
import latestUpdatesData from './latestUpdatesData';
import './LatestUpdates.css'; // We will create this file for styling

const LatestUpdates = () => {
  return (
    <div className="latest-updates-page">
      <div className="page-header">
        <h1 className="page-title">Latest Updates</h1>
        <p className="page-subtitle">Your daily source for new job notifications, exam news, and government announcements.</p>
      </div>

      <div className="timeline-container">
        {latestUpdatesData.map((item, index) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-icon-container">
              <div className={`timeline-icon ${item.category.toLowerCase().replace(' ', '-')}`}>
                <i className={item.icon}></i>
              </div>
            </div>
            <div className="timeline-content">
              <span className="update-category">{item.category}</span>
              <h3 className="update-title">{item.title}</h3>
              <p className="update-date">{item.date}</p>
              <p className="update-description">{item.description}</p>
              <Link to={item.link} className="read-more-link">
                Read More <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestUpdates;
