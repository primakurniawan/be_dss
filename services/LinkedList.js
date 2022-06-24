class Node {
  constructor(item) {
    this.value = item;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  add(value) {
    const node = new Node(value);

    let current;

    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }
    this.length++;
    return this;
  }

  removeFrom(index) {
    if (index < 0 || index >= this.size) {
      throw new Error("Out of Indexed!");
    } else {
      let curr,
        prev,
        it = 0;
      curr = this.head;
      prev = curr;
      if (index === 0) {
        this.head = curr.next;
      } else {
        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }
        prev.next = curr.next;
      }
      this.length--;
      return curr.value;
    }
  }

  get array() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  get size() {
    return this.length;
  }

  sort() {
    let result = null;
    let current = this.head;
    let next;

    //Iterate the loop
    while (current !== null) {
      next = current.next;

      //Sort the linked list till the current element and store it
      result = this.sortedInsert(result, current);
      current = next;
    }

    //Return the sorted list
    return result;
  }

  //Function to sort the list
  sortedInsert(sorted, newNode) {
    //Temporary node to swap the elements
    let temp = new Node();
    let current = temp;
    temp.next = sorted;

    //Sort the list based on the specified order
    while (current.next !== null && current.next.element < newNode.element) {
      current = current.next;
    }

    //Swap the elements
    newNode.next = current.next;
    current.next = newNode;

    //Return the sorted list.
    return temp.next;
  }

  findElement(index) {
    let currentNode = this.head;
    let count = 0;

    while (currentNode) {
      if (count === index) {
        // found the element
        return currentNode;
      }

      count++; // increment counter
      currentNode = currentNode.next; // move to next node
    }

    return -1;
  }

  reverse() {
    let current = this.head;
    let prev = null;
    let next;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }
}

module.exports = { Node, LinkedList };
