
const  getErrorMsg = (error: any, status: Number|null = null, task: string) => {
  let errorMessage = "Unexpected error occurred during " + task;

  if (status === null || error.response && error.response.status === status) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(error.response.data, "text/html");
      const preElement = doc.querySelector("pre");
      errorMessage = preElement
        ? preElement.innerHTML.split("<br>")[0].replace(/^Error:\s*/, "")
        : errorMessage;
    } catch (err) {
      console.error(err);
    }
  }

  if(error.response && error.response.status === 477){
    errorMessage = "Login to continue"
  }
  if(error.response && error.response.status === 577){
    errorMessage = "Session expired. Login Again."
  }
  
  return errorMessage;

}

export default getErrorMsg;