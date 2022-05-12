export const solution = {
  id: 9,
  filename: "Stack",
  extension: "js",
  code: `// https://github.com/TheAlgorithms/JavaScript/blob/master/Data-Structures/Stack/StackES6.js
class Stack {
  constructor () {
    this.stack = []
    this.top = 0
  }

  // Adds a value to the end of the Stack
  push (newValue) {
    this.stack.push(newValue)
    this.top += 1
  }

  // Returns and removes the last element of the Stack
  pop () {
    if (this.top !== 0) {
      this.top -= 1
      return this.stack.pop()
    }
    throw new Error('Stack Underflow')
  }

  // Returns the number of elements in the Stack
  get length () {
    return this.top
  }

  // Returns true if stack is empty, false otherwise
  get isEmpty () {
    return this.top === 0
  }

  // Returns the last element without removing it
  get last () {
    if (this.top !== 0) {
      return this.stack[this.stack.length - 1]
    }
    return null
  }

  // Checks if an object is the instance os the Stack class
  static isStack (el) {
    return el instanceof Stack
  }
}`
}