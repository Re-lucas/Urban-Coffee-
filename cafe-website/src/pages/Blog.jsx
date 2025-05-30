// pages/Blog.jsx
import React, { useState } from 'react';

const Blog = () => {
  const [posts] = useState([
    {
      id: 1,
      title: "咖啡烘焙的艺术",
      date: "2025-05-15",
      excerpt: "探索从浅焙到深焙如何影响咖啡的风味特征...",
    },
    {
      id: 2,
      title: "手冲咖啡技巧指南",
      date: "2025-04-28",
      excerpt: "掌握完美手冲咖啡的五个关键步骤...",
    },
    {
      id: 3,
      title: "单一产地 vs 混合咖啡",
      date: "2025-04-10",
      excerpt: "了解不同咖啡豆来源的独特风味特点...",
    }
  ]);

  return (
    <div className="blog-page">
      <h1 className="page-title">咖啡博客</h1>
      <div className="container">
        <div className="blog-intro">
          <p>探索咖啡世界的最新资讯、冲泡技巧和行业趋势</p>
        </div>
        
        <div className="blog-posts">
          {posts.map(post => (
            <div key={post.id} className="blog-post">
              <h2>{post.title}</h2>
              <p className="post-date">{post.date}</p>
              <p className="post-excerpt">{post.excerpt}</p>
              <button className="read-more">阅读更多</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;