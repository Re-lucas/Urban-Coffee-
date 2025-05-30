// pages/Contact.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <div className="contact-page">
      <h1 className="page-title">联系我们</h1>
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>店铺信息</h2>
            <p><strong>地址：</strong>温哥华市中心咖啡街123号</p>
            <p><strong>电话：</strong>(604) 123-4567</p>
            <p><strong>营业时间：</strong>周一至周五 7:00 - 20:00</p>
          </div>
          
          <div className="contact-form-section">
            <h2>发送留言</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;