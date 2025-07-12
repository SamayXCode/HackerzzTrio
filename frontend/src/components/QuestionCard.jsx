import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Votes: {question.votes}</span>
          <span className="text-gray-600">Answers: {question.answer_count}</span>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {question.category}
        </span>
      </div>

      <Link to={`/questions/${question.id}`} className="block mb-3">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
          {question.title}
        </h2>
      </Link>

      <p className="text-gray-600 mb-4 line-clamp-3">{question.content}</p>

      <div className="flex items-center">
        <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-700 mr-2" />
        <span className="text-sm text-gray-500">Asked by {question.author_name}</span>
        <span className="text-sm text-gray-500 ml-4">
          {new Date(question.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;