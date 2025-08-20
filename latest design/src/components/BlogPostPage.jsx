import React from 'react';
import { useParams } from 'react-router-dom';
import { blogData } from './blogData'; // We will create this file next
import './BlogPostPage.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogData.find(p => p.slug === slug);

  if (!post) {
    return <div className="post-not-found"><h2>Post not found!</h2></div>;
  }

  return (
    <div className="blog-post-page">
      <article className="post-container">
        <header className="post-page-header">
          <div className="post-header-content">
            <span className="post-page-category">{post.category}</span>
            <h1 className="post-page-title">{post.title}</h1>
            <div className="post-page-meta">
              <span className="post-page-date">{post.date}</span>
              <span className="post-page-read-time">{post.readTime}</span>
            </div>
          </div>
        </header>

        <div className="post-page-content">
          <p className="post-page-introduction">{post.content.introduction}</p>
          
          {post.content.sections.map((section, index) => (
            <section key={index} className="post-section">
              <h2 className="post-section-title">{section.title}</h2>
              {section.points.map((point, pointIndex) => (
                <div key={pointIndex} className="point-block">
                  <h3 className="point-title">{point.title}</h3>
                  <p className="point-description">{point.description}</p>
                </div>
              ))}
            </section>
          ))}

          <section className="post-conclusion-section">
            <h2 className="post-section-title">Conclusion</h2>
            <p className="post-page-conclusion">{post.content.conclusion}</p>
          </section>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
