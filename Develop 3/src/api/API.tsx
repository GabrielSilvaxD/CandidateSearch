import { GitHubUser } from '../types/index';

const searchGithub = async (): Promise<GitHubUser[]> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  console.log('DEBUG searchGithub: Token:', token);
  try {
    const start = Math.floor(Math.random() * 100000000) + 1;
    const response = await fetch(
      `https://api.github.com/users?since=${start}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('DEBUG searchGithub: Status:', response.status);
    if (!response.ok) {
      throw new Error(`Invalid API response: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('API Error in searchGithub:', err);
    return [];
  }
};

const searchGithubUser = async (username: string): Promise<GitHubUser> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  console.log('DEBUG searchGithubUser: Token:', token);
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('DEBUG searchGithubUser: Status:', response.status);
    if (!response.ok) {
      throw new Error(`Invalid API response: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching GitHub user:', err);
    return {
      name: '',
      login: '',
      location: '',
      avatar_url: '',
      email: '',
      html_url: '',
      company: '',
    };
  }
};

export { searchGithub, searchGithubUser };