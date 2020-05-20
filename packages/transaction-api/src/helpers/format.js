const format = response => {
  const formatted = response.map(item => {
    return {
      id: item.purchase_id,
      decription: item.description.toUpperCase().trim(),
      date: item.date.toDateString(),
      amount: item.amount
    };
  });
  return formatted;
};

module.exports = format;
