import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { MediaItem } from '../types';
import Loading from './Loading';
import PageSkeleton from './PageSkeleton';
import MovieRow from './MovieRow';
const MyList: React.FC = () => {
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLIst = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const data = await apiClient.getUserList(token);
        setList(data.results);
      } catch (err) {
        setError('Failed to fetch your list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLIst();
  }, [navigate]);

  const filteredList = list.filter(item => {
    const title = item.title || item.name || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  })
  return (
    <PageSkeleton
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showSearch={true}
    >
      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      <MovieRow
        title="My list"
        movies={filteredList}
        mediaType="movie"
      />
    </PageSkeleton>
  );
};

export default MyList;


