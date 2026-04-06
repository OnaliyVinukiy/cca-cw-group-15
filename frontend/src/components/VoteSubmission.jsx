import { useState, useEffect } from 'react';
import { searchSalaries, voteOnSubmission, getAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/VoteSubmission.css';

export default function VoteSubmission() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login');
      return;
    }

    fetchPendingSubmissions();
    // Load votes from localStorage
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, [navigate]);

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      // Note: Search only shows APPROVED submissions, 
      // so we'll show pending submissions for voting
      const data = await searchSalaries({});
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (submissionId, voteType) => {
    try {
      // Prevent double voting
      if (userVotes[submissionId]) {
        setError('You have already voted on this submission');
        return;
      }

      const response = await voteOnSubmission(submissionId, voteType);

      // Update local state
      const newVotes = { ...userVotes, [submissionId]: voteType };
      setUserVotes(newVotes);
      localStorage.setItem('userVotes', JSON.stringify(newVotes));

      // Update submission status in UI
      setSubmissions(
        submissions.map((sub) =>
          sub.id === submissionId ? { ...sub, status: response.status } : sub
        )
      );

      setError('');
      alert(`Vote recorded! New status: ${response.status}`);
    } catch (err) {
      setError(err.detail || 'Failed to submit vote');
      console.error('Vote error:', err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#4CAF50';
      case 'REJECTED':
        return '#f44336';
      case 'PENDING':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return <div className="vote-container"><p>Loading submissions...</p></div>;
  }

  return (
    <div className="vote-container">
      <div className="vote-header">
        <h1>🗳️ Vote on Salary Submissions</h1>
        <p className="vote-subtitle">
          Help verify submissions. Submissions need 5+ upvotes to be approved.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="voting-info">
        <div className="info-card">
          <span className="info-icon">⬆️</span>
          <p><strong>Upvote:</strong> Believe this submission is accurate</p>
        </div>
        <div className="info-card">
          <span className="info-icon">⬇️</span>
          <p><strong>Downvote:</strong> Think this submission is suspicious</p>
        </div>
        <div className="info-card">
          <span className="info-icon">✅</span>
          <p><strong>5+ Upvotes:</strong> Submission gets APPROVED status</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">
          <p>No submissions to vote on at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="submission-card"
              style={{ borderLeftColor: getStatusColor(submission.status) }}
            >
              <div className="submission-header">
                <div className="submission-info">
                  <h3>{submission.role}</h3>
                  <p className="company">{submission.company}</p>
                  <span className="country">{submission.country}</span>
                </div>
                <div className="submission-status">
                  <span
                    className={`status-badge status-${submission.status.toLowerCase()}`}
                    style={{ backgroundColor: getStatusColor(submission.status) }}
                  >
                    {submission.status}
                  </span>
                </div>
              </div>

              <div className="submission-details">
                <div className="detail-group">
                  <span className="detail-label">Experience Level:</span>
                  <span className="detail-value">{submission.experience_level}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value salary">{formatCurrency(submission.amount)}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="submission-actions">
                {userVotes[submission.id] ? (
                  <div className="already-voted">
                    <p>✓ You voted: {userVotes[submission.id] === 'UPVOTE' ? '⬆️ Upvoted' : '⬇️ Downvoted'}</p>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn-upvote"
                      onClick={() => handleVote(submission.id, 'UPVOTE')}
                      disabled={!!userVotes[submission.id]}
                    >
                      ⬆️ Upvote
                    </button>
                    <button
                      className="btn-downvote"
                      onClick={() => handleVote(submission.id, 'DOWNVOTE')}
                      disabled={!!userVotes[submission.id]}
                    >
                      ⬇️ Downvote
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="voting-guide">
        <h3>📋 Voting Guidelines</h3>
        <ul>
          <li>Vote based on whether you believe the salary is realistic for the role/location</li>
          <li>Consider market rates and your own experience</li>
          <li>You can only vote once per submission</li>
          <li>All votes are recorded and contribute to submission approval</li>
        </ul>
      </div>
    </div>
  );
}
