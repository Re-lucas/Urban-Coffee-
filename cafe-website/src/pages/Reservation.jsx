// pages/Reservation.jsx (新建)
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/reservation.css';

const Reservation = () => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [reservationType, setReservationType] = useState('seat');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用 - 实际项目中替换为Google Calendar API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 生成可用时间段
        const slots = [];
        const startHour = reservationType === 'seat' ? 10 : 14;
        const endHour = reservationType === 'seat' ? 20 : 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          if (hour !== 13) { // 跳过午休时间
            slots.push(`${hour}:00`);
            if (reservationType === 'seat') {
              slots.push(`${hour}:30`);
            }
          }
        }
        
        setAvailableSlots(slots);
      } catch (error) {
        console.error('获取可用时段失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [date, reservationType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 预约提交逻辑
    alert(`预约成功！${date.toDateString()} ${timeSlot}, ${partySize}人`);
  };

  return (
    <div className="reservation-page">
      <h1 className="page-title">
        {reservationType === 'seat' ? '座位预约' : '咖啡课程预约'}
      </h1>
      
      <div className="container">
        <div className="reservation-options">
          <button 
            className={`option-btn ${reservationType === 'seat' ? 'active' : ''}`}
            onClick={() => setReservationType('seat')}
          >
            座位预约
          </button>
          <button 
            className={`option-btn ${reservationType === 'class' ? 'active' : ''}`}
            onClick={() => setReservationType('class')}
          >
            咖啡课程
          </button>
        </div>

        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>选择日期</label>
            <DatePicker 
              selected={date} 
              onChange={setDate} 
              minDate={new Date()}
              dateFormat="yyyy/MM/dd"
              className="date-picker"
            />
          </div>
          
          <div className="form-group">
            <label>选择时间</label>
            {isLoading ? (
              <div className="loading-slots">加载可用时段中...</div>
            ) : (
              <div className="time-slots">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot ${timeSlot === slot ? 'selected' : ''}`}
                    onClick={() => setTimeSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>
              {reservationType === 'seat' ? '人数' : '参加人数'}
            </label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}人</option>
              ))}
            </select>
          </div>
          
          {reservationType === 'class' && (
            <div className="form-group">
              <label>课程类型</label>
              <select>
                <option value="handbrew">手冲咖啡课程</option>
                <option value="latteart">拉花艺术课程</option>
                <option value="cupping">咖啡品鉴课程</option>
              </select>
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!timeSlot}
          >
            确认预约
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;