import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // Filter out persistent notifications (they should only appear in the panel)
  const toastNotifications = notifications.filter(n => !n.persistent);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {toastNotifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              id={notification.id!}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => removeNotification(notification.id!)}
              duration={notification.duration}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
