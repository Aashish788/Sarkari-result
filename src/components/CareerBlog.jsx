import React from 'react';
import { Link } from 'react-router-dom';
import { blogData } from './blogData';
import './CareerBlog.css';

const CareerBlog = () => {
  return (
    <div className="career-blog">
      <div className="blog-header">
        <h1>Career Blog: Your Guide to Exam Success</h1>
        <p className="blog-subtitle">
          Expert tips, strategies, and guidance to help you excel in competitive exams and achieve your career goals.
        </p>
      </div>

      <div className="blog-list">
        {blogData.map(post => (
          <Link to={`/career-blog/${post.slug}`} key={post.id} className="blog-card-link">
            <article className="blog-card">
              <div className="card-content">
                <span className="card-category">{post.category}</span>
                <h2 className="card-title">{post.title}</h2>
                <p className="card-summary">{post.summary}</p>
                <div className="card-meta">
                  <span className="card-date">{post.date}</span>
                  <span className="card-read-time">{post.readTime}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareerBlog;
