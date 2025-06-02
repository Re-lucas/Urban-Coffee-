// src/pages/Account.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/account.css';       // 之前已经有的基础样式
import '../styles/account-extra.css'; // 新增的“个人信息与偏好设置”专属样式

const Account = () => {
  // 1. 从 Context 里拿到用户和相关更新函数
  const {
    user,
    points,
    level,
    logout,
    addPoints,             // 如果还想测试积分，这里保留
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    updatePreferences,
    updateNotifications,
  } = useContext(AuthContext);

  // 2. 本组件内部的状态
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' 或 'preferences'

  // 2.1. 基本信息表单状态：用 local state 临时存储输入框的值
  const [editName, setEditName] = useState(user?.name || '');
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

  // 2.2. 地址新增/编辑相关状态
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    id: null,
    label: '',
    recipient: '',
    phone: '',
    fullAddress: '',
  });

  // 2.3. 偏好标签选项（可根据实际业务扩展）
  const allFlavorTags = ['果香', '花香', '浓郁', '坚果风味', '巧克力', '焦糖'];
  const [selectedPrefs, setSelectedPrefs] = useState(user?.preferences || []);

  // 2.4. 通知设置状态
  const [notifSettings, setNotifSettings] = useState(
    user?.notifications || { orderStatus: true, marketing: false }
  );

  // 3. 当 user 更新时，同步本地状态
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setPreviewAvatar(user.avatar || '');
      setSelectedPrefs(user.preferences || []);
      setNotifSettings(user.notifications || { orderStatus: true, marketing: false });
    }
  }, [user]);

  // 4. 头像上传处理：使用 FileReader 生成 Base64，再调用 updateProfile
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setPreviewAvatar(base64Url);
      updateProfile({ avatar: base64Url });
    };
    reader.readAsDataURL(file);
  };

  // 5. 保存“基本信息”——这里只修改昵称（头像已在上传时保存）
  const handleSaveBasicInfo = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('昵称不能为空');
      return;
    }
    updateProfile({ name: editName });
    alert('基本信息已更新');
  };

  // 6. 地址表单提交（区分“新增”或“编辑”）
  const handleAddressFormSubmit = (e) => {
    e.preventDefault();
    const { id, label, recipient, phone, fullAddress } = addressFormData;
    if (!label || !recipient || !phone || !fullAddress) {
      alert('请完整填写地址信息');
      return;
    }
    if (id) {
      // 已有 id，则编辑
      updateAddress(addressFormData);
    } else {
      // 新增
      addAddress(addressFormData);
    }
    setIsAddressFormOpen(false);
  };

  // 7. 点击“编辑地址”时，把对应地址填入表单
  const handleEditAddress = (addr) => {
    setAddressFormData(addr);
    setIsAddressFormOpen(true);
  };

  // 8. 点击“删除地址”时调用 removeAddress
  const handleDeleteAddress = (addrId) => {
    if (window.confirm('确认删除该地址？')) {
      removeAddress(addrId);
    }
  };

  // 9. 偏好标签勾选/取消勾选
  const handleFlavorToggle = (tag) => {
    let newPrefs;
    if (selectedPrefs.includes(tag)) {
      newPrefs = selectedPrefs.filter((t) => t !== tag);
    } else {
      newPrefs = [...selectedPrefs, tag];
    }
    setSelectedPrefs(newPrefs);
    updatePreferences(newPrefs);
  };

  // 10. 通知开关切换
  const handleNotifToggle = (type) => {
    const newSettings = { ...notifSettings, [type]: !notifSettings[type] };
    setNotifSettings(newSettings);
    updateNotifications(newSettings);
  };

  if (!user) {
    // 如果还没登录，可重定向或提示
    return <p>请先登录后查看账户信息。</p>;
  }

  return (
    <div className="account-page">
      <h1 className="page-title">我的账户</h1>

      {/* ===== 1. 选项卡导航 ===== */}
      <div className="tabs">
        <button
          className={activeTab === 'profile' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('profile')}
        >
          基本信息
        </button>
        <button
          className={activeTab === 'preferences' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('preferences')}
        >
          偏好设置
        </button>
        <button className="tab logout" onClick={logout}>
          退出登录
        </button>
      </div>

      {/* ===== 2. “基本信息” 面板 ===== */}
      {activeTab === 'profile' && (
        <div className="tab-content">
          <form className="basic-info-form" onSubmit={handleSaveBasicInfo}>
            {/* 2.1. 头像上传与预览 */}
            <div className="avatar-section">
              <div className="avatar-preview">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="头像预览" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="avatar-upload-btn">
                上传头像
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* 2.2. 昵称 编辑 */}
            <div className="form-group">
              <label>昵称：</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="请输入昵称"
              />
            </div>

            {/* 2.3. 邮箱（只读） */}
            <div className="form-group">
              <label>邮箱：</label>
              <input type="email" value={user.email} readOnly />
            </div>

            <button type="submit" className="btn save-btn">
              保存基本信息
            </button>
          </form>

          {/* 2.4. 地址管理 */}
          <div className="address-section">
            <h2>收货地址</h2>
            {/* 地址列表 */}
            {user.addresses && user.addresses.length > 0 ? (
              <ul className="address-list">
                {user.addresses.map((addr) => (
                  <li key={addr.id} className="address-item">
                    <div><strong>{addr.label}</strong> — {addr.recipient}</div>
                    <div>{addr.phone}</div>
                    <div>{addr.fullAddress}</div>
                    <div className="address-actions">
                      <button onClick={() => handleEditAddress(addr)}>编辑</button>
                      <button onClick={() => handleDeleteAddress(addr.id)}>
                        删除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-address">暂无任何地址，快去新增一个吧！</p>
            )}
            {/* “新增地址” 按钮 */}
            <button
              className="btn add-address-btn"
              onClick={() => {
                setAddressFormData({
                  id: null,
                  label: '',
                  recipient: '',
                  phone: '',
                  fullAddress: '',
                });
                setIsAddressFormOpen(true);
              }}
            >
              新增地址
            </button>

            {/* 新增/编辑 地址表单（弹出或展开） */}
            {isAddressFormOpen && (
              <div className="address-form-container">
                <h3>{addressFormData.id ? '编辑地址' : '新增地址'}</h3>
                <form onSubmit={handleAddressFormSubmit} className="address-form">
                  <div className="form-group">
                    <label>地址标签：</label>
                    <input
                      type="text"
                      value={addressFormData.label}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      placeholder="如：家、公司"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>收件人：</label>
                    <input
                      type="text"
                      value={addressFormData.recipient}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          recipient: e.target.value,
                        }))
                      }
                      placeholder="姓名"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>联系电话：</label>
                    <input
                      type="tel"
                      value={addressFormData.phone}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="手机号码"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>详细地址：</label>
                    <textarea
                      value={addressFormData.fullAddress}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          fullAddress: e.target.value,
                        }))
                      }
                      placeholder="省市区+街道门牌号"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn save-btn">
                      保存地址
                    </button>
                    <button
                      type="button"
                      className="btn cancel-btn"
                      onClick={() => setIsAddressFormOpen(false)}
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== 3. “偏好设置” 面板 ===== */}
      {activeTab === 'preferences' && (
        <div className="tab-content">
          <div className="preferences-section">
            <h2>口味偏好</h2>
            <div className="flavor-tags">
              {allFlavorTags.map((tag) => (
                <label key={tag} className="flavor-tag">
                  <input
                    type="checkbox"
                    checked={selectedPrefs.includes(tag)}
                    onChange={() => handleFlavorToggle(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="notifications-section">
            <h2>通知设置</h2>
            <div className="notification-item">
              <label>订单状态通知</label>
              <input
                type="checkbox"
                checked={notifSettings.orderStatus}
                onChange={() => handleNotifToggle('orderStatus')}
              />
            </div>
            <div className="notification-item">
              <label>营销消息通知</label>
              <input
                type="checkbox"
                checked={notifSettings.marketing}
                onChange={() => handleNotifToggle('marketing')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
