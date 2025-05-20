// import { toast } from "react-toastify";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASEURL}/users/me_v1`);
    return returnResponse(response);
  } catch (error) {
    return returnErrorApiResponse(error);
  }
};

class ApiResponse {
  constructor(success, data, message, trace) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.trace = trace;
  }
}

export const returnResponse = (response) => {
  switch (true) {
    case response.status >= 200 && response.status <= 300:
      return new ApiResponse(
        true,
        response.data,
        response.data.message || "Success",
        response.data.trace || []
      );
    case response.status === 400 || response.status === 412:
      return new ApiResponse(
        false,
        null,
        response.data.message,
        response.data.trace
      );
    case response.status >= 501 && response.status <= 503:
      return new ApiResponse(
        false,
        null,
        "Service Not Available At The Moment!",
        response.data.trace
      );
    case response.status === 504 || response.status === 524:
      return new ApiResponse(
        false,
        null,
        "Time Out Error, Try Again Later",
        response.data.trace
      );
    case response.status === 401 || response.status < 500:
      return new ApiResponse(
        false,
        null,
        response.data.message,
        response.data.trace
      );
    default:
      return new ApiResponse(
        false,
        null,
        response.data.message,
        response.data.trace
      );
  }
};

export const returnErrorApiResponse = (error, shouldToast = true) => {
  let err = error;
  let trace = [];

  if (error.response) {
    const { data } = error.response;

    if (Array.isArray(data) && data.length > 0) {
      err = data[0].message;
      trace = data.trace;
    } else if (data && data.message) {
      err = data.message;
      trace = data.trace;
    }
  }

  if (shouldToast) {
    // toast.error(err);
  }

  return new ApiResponse(false, null, `${err}`, trace);
};
