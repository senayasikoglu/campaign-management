/**
 * Calculates the spent on a campaign on the fly.
 * @param {Object} campaign - The campaign object
 * @returns {Number} The spent on the campaign
 */

const calculateSpent = (campaign) => {
  
  const today = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  
  // If campaign has not started yet
  if (today < startDate) return 0;
  
  // If campaign is over
  if (today > endDate) return campaign.budget;
  
  // If campaign is active
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const passedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  
  const spent = Math.min(campaign.budget, (campaign.budget / totalDays) * passedDays);
  return Number(spent.toFixed(2));
};

module.exports = calculateSpent; 