import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, AlertCircle, RefreshCw, ClipboardList,
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  User, Brain, Star, Coins, ShieldCheck
} from 'lucide-react';
import { getMyTasksWithProofs, verifyProof } from '../api/proofService';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ────────────────────────────────────────────────────────────────
const statusConfig = {
  open:        { label: 'Open',        color: 'bg-emerald-100 text-emerald-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed:   { label: 'Completed',   color: 'bg-gray-100 text-gray-600' },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-100 text-red-500' },
};

const proofStatusConfig = {
  pending:  { label: 'Awaiting Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved',        color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { label: 'Rejected',        color: 'bg-red-100 text-red-600', icon: XCircle },
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─── Star Rating ────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`transition-transform hover:scale-110 ${
          star <= value ? 'text-amber-400' : 'text-gray-300'
        }`}
      >
        <Star className="w-6 h-6 fill-current" />
      </button>
    ))}
  </div>
);

// ─── Proof Card ──────────────────────────────────────────────────────────────
const ProofCard = ({ proof, taskStatus, onVerify }) => {
  const [rating, setRating] = useState(proof.rating || 0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const pStatus = proofStatusConfig[proof.status] || proofStatusConfig.pending;
  const PIcon = pStatus.icon;
  const canReview = proof.status === 'pending' && taskStatus !== 'completed';

  const handleDecision = async (isApproved) => {
    if (isApproved && rating === 0) {
      setError('Please give a rating before approving.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await verifyProof(proof._id, { isApproved, rating });
      setResult(res);
      onVerify(); // refresh parent
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Action failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50/60 p-5 space-y-4">
      {/* Submitter info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {proof.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{proof.user?.name || 'Unknown'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-3 h-3" />
              Trust: {proof.user?.trustScore ?? '—'}
              <span className="text-gray-300">•</span>
              {formatTimeAgo(proof.createdAt)}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${pStatus.color}`}>
          <PIcon className="w-3 h-3" />
          {pStatus.label}
        </span>
      </div>

      {/* AI Score bar */}
      <div className="flex items-center gap-3">
        <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>AI Confidence Score</span>
            <span className="font-bold text-indigo-600">{proof.aiScore ?? 50}/100</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (proof.aiScore ?? 50) >= 70 ? 'bg-emerald-500' :
                (proof.aiScore ?? 50) >= 40 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${proof.aiScore ?? 50}%` }}
            />
          </div>
        </div>
      </div>

      {/* Proof text */}
      {proof.text && (
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Proof Description</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{proof.text}</p>
        </div>
      )}

      {/* Proof image */}
      {proof.image && proof.image.startsWith('data:') && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attached Evidence</p>
          <img
            src={proof.image}
            alt="Proof evidence"
            className="max-h-48 rounded-lg border border-gray-200 object-contain bg-white"
          />
        </div>
      )}

      {/* Review controls */}
      {canReview && !result && (
        <div className="pt-3 border-t border-gray-200 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Your Rating</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleDecision(true)}
              disabled={submitting || rating === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve & Reward
            </button>
            <button
              onClick={() => handleDecision(false)}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Result message after review */}
      {result && (
        <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
          result.reward ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
          'bg-gray-50 border border-gray-200 text-gray-700'
        }`}>
          {result.reward ? (
            <>
              <Coins className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                Approved! <strong>{result.reward} KC</strong> rewarded.
                Final score: <strong>{Math.round(result.finalScore)}</strong>
              </span>
            </>
          ) : (
            <span>{result.msg || 'Action recorded.'}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Task Row ─────────────────────────────────────────────────────────────────
const TaskRow = ({ task, onRefresh }) => {
  const [expanded, setExpanded] = useState(task.proofs?.length > 0);
  const tStatus = statusConfig[task.status] || statusConfig.open;
  const pendingCount = task.proofs?.filter(p => p.status === 'pending').length || 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Task header */}
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-900 truncate">{task.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tStatus.color}`}>
              {tStatus.label}
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                {pendingCount} awaiting review
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3" /> {task.reward} KC reward
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> {task.proofs?.length || 0} submission(s)
            </span>
            <span>•</span>
            <span>{formatTimeAgo(task.createdAt)}</span>
          </div>
        </div>

        <div className="shrink-0 text-gray-400 mt-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Proof submissions */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
          {!task.proofs || task.proofs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No submissions yet</p>
              <p className="text-xs">Volunteers will appear here once they submit proof.</p>
            </div>
          ) : (
            task.proofs.map((proof) => (
              <ProofCard
                key={proof._id}
                proof={proof}
                taskStatus={task.status}
                onVerify={onRefresh}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const MyTasks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyTasksWithProofs(currentUser._id);
      setTasks(data);
    } catch (err) {
      setError('Could not load your tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [currentUser._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.proofs?.some(p => p.status === 'pending');
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'open') return t.status === 'open';
    return true;
  });

  const totalPending = tasks.reduce(
    (sum, t) => sum + (t.proofs?.filter(p => p.status === 'pending').length || 0), 0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            My Tasks
            {totalPending > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold">
                {totalPending}
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Review proof submissions from volunteers for your posted tasks.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-lg transition-colors hover:bg-blue-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all',       label: 'All Tasks' },
          { key: 'pending',   label: `Needs Review${totalPending > 0 ? ` (${totalPending})` : ''}` },
          { key: 'open',      label: 'Open' },
          { key: 'completed', label: 'Completed' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading your tasks...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 rounded-xl p-5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load tasks</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={fetchData} className="ml-auto text-sm underline font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-1">No tasks created yet</p>
          <p className="text-sm mb-6">Post your first task and volunteers will respond here.</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Create a Task
          </button>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-semibold">No tasks in this filter</p>
        </div>
      )}

      {!loading && !error && filteredTasks.length > 0 && (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskRow key={task._id} task={task} onRefresh={fetchData} />
          ))}
        </div>
      )}
    </div>
  );
};
