import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Copy,
  Download,
  Flame,
  Clock,
  Check,
  UserCheck,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { ActionItem, Priority } from '../types.ts';

interface ActionItemsTableProps {
  meetingTitle: string;
  meetingDate: string;
  items: ActionItem[];
  attendees: string[];
  onToggleDone: (id: string) => void;
  onUpdateOwner: (id: string, newOwner: string) => void;
  onUpdateItem: (updated: ActionItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: ActionItem) => void;
  onTriggerToast: (msg: string) => void;
}

export const ActionItemsTable: React.FC<ActionItemsTableProps> = ({
  meetingTitle,
  meetingDate,
  items,
  attendees,
  onToggleDone,
  onUpdateOwner,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onTriggerToast,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unassigned' | 'high' | 'open' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('Medium');

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newOwner, setNewOwner] = useState('[UNASSIGNED - Needs Volunteer]');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');

  // Quick assigning dropdown state
  const [assignDropdownId, setAssignDropdownId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterMode === 'unassigned' && item.owner !== '[UNASSIGNED - Needs Volunteer]') return false;
    if (filterMode === 'high' && item.priority !== 'High') return false;
    if (filterMode === 'open' && item.done) return false;
    if (filterMode === 'done' && !item.done) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchOwner = item.owner.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      return matchDesc || matchOwner || matchCategory;
    }
    return true;
  });

  const unassignedCount = items.filter((i) => i.owner === '[UNASSIGNED - Needs Volunteer]').length;
  const completedCount = items.filter((i) => i.done).length;

  // Copy as Markdown
  const handleCopyMarkdown = () => {
    let md = `# Action Items: ${meetingTitle} (${meetingDate})\n\n`;
    md += `| Status | Task Description | Owner | Deadline | Priority | Category |\n`;
    md += `| :---: | :--- | :--- | :--- | :---: | :--- |\n`;
    items.forEach((item) => {
      const status = item.done ? '[x]' : '[ ]';
      const cleanDesc = item.description.replace(/\|/g, '\\|');
      const cleanOwner = item.owner.replace(/\|/g, '\\|');
      md += `| ${status} | ${cleanDesc} | ${cleanOwner} | ${item.deadline} | ${item.priority} | ${item.category || 'General'} |\n`;
    });
    navigator.clipboard.writeText(md);
    onTriggerToast('📋 Action Items copied as Markdown table!');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Status', 'Task Description', 'Owner', 'Deadline', 'Priority', 'Category', 'Notes'];
    const rows = items.map((item) => [
      item.done ? 'Completed' : 'Pending',
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.owner.replace(/"/g, '""')}"`,
      `"${item.deadline}"`,
      item.priority,
      `"${item.category || ''}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const cleanFileName = meetingTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    link.setAttribute('download', `actions-${cleanFileName}-${meetingDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast('💾 Downloaded Action Items CSV file!');
  };

  const startEdit = (item: ActionItem) => {
    setEditingId(item.id);
    setEditDesc(item.description);
    setEditOwner(item.owner);
    setEditDeadline(item.deadline);
    setEditPriority(item.priority);
  };

  const saveEdit = (id: string) => {
    const existing = items.find((i) => i.id === id);
    if (existing) {
      onUpdateItem({
        ...existing,
        description: editDesc,
        owner: editOwner,
        deadline: editDeadline,
        priority: editPriority,
      });
      setEditingId(null);
      onTriggerToast('Updated action item');
    }
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      description: newDesc.trim(),
      owner: newOwner || '[UNASSIGNED - Needs Volunteer]',
      deadline: newDeadline || 'Standard turnaround',
      priority: newPriority,
      done: false,
      category: 'General',
    };
    onAddItem(newItem);
    setShowAddModal(false);
    setNewDesc('');
    setNewOwner('[UNASSIGNED - Needs Volunteer]');
    setNewDeadline('');
    onTriggerToast('Added new action item');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Controls: Buttons & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Left: Filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterMode('unassigned')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              filterMode === 'unassigned'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Needs Volunteer ({unassignedCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('high')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterMode === 'high'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setFilterMode('open')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterMode === 'open'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Open ({items.length - completedCount})
          </button>
          <button
            onClick={() => setFilterMode('done')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterMode === 'done'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {/* Right: Export & Add Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition shadow-sm cursor-pointer"
            title="Copy entire table as Markdown"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Copy as Markdown</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition shadow-sm cursor-pointer"
            title="Export action items to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition cursor-pointer"
            title="Add task manually"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tasks by keyword, owner, or category..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* Action Items Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-slate-950/40 shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3 w-10 text-center">Done</th>
              <th className="py-3 px-4 min-w-[280px]">Task Description (Imperative Action)</th>
              <th className="py-3 px-3 min-w-[190px]">Owner</th>
              <th className="py-3 px-3 min-w-[150px]">Deadline</th>
              <th className="py-3 px-3 min-w-[95px] text-center">Priority</th>
              <th className="py-3 px-3 w-14 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No action items match the active filter.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isUnassigned = item.owner === '[UNASSIGNED - Needs Volunteer]';
                const isEditing = editingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors group ${
                      item.done
                        ? 'bg-slate-950/30 text-slate-500'
                        : isUnassigned
                        ? 'bg-rose-950/10 hover:bg-rose-950/20'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Done Checkbox */}
                    <td className="py-3 px-3 text-center align-top">
                      <button
                        onClick={() => onToggleDone(item.id)}
                        className={`transition cursor-pointer inline-flex items-center justify-center p-0.5 rounded-md ${
                          item.done
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-slate-600 hover:text-cyan-400'
                        }`}
                        title={item.done ? 'Mark pending' : 'Mark completed'}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </td>

                    {/* Task Description */}
                    <td className="py-3 px-4 align-top">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-cyan-500 text-white text-xs"
                        />
                      ) : (
                        <div>
                          <div
                            className={`font-medium leading-relaxed ${
                              item.done ? 'line-through text-slate-500' : 'text-slate-100'
                            }`}
                          >
                            {item.description}
                          </div>
                          {item.category && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700/50">
                              {item.category}
                            </span>
                          )}
                          {item.notes && (
                            <p className="text-[11px] text-amber-400/90 mt-0.5 italic">{item.notes}</p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Owner Column (Purple pill or Red dashed pill) */}
                    <td className="py-3 px-3 align-top relative">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editOwner}
                          onChange={(e) => setEditOwner(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-cyan-500 text-white text-xs"
                        />
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          {isUnassigned ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/40 text-rose-400 border border-dashed border-rose-500/70 shadow-sm animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                                <span>[UNASSIGNED - Needs Volunteer]</span>
                              </span>
                              {/* Quick Claim Button */}
                              <button
                                onClick={() =>
                                  setAssignDropdownId(assignDropdownId === item.id ? null : item.id)
                                }
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-600/50 transition cursor-pointer shadow"
                                title="Assign or volunteer for this task"
                              >
                                Volunteer
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/70 text-purple-300 border border-purple-700/60 shadow-sm">
                                <UserCheck className="w-3 h-3 text-purple-400" />
                                <span>{item.owner}</span>
                              </span>
                              <button
                                onClick={() =>
                                  setAssignDropdownId(assignDropdownId === item.id ? null : item.id)
                                }
                                className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-400 hover:text-cyan-400"
                                title="Reassign owner"
                              >
                                change
                              </button>
                            </div>
                          )}

                          {/* Quick Assign Dropdown */}
                          {assignDropdownId === item.id && (
                            <div className="absolute left-3 top-10 z-30 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 animate-in fade-in">
                              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 mb-1">
                                Assign Task To:
                              </div>
                              {attendees.map((att) => (
                                <button
                                  key={att}
                                  onClick={() => {
                                    onUpdateOwner(item.id, att);
                                    setAssignDropdownId(null);
                                    onTriggerToast(`Assigned task to ${att}!`);
                                  }}
                                  className="w-full text-left px-2 py-1 rounded text-xs text-slate-200 hover:bg-indigo-900/50 hover:text-cyan-300 transition flex items-center justify-between"
                                >
                                  <span>{att}</span>
                                  {item.owner === att && <Check className="w-3 h-3 text-cyan-400" />}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  onUpdateOwner(item.id, '[UNASSIGNED - Needs Volunteer]');
                                  setAssignDropdownId(null);
                                  onTriggerToast('Flagged task as unassigned!');
                                }}
                                className="w-full text-left px-2 py-1 rounded text-xs text-rose-300 hover:bg-rose-950/50 transition border-t border-slate-800 mt-1"
                              >
                                Mark [UNASSIGNED]
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Deadline Column */}
                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-cyan-500 text-white text-xs"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className={`font-semibold ${item.done ? 'text-slate-500' : 'text-slate-200'}`}>
                            {item.deadline}
                          </span>
                          {item.rawDeadlineText && (
                            <span className="text-[10px] text-cyan-400/80 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{item.rawDeadlineText}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Priority Column */}
                    <td className="py-3 px-3 align-top text-center">
                      {isEditing ? (
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as Priority)}
                          className="px-2 py-1 rounded bg-slate-900 border border-cyan-500 text-white text-xs"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            item.priority === 'High'
                              ? 'bg-amber-950/50 text-amber-300 border border-amber-600/50'
                              : item.priority === 'Medium'
                              ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-600/40'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.priority === 'High' && <Flame className="w-3 h-3 text-amber-400" />}
                          <span>{item.priority}</span>
                        </span>
                      )}
                    </td>

                    {/* Actions / Edit */}
                    <td className="py-3 px-3 align-top text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300 rounded hover:bg-slate-800"
                            title="Save"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Task Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateNewItem}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Action Item</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Task Description (Use imperative action verb)
                </label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Schedule rehearsal run with audio engineer"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assignee / Owner</label>
                <select
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="[UNASSIGNED - Needs Volunteer]">[UNASSIGNED - Needs Volunteer]</option>
                  {attendees.map((att) => (
                    <option key={att} value={att}>
                      {att}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. Nov 4, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
