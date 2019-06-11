export default {
  id: 'immigrant',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  url: 'https://www.officeofphiladelphiasheriff.com/en/real-estate/sheriffs-sale-webapp?option=com_divisions&view=office&task=perform_auction_search',
  options: {
    params: {
      // q: 'select * from phl.oia_services',
    },
    success: function(data) {
      return data.beaches;
    }
  },
};
