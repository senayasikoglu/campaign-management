import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./homepage.css";
import api from '../../utils/api';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(localStorage.getItem('perPage') || '10'),
    total: 0,
    totalPages: 0
  });

  const perPageOptions = [5, 10, 25];
  const navigate = useNavigate();

  // Get status of campaign by date
  const getStatusByDate = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return { 
        text: 'PLANNED',
        className: 'status-planned'
      };
    } else if (today > end) {
      return { 
        text: 'COMPLETED',
        className: 'status-completed'
      };
    } else {
      return { 
        text: 'ACTIVE',
        className: 'status-active'
      };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [pagination.page, pagination.limit, filter, sortField, sortOrder]);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await api.get(
        '/campaigns',
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            filter,
            sortField,
            sortOrder
          },
        } 
      );

      setCampaigns(response.data.campaigns);
      if (response.data.campaigns.length > 0) {
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / response.data.limit) 
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    localStorage.setItem('perPage', newLimit.toString());
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1
    }));
  };
  
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (e) => {
    const newSortField = e.target.value;
    setSortField(newSortField);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await api.delete(`/campaigns/${id}`);
        fetchCampaigns();
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="filters">
        <input
          type="text"
          placeholder="Filter campaigns..."
          value={filter}
          onChange={handleFilterChange}
        />
        <select
          onChange={handleSortChange}
          value={sortField}
        >
          <option value="startDate">Sort by Start Date</option>
          <option value="endDate">Sort by End Date</option>
          <option value="name">Sort by Name</option>
          <option value="budget">Sort by Budget</option>
          <option value="channel">Sort by Channel</option>
        </select>
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <Link to="/campaign/add" className="navbar-item">New Campaign</Link>
      </div>

      <table className="campaigns-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Channel</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Budget</th>
            <th>Spent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? campaigns.map(campaign => {
            const status = getStatusByDate(campaign.startDate, campaign.endDate);
            return (
              <tr key={campaign._id}>
                <td>{campaign.name}</td>
                <td>{campaign.channel ? campaign.channel.name : "N/A"}</td>
                <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
                <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
                <td>${campaign.budget ? campaign.budget.toFixed(2) : 0}</td>
                <td>${campaign.spent ? campaign.spent.toFixed(2) : 0}</td>
                <td className={status.className}>{status.text}</td>
                <td>
                  <button onClick={() => navigate(`/campaign/update/${campaign._id}`)}>Edit</button>
                  <button onClick={() => handleDelete(campaign._id)}>Delete</button>
                </td>
              </tr>
            );
          }) : <tr><td colSpan="8">No campaigns found</td></tr>}
        </tbody>
      </table>
      <div className="pagination">
        <div className="per-page-select">
          <span>Per page:</span>
          <select 
            value={pagination.limit} 
            onChange={handlePerPageChange}
          >
            {perPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span className="page-info">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
        </span>
        <button 
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
