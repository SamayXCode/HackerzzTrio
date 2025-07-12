import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const QuestionPage = () => {
  const { id } = useParams();
  const { axiosInstance, currentUser } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axiosInstance.get(`/questions/${id}/`);
        setQuestion(response.data);
        setAnswers(response.data.answers);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id, axiosInstance]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to post an answer');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/answers/', {
        question: id,
        content: newAnswer,
      });
  
      if (response.status === 201) {
        setAnswers([...answers, response.data]);
        setNewAnswer('');
        alert('Answer posted successfully!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      let errorMessage = 'Failed to post answer. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'You need to be logged in to post an answer.';
        } else if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      alert(errorMessage);
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Votes: {question.votes}</span>
              <span className="text-gray-600">Answers: {question.answer_count}</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {question.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          <p className="text-gray-700 mb-6">{question.content}</p>

          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-gray-700 mr-2" />
            <span className="text-sm text-gray-500">Asked by {question.author.name}</span>
            <span className="text-sm text-gray-500 ml-4">
              {new Date(question.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Answers ({question.answer_count})</h2>

          {answers.length > 0 ? (
            <ul className="space-y-6">
              {answers.map((answer) => (
                <li key={answer.id} className="border-b border-gray-200 pb-6">
                  <p className="text-gray-700 mb-3">{answer.content}</p>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-700 mr-2" />
                    <span className="text-sm text-gray-500">Answered by {answer.author.name}</span>
                    <span className="text-sm text-gray-500 ml-4">
                      {new Date(answer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No answers yet. Be the first to answer!</p>
          )}
        </div>

        {currentUser && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Answer</h2>
            <form onSubmit={handleAnswerSubmit}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              rows="5"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Post Answer
            </button>
          </form>
        </div>
      )}
      {!currentUser && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-600">log in</a> to post an answer.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuestionPage;