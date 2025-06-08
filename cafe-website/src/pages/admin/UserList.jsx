// src/pages/admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import '../../styles/admin-userlist.css';

const UserList = () => {
  const { user } = useAuth(); // 只用于当前登录者的 _id，权限已由路由守卫兜底
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users');
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取用户列表失败');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 处理删除用户
  const handleDelete = async (userId) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销！')) {
      try {
        setLoading(true);
        await api.delete(`/users/${userId}`);
        // 删除成功后更新列表
        setUsers(users.filter(u => u._id !== userId));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '删除用户失败');
        setLoading(false);
      }
    }
  };

  // 过滤用户
  const filteredUsers = users.filter(u => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      (u._id && u._id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="admin-userlist">
      <h2>用户管理</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索用户名、邮箱或ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>管理员</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                {loading ? '加载中...' : '无匹配用户'}
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u._id.slice(0, 8)}...</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={u.isAdmin ? 'admin-true' : 'admin-false'}>
                    {u.isAdmin ? '是' : '否'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <Link to={`/admin/users/${u._id}`} className="btn-edit">
                    编辑
                  </Link>
                  <button 
                    onClick={() => handleDelete(u._id)} 
                    className="btn-delete"
                    disabled={u._id === user?._id} // 不能删除自己
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
