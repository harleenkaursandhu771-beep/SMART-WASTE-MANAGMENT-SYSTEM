import { useEffect, useState } from 'react';
import { HiOutlineSearch, HiOutlineDatabase, HiOutlineArrowSmUp, HiOutlineArrowSmDown, HiOutlineRefresh } from 'react-icons/hi';
import { getUsers, getBins, getReports, getTasks, getVehicles, getFeedback, getNotifications, getActivityLogs } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const DatabaseViewer = () => {
  const [collection, setCollection] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const collections = [
    { id: 'users', label: 'Users', fetchFn: getUsers },
    { id: 'bins', label: 'Bins', fetchFn: getBins },
    { id: 'reports', label: 'Reports', fetchFn: getReports },
    { id: 'tasks', label: 'Tasks', fetchFn: getTasks },
    { id: 'vehicles', label: 'Vehicles', fetchFn: getVehicles },
    { id: 'feedback', label: 'Feedback', fetchFn: getFeedback },
    { id: 'notifications', label: 'Notifications', fetchFn: getNotifications },
    { id: 'activitylogs', label: 'Activity Logs', fetchFn: getActivityLogs }
  ];

  useEffect(() => {
    fetchData();
    setSearch('');
    setSortField('');
    setSortOrder('asc');
    setCurrentPage(1);
  }, [collection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const activeCol = collections.find(c => c.id === collection);
      if (activeCol) {
        const res = await activeCol.fetchFn();
        setData(res.data || []);
      }
    } catch (err) {
      console.error(`Error fetching collection ${collection}:`, err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Safe nested value check for search / sort
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return '';
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : '', obj);
  };

  // Get dynamic table headers and cell rendering mappings
  const getColumnsConfig = () => {
    switch (collection) {
      case 'users':
        return [
          { label: 'ID', path: '_id', type: 'id' },
          { label: 'Name', path: 'name', type: 'text' },
          { label: 'Email', path: 'email', type: 'text' },
          { label: 'Role', path: 'role', type: 'role' },
          { label: 'Phone', path: 'phone', type: 'text' },
          { label: 'Address', path: 'address', type: 'text' }
        ];
      case 'bins':
        return [
          { label: 'Bin ID', path: 'binId', type: 'text' },
          { label: 'Location', path: 'location', type: 'text' },
          { label: 'Area', path: 'area', type: 'text' },
          { label: 'Waste Level', path: 'wasteLevel', type: 'level' },
          { label: 'Status', path: 'status', type: 'status' },
          { label: 'Assigned Worker', path: 'assignedWorker.name', type: 'ref' }
        ];
      case 'reports':
        return [
          { label: 'Report ID', path: 'reportId', type: 'text' },
          { label: 'Citizen', path: 'citizenId.name', type: 'ref' },
          { label: 'Bin Location', path: 'binId.location', type: 'ref' },
          { label: 'Description', path: 'description', type: 'desc' },
          { label: 'Status', path: 'status', type: 'status' },
          { label: 'Created At', path: 'createdAt', type: 'date' }
        ];
      case 'tasks':
        return [
          { label: 'Task ID', path: 'taskId', type: 'text' },
          { label: 'Worker', path: 'workerId.name', type: 'ref' },
          { label: 'Bin ID', path: 'binId.binId', type: 'ref' },
          { label: 'Collection Date', path: 'collectionDate', type: 'date' },
          { label: 'Status', path: 'status', type: 'status' }
        ];
      case 'vehicles':
        return [
          { label: 'Vehicle ID', path: 'vehicleId', type: 'text' },
          { label: 'Vehicle Number', path: 'vehicleNumber', type: 'text' },
          { label: 'Driver', path: 'driverName', type: 'text' },
          { label: 'Capacity (kg)', path: 'capacity', type: 'text' },
          { label: 'Worker Link', path: 'assignedWorker.name', type: 'ref' },
          { label: 'Status', path: 'status', type: 'status' }
        ];
      case 'feedback':
        return [
          { label: 'ID', path: '_id', type: 'id' },
          { label: 'Citizen', path: 'citizenId.name', type: 'ref' },
          { label: 'Rating', path: 'rating', type: 'rating' },
          { label: 'Comment', path: 'comment', type: 'desc' },
          { label: 'Date', path: 'createdAt', type: 'date' }
        ];
      case 'notifications':
        return [
          { label: 'Recipient', path: 'recipientId.name', type: 'ref' },
          { label: 'Message', path: 'message', type: 'desc' },
          { label: 'Type', path: 'type', type: 'text' },
          { label: 'Read Status', path: 'readStatus', type: 'boolean' },
          { label: 'Date', path: 'createdAt', type: 'date' }
        ];
      case 'activitylogs':
        return [
          { label: 'Action', path: 'action', type: 'text' },
          { label: 'Entity Type', path: 'entityType', type: 'text' },
          { label: 'Entity ID', path: 'entityId', type: 'id' },
          { label: 'Actor', path: 'userId.name', type: 'ref' },
          { label: 'Details', path: 'details', type: 'desc' },
          { label: 'Date', path: 'createdAt', type: 'date' }
        ];
      default:
        return [];
    }
  };

  const columns = getColumnsConfig();

  // Search filter
  const searchedData = data.filter(item => {
    if (!search) return true;
    return columns.some(col => {
      const val = getNestedValue(item, col.path);
      return String(val).toLowerCase().includes(search.toLowerCase());
    });
  });

  // Sorting
  const sortedData = [...searchedData].sort((a, b) => {
    if (!sortField) return 0;
    const valA = getNestedValue(a, sortField);
    const valB = getNestedValue(b, sortField);

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    
    if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
    if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const renderCell = (item, col) => {
    const val = getNestedValue(item, col.path);
    
    switch (col.type) {
      case 'id':
        return <span className="font-mono text-xs text-white/50">{val}</span>;
      case 'date':
        return val ? new Date(val).toLocaleDateString() + ' ' + new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
      case 'role':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            val === 'admin' ? 'bg-purple-500/20 text-purple-300' :
            val === 'worker' ? 'bg-teal-500/20 text-teal-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {val}
          </span>
        );
      case 'status':
        return <StatusBadge status={val} />;
      case 'level':
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${val > 80 ? 'bg-red-400' : val > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${val}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{val}%</span>
          </div>
        );
      case 'ref':
        return val ? <span className="font-medium text-white/90">{val}</span> : <span className="text-white/30 italic">Unassigned</span>;
      case 'desc':
        return <span className="truncate max-w-[200px] block" title={val}>{val}</span>;
      case 'boolean':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            val ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {val ? 'Read' : 'Unread'}
          </span>
        );
      case 'rating':
        return <span className="text-amber-400 font-bold">★ {val} / 5</span>;
      default:
        return val || '-';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HiOutlineDatabase className="text-primary-400" /> Database Explorer
          </h2>
          <p className="text-sm text-white/40">DBMS administrative view for all core MongoDB collections</p>
        </div>
        <button onClick={fetchData} className="btn-ghost py-2 flex items-center gap-2 text-xs w-fit">
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
        </button>
      </div>

      {/* Collection Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => setCollection(col.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border flex-shrink-0 ${
              collection === col.id
                ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border-primary-500/30 shadow-lg'
                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Search and Metadata */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={`Search ${collection}...`}
            className="glass-input w-full pl-12"
          />
        </div>
        <div className="text-xs text-white/40">
          Showing {sortedData.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} records
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : sortedData.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/30 text-sm">No records found matching search query.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-glass">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th 
                      key={col.path} 
                      onClick={() => handleSort(col.path)}
                      className="cursor-pointer select-none hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {sortField === col.path ? (
                          sortOrder === 'asc' ? <HiOutlineArrowSmUp className="w-3.5 h-3.5" /> : <HiOutlineArrowSmDown className="w-3.5 h-3.5" />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id}>
                    {columns.map(col => (
                      <td key={col.path}>
                        {renderCell(item, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-ghost py-1.5 px-3.5 text-xs disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous
              </button>
              <div className="text-xs text-white/50">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-ghost py-1.5 px-3.5 text-xs disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseViewer;
