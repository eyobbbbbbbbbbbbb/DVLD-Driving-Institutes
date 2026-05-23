'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNotifications() {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);
        const personId = user.personId;
        if (!personId) {
          setError('No person profile associated with user.');
          setLoading(false);
          return;
        }

        const data = await apiClient.get<any[]>(`/Messages/${personId}`);
        const mapped = data.map((n) => ({
          id: n.messageID.toString(),
          userId: n.personID.toString(),
          title: n.title,
          message: n.content,
          type:
            n.messageType === 'Warning'
              ? ('warning' as const)
              : n.messageType === 'Success'
              ? ('success' as const)
              : ('info' as const),
          read: n.isRead,
          createdAt: n.createdAt,
          actionUrl: null as string | null,
        }));
        setNotifications(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/Messages/read/${id}`);
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-400" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-rose-400" />;
      default:
        return <Info size={20} className="text-cyan-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-emerald-400';
      case 'warning':
        return 'border-l-4 border-amber-400';
      case 'error':
        return 'border-l-4 border-rose-400';
      default:
        return 'border-l-4 border-cyan-400';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="mt-1 text-muted-foreground">
          Stay updated with important school notifications
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-rose-400 border border-rose-500/30">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'ghost'}
          className={filter === 'all' ? 'bg-cyan-500/20 text-cyan-400' : 'text-muted-foreground'}
        >
          All ({notifications.length})
        </Button>
        <Button
          onClick={() => setFilter('unread')}
          variant={filter === 'unread' ? 'default' : 'ghost'}
          className={filter === 'unread' ? 'bg-cyan-500/20 text-cyan-400' : 'text-muted-foreground'}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`glass rounded-lg border border-slate-800/50 p-6 card-hover ${getColor(
              notification.type
            )} ${!notification.read ? 'bg-slate-800/50' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1">{getIcon(notification.type)}</div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:bg-cyan-500/20"
                      >
                        Mark Read
                      </Button>
                    )}
                    {notification.actionUrl && (
                      <Button
                        onClick={() =>
                          (window.location.href = notification.actionUrl!)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:bg-blue-500/20"
                      >
                        View
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(notification.id)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <Info size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications'}
          </p>
        </div>
      )}
    </div>
  );
}
