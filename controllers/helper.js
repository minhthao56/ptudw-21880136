function calculateStartIndex(index) {
  return 5 - index;
}

function createStart(numberStart) {
  let start = "";

  for (let i = 4; i >= 0; i--) {
    if (numberStart > i) {
      start = start + '<i class="fa fa-star disabled"></i>';
    } else {
      start = start + '<i class="fa fa-star"></i>';
    }
  }
  return start;
}

function createStartInComment(numberStart) {
  let start = "";

  for (let i = 1; i <= 5; i++) {
    if (numberStart < i) {
      start = start + '<i class="fa fa-star disabled"></i>';
    } else {
      start = start + '<i class="fa fa-star"></i>';
    }
  }
  return start;
}

module.exports = { calculateStartIndex, createStart, createStartInComment };
