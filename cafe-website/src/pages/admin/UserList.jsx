// src/pages/admin/UserList.jsx
import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Link } from 'react-router-dom';
import '../../styles/admin-userlist.css';

const UserList = () => {
  const { users } = useAdminAuth();
  const [searchText, setSearchText] = useState('');

  // 根据 searchText 过滤用户
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, users]);

  return (
    <div className="admin-userlist">
      <h2>用户管理</h2>

      {/* 搜索框 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索 用户名 或 邮箱"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 用户表格 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>等级</th>
            <th>积分</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                无匹配用户
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id.slice(0, 8)}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.level}</td>
                <td>{u.points}</td>
                <td>{new Date(u.joinDate).toLocaleString()}</td>
                <td>
                  <Link to={`/admin/users/${u.id}`}>查看详情</Link>
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