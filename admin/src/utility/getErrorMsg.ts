
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

  return errorMessage;

}

export default getErrorMsg;