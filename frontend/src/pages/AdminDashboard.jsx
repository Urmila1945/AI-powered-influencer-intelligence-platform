import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldAlert, Users, Activity, Settings as SettingsIcon, Search, LogIn, LogOut, Database, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [actRes, usrRes, sysRes] = await Promise.all([
          api.get('/admin/activities'),
          api.get('/admin/users'),
          api.get('/admin/system-status')
        ]);
        setActivities(actRes.data);
        setUsers(usrRes.data);
        setSystemStatus(sysRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <LogIn size={16} className="text-success" />;
      case 'LOGOUT': return <LogOut size={16} className="text-gray-400" />;
      case 'SEARCH': return <Search size={16} className="text-primary" />;
      case 'REGISTER': return <Users size={16} className="text-secondary" />;
      default: return <Activity size={16} className="text-white" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldAlert className="text-red-500" /> Admin Command Center
        </h1>
        <p className="text-gray-400">Exclusive access: System configuration and global activity monitoring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* System Settings & Integrations */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-red-500/20"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Database className="text-red-500" /> System Integrations
            </h3>
            <div className="space-y-4">
              {systemStatus.map(api => (
                <div key={api.name} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="font-medium text-sm">{api.name}</span>
                  <div className="flex items-center gap-2">
                    {api.status === 'Connected' ? (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    <span className={`text-xs font-bold ${api.status === 'Connected' ? 'text-success' : 'text-red-500'}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="text-primary" /> Registered Users ({users.length})
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {users.map(u => (
                <div key={u._id} className="p-3 bg-white/5 border border-white/10 rounded-lg flex flex-col">
                  <span className="font-bold text-sm flex items-center gap-2">
                    {u.name} {u.is_admin && <ShieldAlert size={12} className="text-red-500" />}
                  </span>
                  <span className="text-xs text-gray-400">{u.email}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card h-full"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="text-secondary" /> Global Activity Feed
            </h3>
            
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {activities.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No activities recorded yet.</div>
              ) : (
                activities.map(act => (
                  <div key={act._id} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="mt-1 shrink-0 p-2 bg-background rounded-lg border border-white/10">
                      {getActionIcon(act.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm text-white truncate">{act.user_email}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          act.action === 'LOGIN' ? 'bg-success/20 text-success' :
                          act.action === 'LOGOUT' ? 'bg-gray-500/20 text-gray-300' :
                          act.action === 'REGISTER' ? 'bg-secondary/20 text-secondary' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {act.action}
                        </span>
                        <p className="text-sm text-gray-400 truncate">{act.details}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
