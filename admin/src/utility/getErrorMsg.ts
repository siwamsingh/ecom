
const  getErrorMsg = (error: any, status: Number, task: string) => {
  let errorMessage = "Unexpected error occurred during " + task;

  if (error.response && error.response.status === status) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(error.response.data, "text/html");
    const preElement = doc.querySelector("pre");
    errorMessage = preElement
      ? preElement.innerHTML.split("<br>")[0].replace(/^Error:\s*/, "")
      : errorMessage;
  }

  return errorMessage;

}

export default getErrorMsg;