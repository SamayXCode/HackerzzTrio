import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AskQuestionPage = () => {
  const navigate = useNavigate()
  const { axiosInstance } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tag_names: formData.tags.split(',').map(tag => tag.trim())
      };
      await axiosInstance.post('/questions/', postData);
      navigate('/')
    } catch (error) {
      console.error('Failed to submit question:', error)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ask a public question</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-2">Title</label>
          <p className="text-gray-600 mb-2">Be specific and imagine you're asking a question to another person</p>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Is there an R function for finding the index of an element"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="body" className="block text-lg font-semibold text-gray-900 mb-2">Body</label>
          <p className="text-gray-600 mb-2">Include all the information someone would need to answer your question</p>
          <textarea
            id="body"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            placeholder="Enter question details here"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          ></textarea>
        </div>
        
        <div className="mb-8">
          <label htmlFor="tags" className="block text-lg font-semibold text-gray-900 mb-2">Tags</label>
          <p className="text-gray-600 mb-2">Add up to 5 tags to describe what your question is about</p>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. (react firebase mongodb jwt)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post Your Question
          </button>
        </div>
      </form>
    </div>
  )
}

export default AskQuestionPage