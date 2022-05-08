export const solution = {
  id: 4,
  filename: "isPalindrome",
  extension: "js",
  code: `// source https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/string/palindrome
function isPalindrome(string) {
  let left = 0;
  let right = string.length - 1;

  while (left < right) {
    if (string[left] !== string[right]) {
      return false;
    }
    left += 1;
    right -= 1;
  }

  return true;
}
`
}