// components/SocialIcons.jsx
import React from 'react';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import '../styles/social-icons.css';

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FiInstagram size={20} />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FiFacebook size={20} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FiTwitter size={20} />
      </a>
    </div>
  );
};

export default SocialIcons;