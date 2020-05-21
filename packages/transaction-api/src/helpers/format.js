const format = response => {
  const formatted = response.map(item => {
    return {
      id: item.purchase_id,
      description: (item.description && item.description.toUpperCase().trim()) || 'N/A',
      date: new Date(item.date).toDateString(),
      amount: item.amount
    };
  });
  return formatted;
};

module.exports = format;
