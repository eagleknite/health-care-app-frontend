// components/NotificationDropdown.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/slices/notificationSlice';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  React.useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  return (
    <div  className="relative">
      <span className="relative cursor-pointer p-2 hover:bg-blue-700 rounded" onClick={() => setIsOpen(!isOpen)}>
        🛎️
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
      )}
      </span>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-xl z-10">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="border-b last:border-b-0 p-2">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
              {!notification.isRead && (
                <button className="text-xs text-blue-500 mt-1" onClick={() => handleRead(notification._id)}>
                  Mark as read
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="p-2 text-sm text-gray-500">No notifications</p>
        )}
        <div className="p-2">
          <button className="text-xs text-blue-500" onClick={() => dispatch(markAllNotificationsAsRead())}>
            Mark all as read
          </button>
        </div>
        <div className="p-2">
          <button className="text-xs text-red-500" onClick={() => dispatch(deleteNotification())}>
            Delete all
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
