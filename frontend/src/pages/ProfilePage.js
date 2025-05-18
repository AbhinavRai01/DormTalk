import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-blue-500 shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {/* Full Name */} John Doe
            </h2>
            <p className="text-gray-500 mt-1">
              {/* Username / Role */} @johndoe — Full Stack Developer
            </p>
            <p className="text-sm text-gray-600 mt-3 max-w-xl">
              {/* Bio or Description */}
              Passionate developer with 5+ years of experience in web technologies, building scalable and clean applications.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Tags / Interests */}
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">JavaScript</span>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">React</span>
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">Node.js</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>• Asked a question about async/await in JavaScript</li>
            <li>• Commented on a topic about MongoDB schema design</li>
            <li>• Updated profile information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
