export const solution = {
  id: 3,
  filename: "insertionSort",
  extension: "js",
  code: `// source https://github.com/trekhleb/javascript-algorithms 
function insertionSort(originalArray) {
  const array = [...originalArray];

  // Go through all array elements...
  for (let i = 1; i < array.length; i += 1) {
    let currentIndex = i;

    // Check if previous element is greater than current element.
    // If so, swap the two elements.
    while (
      array[currentIndex - 1] !== undefined
      && (array[currentIndex] < array[currentIndex - 1])
    ) {
      // Swap the elements.
      [
        array[currentIndex - 1],
        array[currentIndex],
      ] = [
        array[currentIndex],
        array[currentIndex - 1],
      ];

      // Shift current index left.
      currentIndex -= 1;
    }
  }

  return array;
}
`
}