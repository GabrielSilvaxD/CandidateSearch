import React, { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { GitHubUser } from '../types/index';

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<GitHubUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const users = await searchGithub();
        // For each user, fetch full details using searchGithubUser
        const detailedUsers = await Promise.all(
          users.map(user => searchGithubUser(user.login))
        );
        // Filter out any users that failed to load (e.g., empty objects)
        const validUsers = detailedUsers.filter(user => user.login !== '');
        setCandidates(validUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidates. Please try again.');
        setLoading(false);
      }
    };
    loadCandidates();
  }, []);

  const saveCandidate = () => {
    const currentCandidate = candidates[currentIndex];
    const saved = JSON.parse(localStorage.getItem('potentialCandidates') || '[]');
    // Avoid duplicates by checking if the candidate is already saved
    if (!saved.some((c: GitHubUser) => c.login === currentCandidate.login)) {
      localStorage.setItem('potentialCandidates', JSON.stringify([...saved, currentCandidate]));
    }
    goToNextCandidate();
  };

  const goToNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Fetch more candidates if we're out
      setCurrentIndex(0);
      setCandidates([]);
      const loadMoreCandidates = async () => {
        try {
          setLoading(true);
          const users = await searchGithub();
          const detailedUsers = await Promise.all(
            users.map(user => searchGithubUser(user.login))
          );
          const validUsers = detailedUsers.filter(user => user.login !== '');
          setCandidates(validUsers);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch more candidates. Please try again.');
          setLoading(false);
        }
      };
      loadMoreCandidates();
    }
  };

  if (loading) return <div>Loading candidates...</div>;
  if (error) return <div>{error}</div>;
  if (candidates.length === 0) return <div>No more candidates available.</div>;

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="candidate-search">
      <h1>Candidate Search</h1>
      <div className="candidate-card">
        <img src={currentCandidate.avatar_url} alt={currentCandidate.login} width="100" />
        <h2>{currentCandidate.name || 'No name available'}</h2>
        <p>Username: {currentCandidate.login}</p>
        <p>Location: {currentCandidate.location || 'Not specified'}</p>
        <p>Email: {currentCandidate.email || 'Not specified'}</p>
        <p>Company: {currentCandidate.company || 'Not specified'}</p>
        <p>
          Profile:{' '}
          <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </div>
      <div className="buttons">
        <button onClick={saveCandidate}>+</button>
        <button onClick={goToNextCandidate}>−</button>
      </div>
      <a href="/saved-candidates">View Potential Candidates</a>
    </div>
  );
};

export default CandidateSearch;