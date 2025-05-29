import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
const Profile = () => {

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
            const response1 = await fetch('http://localhost:5000/api/users/unfollowuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unfollowUserID: userId, curUserID: a }),
            });

            if (response1.ok) {
                console.log("Unfollow Response:", await response1.json());

                const response2 = await fetch('http://localhost:5000/api/users/decreaseFollowers', {
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
            const response1 = await fetch('http://localhost:5000/api/users/followuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followUserID: userId, curUserID: a }),
            });

            if (response1.ok) {
                console.log("Follow Response:", await response1.json());

                const response2 = await fetch('http://localhost:5000/api/users/increaseFollowers', {
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
            } else {
                console.error("Failed to follow user");
            }
        } catch (error) {
            console.error("Error during follow:", error);
        }
    }
};



    useEffect(() => {


        const fetchUserData = async () => {
            try {

                const currentUser = await fetch(`http://localhost:5000/api/users/${userId}`);
                if (!currentUser.ok) throw new Error(`HTTP error! status: ${currentUser.status}`);

                const userData = await currentUser.json();
                console.log("userData: ", userData);

                setUser(userData); //set the user data

                setFollowers(userData.followers);

                const activeUser = await fetch(`http://localhost:5000/api/users/${user.userId}`);
                const activeUserData = await activeUser.json();

                console.log("active User Data", activeUserData)

                setActiveUser(activeUserData);



                console.log("CurUser", userData);
                console.log("Active User", activeUserData);

                const questions = await fetch(`http://localhost:5000/api/questions/`);
                if (!questions.ok) throw new Error(`HTTP error! status: ${questions.status}`);
                const questionsData = await questions.json();
                //filter out the questions asked by the user
                const questionsAsked = questionsData.filter(question => question.senderID === userId);
                setQuestions(questionsAsked); //set the questions asked by the user
                setQuestionsAsked(questionsAsked.length); //set the questions asked by the user
                //give the length of the questions asked

                const Answers = await fetch(`http://localhost:5000/api/answers/profile/${userId}`);
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
        <div className="min-h-screen bg-gray-100 py-16 px-4 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>

                <div className="space-y-4 text-slate-700 text-lg mb-8">
                    <p>User ID: <span className="font-semibold">@{userId}</span> <button className='border border-black-10' onClick={followHandler}>{following ? <>Following</> : <>Follow</>}</button></p>

                    <p>Followers: <span className="font-semibold">{followers}</span></p>
                    <p>Questions Asked: <span className="font-semibold">{questionsAsked}</span></p>
                    <p>Answers Given: <span className="font-semibold">{answersGiven}</span></p>
                    <p>denScore: <span className="font-bold text-blue-600">{denScore}</span></p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === 'questions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700'}`}
                    >
                        Questions
                    </button>
                    <button
                        onClick={() => setActiveTab('answers')}
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === 'answers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700'}`}
                    >
                        Answers
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'questions' && (
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Questions Asked</h2>
                        <ul className="space-y-4">
                            {questions.map((question) => (
                                <li key={question._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-800">{question.question}</h3>
                                    <p className="text-slate-600">{question.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'answers' && (
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Answers Given</h2>
                        <ul className="space-y-4">
                            {answers.map((answer) => (
                                <li key={answer._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-800">{answer.question}</h3>
                                    <p className="text-slate-600">{answer.content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
