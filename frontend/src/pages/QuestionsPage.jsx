import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import { Link } from 'react-router-dom';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // In a real app, this would be an API endpoint
        const response = await fetch('http://localhost:8000/api/questions/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const sortQuestions = (questions) => {
    switch (sortBy) {
      case 'newest':
        return [...questions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'most_voted':
        return [...questions].sort((a, b) => b.votes - a.votes);
      case 'most_answered':
        return [...questions].sort((a, b) => b.answer_count - a.answer_count);
      default:
        return questions;
    }
  };

  const filterQuestions = (questions) => {
    if (categoryFilter === 'all') return questions;
    return questions.filter(question => question.category === categoryFilter);
  };

  const sortedAndFilteredQuestions = filterQuestions(sortQuestions(questions));

  if (loading) return <div className="text-center py-8">Loading questions...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
        <Link
          to="/ask"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Ask Question
        </Link>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="most_voted">Most Voted</option>
            <option value="most_answered">Most Answered</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedAndFilteredQuestions.length > 0 ? (
          sortedAndFilteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-600">
            No questions found. Be the first to <Link to="/ask" className="text-blue-600">ask a question</Link>!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;