import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const navigate = useNavigate();

  const [followers, setFollowers] = useState(0);

  const [following, setFollowing] = useState(false);

  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answersGiven, setAnswersGiven] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions'); // State to manage active tab

  const { userId } = useParams();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [thisUser, setUser] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  const followHandler = async (e) => {
    e.preventDefault();
    const a = user.userId;

    if (following) {
      // Unfollow Logic
      activeUser.followedUsers = activeUser.followedUsers.filter(id => id !== userId);

      try {
        const response1 = await fetch('https://dormtalk.onrender.com/api/users/unfollowuser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unfollowUserID: userId, curUserID: a }),
        });

        if (response1.ok) {
          console.log("Unfollow Response:", await response1.json());

          const response2 = await fetch('https://dormtalk.onrender.com/api/users/decreaseFollowers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: userId }),
          });

          if (response2.ok) {
            console.log("Decrease Followers Response:", await response2.json());
          } else {
            console.error("Failed to decrease followers");
          }

          setFollowing(false);
          setFollowers(followers-1);
        } else {
          console.error("Failed to unfollow user");
        }
      } catch (error) {
        console.error("Error during unfollow:", error);
      }
    } else {
      // Follow Logic
      activeUser.followedUsers.push(userId);

      try {
        const response1 = await fetch('https://dormtalk.onrender.com/api/users/followuser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followUserID: userId, curUserID: a }),
        });

        if (response1.ok) {
          console.log("Follow Response:", await response1.json());

          const response2 = await fetch('https://dormtalk.onrender.com/api/users/increaseFollowers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: userId }),
          });

          if (response2.ok) {
            console.log("Increase Followers Response:", await response2.json());
          } else {
            console.error("Failed to increase followers");
          }

          setFollowing(true);
          setFollowers(followers+1);
        } else {
          console.error("Failed to follow user");
        }
      } catch (error) {
        console.error("Error during follow:", error);
      }
    }
  };


  const [isCurrentUser, setIsCur] = useState(false);

  useEffect(() => {


    const fetchUserData = async () => {
      try {

        const currentUser = await fetch(`https://dormtalk.onrender.com/api/users/${userId}`);
        if (!currentUser.ok) throw new Error(`HTTP error! status: ${currentUser.status}`);

        const userData = await currentUser.json();
        console.log("userData: ", userData);

        setUser(userData); //set the user data

        setFollowers(userData.followers);

        const activeUser = await fetch(`https://dormtalk.onrender.com/api/users/${user.userId}`);
        const activeUserData = await activeUser.json();

        console.log("active User Data", activeUserData)

        setActiveUser(activeUserData);

        setIsCur(userData.userId === activeUserData.userId); //check if the user is the current user
        console.log("isCurUser", isCurrentUser);

        console.log("CurUser", userData);
        console.log("Active User", activeUserData);

        const questions = await fetch(`https://dormtalk.onrender.com/api/questions/`);
        if (!questions.ok) throw new Error(`HTTP error! status: ${questions.status}`);
        const questionsData = await questions.json();
        //filter out the questions asked by the user
        const questionsAsked = questionsData.filter(question => question.senderID === userId);
        setQuestions(questionsAsked); //set the questions asked by the user
        setQuestionsAsked(questionsAsked.length); //set the questions asked by the user
        //give the length of the questions asked

        const Answers = await fetch(`https://dormtalk.onrender.com/api/answers/profile/${userId}`);
        if (!Answers.ok) throw new Error(`HTTP error! status: ${answers.status}`);
        const answersData = await Answers.json();

        setAnswers(answersData); //set the answers given by the user
        setAnswersGiven(answersData.length); //set the answers given by the user



        const doesFollow = activeUserData.followedUsers.includes(userId);
        setFollowing(doesFollow);



      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  // denScore formula
  const denScore = 3 * questionsAsked + 5 * answersGiven;



  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 w-full max-w-4xl">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-8 text-center sm:text-left">
          <img
            src={thisUser ? thisUser.imageURL : ""}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-4 sm:mb-0"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{thisUser ? thisUser.name : ""}</h1>
            <p className="text-gray-600">{thisUser ? thisUser.bio : ""}</p>

          </div>
          {isCurrentUser ? (
            <button
              onClick={() => navigate('/edit-profile')}
              className="mt-4 sm:mt-0 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </button>
          ) : activeUser ? (
            <button
              onClick={followHandler}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {following ? 'Following' : 'Follow'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >Login to follow</button>
          )}


        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 text-center border-t border-b border-gray-200 py-4 mb-6 gap-4">
          <div>
            <p className="text-xl font-semibold text-gray-800">{answersGiven}</p>
            <p className="text-gray-500">Answers</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{followers}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{denScore}</p>
            <p className="text-gray-500">denScore</p>
          </div>
        </div>

        {/* Topics */}


        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'questions' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'
              }`}
          >
            Asked ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'answers' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'
              }`}
          >
            Answered ({answers.length})
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'questions' ? (
            <ul className="space-y-4">
              {questions.map((q) => (
                <li key={q._id} className="bg-gray-50 p-4 rounded-lg shadow-sm" onClick={()=>{navigate('/all-questions/'+q._id)}}>
                  <h3 className="text-lg font-semibold text-gray-800">{q.question}</h3>
                  <p className="text-gray-600">{q.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-4">
              {answers.map((a) => (
                <li key={a._id} className="bg-gray-50 p-4 rounded-lg shadow-sm" onClick={()=>{navigate('/all-questions/'+ a.questionID)}}>
                  <h3 className="text-lg font-semibold text-gray-800">{a.question}</h3>
                  <p className="text-gray-600">{a.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
