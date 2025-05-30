// components/ContactForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import '../styles/contact-form.css';

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // 模拟API请求
    setTimeout(() => {
      console.log('表单数据:', data);
      toast.success('感谢您的留言！我们会尽快回复');
      reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="name">姓名</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: '请输入您的姓名' })}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: '请输入您的邮箱',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '邮箱格式不正确'
            }
          })}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="message">留言</label>
        <textarea
          id="message"
          rows="5"
          {...register('message', { 
            required: '请输入留言内容',
            minLength: {
              value: 10,
              message: '留言至少需要10个字符'
            }
          })}
          className={errors.message ? 'error' : ''}
        ></textarea>
        {errors.message && <p className="error-message">{errors.message.message}</p>}
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? '发送中...' : '发送留言'}
      </button>
    </form>
  );
};

export default ContactForm;