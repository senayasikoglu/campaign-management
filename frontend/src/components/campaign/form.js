import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import './form.css';

const CampaignForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    channel: 'SOCIAL_MEDIA',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'PLANNED'
  });
  const [error, setError] = useState('');
 
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  // Fetch campaign data
  const fetchCampaign = async () => {
    try {
      setError('');
      const response = await api.get(`/campaigns/${id}`);
      const campaign = response.data;
      setFormData({
        ...campaign,
        startDate: new Date(campaign.startDate).toISOString().split('T')[0],
        endDate: new Date(campaign.endDate).toISOString().split('T')[0],
        budget: campaign.budget.toString()
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching campaign');
      console.error('Error fetching campaign:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const submitData = {
        ...formData,
        budget: Number(formData.budget)
      };  

      // Send campaign data to backend
      if (id) { 
        await api.put(`/campaigns/${id}`, submitData);
      } else {
        await api.post('/campaigns', submitData);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving campaign');
      console.error('Error saving campaign:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="campaign-form">
      <h2>{id ? 'Edit Campaign' : 'New Campaign'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Channel:</label>
          <select name="channel" value={formData.channel} onChange={handleChange}>
            <option value="TV">TV</option>
            <option value="RADIO">Radio</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="SEARCH_ENGINE">Search Engine</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>
 

        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'} Campaign</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm; 