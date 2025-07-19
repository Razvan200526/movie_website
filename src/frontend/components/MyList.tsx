import React , {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../services/api';
import {MediaItem } from '../types';
import {MediaCard} from './MediaCard';
import Loading from './Loading';
const MyList: React.FC = () => {
  const [list , setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error , setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLIst = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) {
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      {list.map(item => (
        <MediaCard
          key={`${item.media_type || "movie"}-${item.id}`}
          media={item}
          mediaType={item.media_type || "movie"}
        />
      ))}
    </div>
  );
};

export default MyList;


