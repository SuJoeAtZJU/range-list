class RangeList {
  /**
   * Array<[number, number]>
   */
  rangeList = [];
  /**
   * validate if the range is validate
   * @param {[number, number]} range 
   * @returns 
   */
  validate(range) {
    if (
      Array.isArray(range) &&
      range.length === 2 &&
      range.every(item => typeof item === 'number') &&
      range[0] < range[1]
    ) {
      return true;
    }

    return false;
  }
  /**
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    /**
     * check if the range is legal
     */
    if (this.validate(range)) {
      // get the index
      let leftIndex = this._findNumberIndex(range[0]);
      let rightIndex = this._findNumberIndex(range[1]);

      // there will alawys be one more range appended to rangelist
      // remember to change the range value in different cases
      const finalRange = [];

      if (!Number.isInteger(leftIndex)) {
        finalRange[0] = range[0];
      } else {
        finalRange[0] = this.rangeList[leftIndex][0];
      }

      if (!Number.isInteger(rightIndex)) {
        finalRange[1] = range[1];
      } else {
        finalRange[1] = this.rangeList[rightIndex][1];
      }

      // when both ranges locate on lines, remember to +1 because we will merge two lines into one.
      const deleteCount = Number.isInteger(leftIndex) && Number.isInteger(rightIndex) ? rightIndex - leftIndex + 1 : Math.ceil(rightIndex - leftIndex);
      this.rangeList.splice(Math.ceil(leftIndex), deleteCount, finalRange);
    }
  }
  /**
   * Removes a range from the list
   * @param {Array<number>} beginning and end of range.
   */
  remove(range) {
    /**
     * check if the range is legal
     */
    if (this.validate(range)) {
      // get the index
      let leftIndex = this._findNumberIndex(range[0]);
      let rightIndex = this._findNumberIndex(range[1]);

      // get the nearest range
      const upperLeftIndex = Math.ceil(leftIndex);
      const floorRightIndex = Math.floor(rightIndex);

      // the ranges waited to be appended to the rangeList
      const finalRange = [];

      // for remove, there will always be 2 new ranges
      finalRange.push([
        this.rangeList[upperLeftIndex][0],
        range[0]
      ]);
      finalRange.push([
        range[1],
        this.rangeList[floorRightIndex][1]
      ]);

      // when the range happens to locate on lines instead of out of lines
      // remember to +1 because the located lines will be removed too
      let deleteCount = Math.ceil(rightIndex - leftIndex);
      if (Number.isInteger(leftIndex) && Number.isInteger(rightIndex)) {
        deleteCount += 1;
      }

      // only the legal ones will be appended, remember to filter
      this.rangeList.splice(upperLeftIndex, deleteCount, ...finalRange.filter(this.validate));
    }
  }
  /**
   * Prints out the list of ranges in the range list
   */
  print() {
    console.log(this.rangeList.map(item => `[${item[0]}, ${item[1]})`).join(' '));
  }
  /**
   * a search implementation for rangeList
   * @param {*} number 
   * @returns 
   */
  _findNumberIndex(number) {
    return this._findIndex((item, index) => {
      if (number >= item[0] && number <= item[1]) {
        return 0;
      } else if (number < item[0]) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  /**
   * a simple 2-split find implement, return index when match the range,
   * otherwise return a float index to indicate where the number is
   * @param {} cb 
   * @param {*} startIndex 
   * @param {*} endIndex 
   * @returns number
   */
   _findIndex(cb, startIndex = 0, endIndex = this.rangeList.length - 1) {
    if (endIndex < 0) {
      return -0.5;
    }
    const findIndex = Math.floor((startIndex + endIndex) / 2);
    const findItem = this.rangeList[findIndex];
    const retValue = cb(findItem, findIndex);

    if (startIndex === endIndex) {
      if (retValue === -1) {
        return findIndex - 0.5;
      } else if (retValue === 1) {
        return findIndex + 0.5;
      } else {
        return findIndex;
      }
    } else {
      if (retValue === -1) {
        return this._findIndex(cb, startIndex, findIndex);
      } else if (retValue === 1) {
        return this._findIndex(cb, findIndex + 1, endIndex);
      } else if (retValue === 0) {
        return findIndex;
      } else {
        return -1;
      }
    }
  }
}


const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)