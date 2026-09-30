/**
 * Check whether a ReactQuill HTML value is empty.
 *
 * Handles values like:
 * <p><br></p>
 * <p></p>
 * <p>&nbsp;</p>
 * <p>   </p>
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isQuillEmpty = (value) => {
  if (!value) {
    return true;
  }

  const temp = document.createElement("div");
  temp.innerHTML = value;

  const text = temp.textContent || temp.innerText || "";

  return !text.replace(/\u00a0/g, " ").trim();
};