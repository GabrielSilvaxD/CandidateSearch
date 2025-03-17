import React, { useState, useEffect } from 'react';
import { GitHubUser } from '../types/index';

const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<GitHubUser[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('potentialCandidates') || '[]');
    setSavedCandidates(saved);
  }, []);

  const removeCandidate = (login: string) => {
    const updated = savedCandidates.filter(candidate => candidate.login !== login);
    setSavedCandidates(updated);
    localStorage.setItem('potentialCandidates', JSON.stringify(updated));
  };

  if (savedCandidates.length === 0) return <div>No candidates have been accepted.</div>;

  return (
    <div className="saved-candidates">
      <h1>Potential Candidates</h1>
      <div className="candidate-list">
        {savedCandidates.map(candidate => (
          <div key={candidate.login} className="candidate-card">
            <img src={candidate.avatar_url} alt={candidate.login} width="100" />
            <h2>{candidate.name || 'No name available'}</h2>
            <p>Username: {candidate.login}</p>
            <p>Location: {candidate.location || 'Not specified'}</p>
            <p>Email: {candidate.email || 'Not specified'}</p>
            <p>Company: {candidate.company || 'Not specified'}</p>
            <p>
              Profile:{' '}
              <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </p>
            <button onClick={() => removeCandidate(candidate.login)}>−</button>
          </div>
        ))}
      </div>
      <a href="/">Back to Candidate Search</a>
    </div>
  );
};

export default SavedCandidates;