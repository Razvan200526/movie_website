import React , {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../services/api';
import {MediaItem } from '../types';
import {MediaCard} from './MediaCard';
import Loading from './Loading';
import PageSkeleton from './PageSkeleton';
const MyList: React.FC = () => {
  const [list , setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error , setError] = useState<string | null>(null);
  const [searchTerm,setSearchTerm] = useState<string>("");
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {loading && <Loading />}
        {error && <p className="text-red-500">{error}</p>}
        {filteredList.map(item => (
          <MediaCard
            key={`${item.media_type || "movie"}-${item.id}`}
            media={item}
            mediaType={item.media_type || "movie"}
          />
        ))}
      </div>
    </PageSkeleton>
  );
};

export default MyList;


