const createResponse = (statusCode, message, data = null) => {
  const responseBody = { message };
  if (data) {
    responseBody.data = data;
  }

  return {
    statusCode,
    body: JSON.stringify(responseBody),
  };
};

module.exports = createResponse;
