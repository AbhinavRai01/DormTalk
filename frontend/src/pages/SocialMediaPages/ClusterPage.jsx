import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostItem from '../components/PostItem';

export default function ClusterPage() {

 const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const [posts, setPosts] = useState([]);
  const [cluster, setCluster] = useState(null);
  const { clusterName } = useParams();
  const [isFollowing, setIsFollowing] = useState(false); // dummy state

  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clusters/name/${clusterName}`);
        if (response.ok) {
          const data = await response.json();
          setCluster(data[0]);
          console.log("Cluster fetched:", data[0]);

          if (data[0].members.map(member => member.userId === user.userId)) {
            setIsFollowing(true);
          }
        } else {
          console.error("Failed to fetch cluster");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCluster();
  }, [clusterName]);

  useEffect(() => {
    const clusterId = cluster ? cluster._id : null;
    const fetchPosts = async () => {
      if (clusterId) {
        try {
          const response = await fetch(`http://localhost:5000/api/posts/cluster/${clusterId}`);
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
            console.log("Posts fetched:", data);
          } else {
            console.error("Failed to fetch posts for cluster");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };
    fetchPosts();
  }, [cluster]);

  const followButtonHandle = async () => {

    if (isFollowing){
        // Unfollow logic
        try {
            const response = await fetch('http://localhost:5000/api/users/leaveCluster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clusterId: cluster._id, userId: user.userId }),
            });
            if (response.ok) {
            console.log("Successfully left the cluster");
            setIsFollowing(false);
            } else {
            console.error("Failed to leave cluster");
            }
        } catch (error) {
            console.error("Error leaving cluster:", error);
        }
    }else{
        // Join logic
        try {
            const response = await fetch('http://localhost:5000/api/users/joinCluster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clusterId: cluster._id, userId: user.userId }),
            });
            if (response.ok) {
            console.log("Successfully joined the cluster");
            setIsFollowing(true);
            } else {
            console.error("Failed to join cluster");
            }
        } catch (error) {
            console.error("Error joining cluster:", error);
        }
    }
  }

  return (
    <div className="max-w-4xl text-left mx-auto px-4 pt-6">
      {/* Cluster Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{cluster?.name || '...'}</h1>
          <button
            onClick={followButtonHandle}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              isFollowing
                ? 'bg-gray-200 text-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        <p className="text-gray-600 mt-1">{cluster?.description || 'Loading description...'}</p>
        <div className="mt-2 text-m text-gray-500 flex gap-4">
          <span>{posts.length} posts</span>
          <span>{cluster?.members?.length || 0} followers</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold text-gray-900">Popular Posts</h2>

  <div className="flex items-center gap-4">
    {/* Create Post Button */}
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md"
      onClick={() => {
        // Navigate to create post page
        // useNavigate() or <Link to="/create">
        window.location.href = '/create'; // or use React Router
      }}
    >
      + Create Post
    </button>

    {/* Sort Dropdown */}
    <select
      className="text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue="hot"
      onChange={(e) => {
        const sortType = e.target.value;
        // Call sort logic or re-fetch accordingly
        console.log("Sort changed to:", sortType);
        // Example: setSortType(sortType)
      }}
    >
      <option value="hot">Hot</option>
      <option value="new">New</option>
    </select>
  </div>
</div>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map((post, idx) => (
          <div key={idx} className="mb-4">
            <PostItem postId={post._id} />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No posts available in this cluster.
        </p>
      )}
    </div>
  );
}
