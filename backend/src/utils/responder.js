
let Responder = {

  sendResponse: (response, statusCode, status, data, message) => {
    return response.status(statusCode).json({
      status: status,
      data: data,
      dataList: (data)?data.list:null,
      totalRecords:(data)?data.totalRecord:null,
      message: message
    });
  },
  sendFilterResponse: (response, statusCode, status, data, message) => {
    return response.status(statusCode).json({
      status: status,
      data: data.list,
      totalRecords: data.totalRecord,
      message: message
    });
  },
  sendErrorResponse: (response, message) => {
    return response.status(422).json({
      error: message
    });
  }
};

module.exports = Responder;
