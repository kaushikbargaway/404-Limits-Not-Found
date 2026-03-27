import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Upload } from '../components/ui/Upload';
import { ShieldCheck, Clock, Coins, MapPin, User, CheckCircle2, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { getTaskById, acceptTask } from '../api/taskService';
import { uploadProof } from '../api/proofService';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [task, setTask] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [proofFile, setProofFile] = useState(null);
  const [proofText, setProofText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofError, setProofError] = useState(null);
  const [proofDone, setProofDone] = useState(false);

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  // ── Fetch task ──────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        setFetchError(err.response?.data?.msg || 'Could not load task.');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Derived flags ───────────────────────────
  const isOwner = task?.owner?._id === currentUser?._id || task?.owner === currentUser?._id;
  const isAssignee =
    task?.assignedTo?._id === currentUser?._id ||
    task?.assignedTo === currentUser?._id;
  const isOpen = task?.status === 'open';
  const isInProgress = task?.status === 'in_progress';

  // ── Accept task ─────────────────────────────
  const handleAccept = async () => {
    setAcceptLoading(true);
    setAcceptError(null);
    try {
      const updated = await acceptTask(id, currentUser._id);
      setTask(updated);
    } catch (err) {
      setAcceptError(err.response?.data?.msg || 'Could not accept task.');
    } finally {
      setAcceptLoading(false);
    }
  };

  // ── Submit proof ────────────────────────────
  const handleSubmitProof = async () => {
    if (!proofText.trim() && !proofFile) return;
    setIsSubmitting(true);
    setProofError(null);
    try {
      let base64Image = '';
      if (proofFile) base64Image = await fileToBase64(proofFile);

      await uploadProof({
        taskId: id,
        userId: currentUser._id,
        text: proofText,
        image: base64Image,
      });
      setProofDone(true);
    } catch (err) {
      setProofError(err.response?.data?.error || err.response?.data?.msg || 'Failed to submit proof.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading / Error states ──────────────────
  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-medium">Loading task...</p>
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-red-500">
        <XCircle className="w-8 h-8 mb-3" />
        <p className="font-semibold">{fetchError || 'Task not found'}</p>
        <button className="mt-4 text-sm underline text-gray-500" onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center">
          ← Back to Feed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main Column ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{task.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  task.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {formatTimeAgo(task.createdAt)}
                </div>
                <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-medium">
                  <Coins className="w-4 h-4 mr-2 text-blue-500" />
                  {task.reward || 0} KC
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* ── Accept CTA (open, not owner) ── */}
          {isOpen && !isOwner && (
            <Card>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to help?</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Accept this task to claim it. Once accepted, complete it and submit proof.
                </p>
                {acceptError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {acceptError}
                  </div>
                )}
                <Button variant="primary" onClick={handleAccept} disabled={acceptLoading}>
                  {acceptLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Accepting...</span>
                  ) : 'Accept This Task'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── Proof upload (assignee, in_progress) ── */}
          {isInProgress && isAssignee && !proofDone && (
            <Card>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Proof of Work</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Upload evidence that you completed this task. The AI will pre-score your proof.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (required)</label>
                  <textarea
                    rows={3}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Describe what you did and how you completed the task..."
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border bg-white resize-none"
                  />
                </div>

                <div className="mb-6">
                  <Upload onChange={(file) => setProofFile(file)} label="Attach photo evidence (optional)" />
                </div>

                {proofError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {proofError}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSubmitProof}
                    disabled={(!proofText.trim() && !proofFile) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Uploading...</span>
                    ) : 'Submit Proof'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Proof submitted ── */}
          {proofDone && (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proof Submitted!</h3>
                <p className="text-gray-600 max-w-md">
                  Your proof is under AI review. You'll receive {task.reward} KC once the task creator approves it.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Task Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Posted By</div>
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {task.owner?.name || 'Anonymous'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Min Trust Required</div>
                  <div className="flex items-center text-emerald-700">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                    {task.minTrustScore || 0} Score
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Task Status</div>
                  <div className="flex items-center text-blue-700">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    {task.status?.replace('_', ' ')}
                  </div>
                </div>
                {task.assignedTo && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Assigned To</div>
                    <div className="flex items-center text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {task.assignedTo?.name || 'Unknown'}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Your trust score check */}
          {isOpen && !isOwner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Eligibility</h3>
                {currentUser?.trustScore >= (task.minTrustScore || 0) ? (
                  <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    You meet the trust requirement ({currentUser?.trustScore} ≥ {task.minTrustScore || 0})
                  </div>
                ) : (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Insufficient trust ({currentUser?.trustScore} &lt; {task.minTrustScore})
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
