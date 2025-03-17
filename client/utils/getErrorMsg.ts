const getErrorMsg = (error: any, status: number | null = null, task: string) => {
  let errorMessage = `Something went wrong during ${task}`;

  // Check for network connectivity issues
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'No internet connection. Please check your network connection and try again.';
  }

  // Check if the server is unreachable
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return 'Unable to connect to the server. Please try again later.';
  }

  if (status === null || (error.response && error.response.status === status)) {
    try {
      let preElement = null;

      console.log(typeof window);

      if (typeof window !== "undefined") {
        // Use DOMParser in the browser
        const parser = new DOMParser();
        const doc = parser.parseFromString(error.response.data, "text/html");
        preElement = doc.querySelector("pre");
      } else {
        // Only import `jsdom` on the server
        const { JSDOM } = require("jsdom");
        
        const dom = new JSDOM(error.response.data);
        preElement = dom.window.document.querySelector("pre")
      }

      if(preElement){
        errorMessage = preElement
          ? preElement.innerHTML.split("<br>")[0].replace(/^Error:\s*/, "")
          : errorMessage;
      }

    } catch (err) {
      console.error("Error parsing HTML:", err);
    }
  }

  // Specific status code handling
  if (error.response?.status === 477) {
    errorMessage = "Login to continue";
  }
  if (error.response?.status === 577) {
    errorMessage = "Session expired. Login";
  }

  return errorMessage;
};

export default getErrorMsg;