var allSeats = [].slice.call(document.querySelectorAll('.seat'));
/**
 * All of the grids, used as the return value from the dragSort function.
 * @type {Array}
 */
var areas = [];
/**
 * Just the grids in the seat map (i.e., each individual seat).
 * @type {Array}
 *
 * XXX - how should this really be done? seatmap will probably be areas[1..end],
 *       we could depend on that and use areas[], or we could figure out how to
 *       pass unseated + seatmap[] as a single array as the return value from
 *       the dragSort function. But for now...
 */
var seatmap = [];

/**
 * Buttons
 */
var buttonClear = document.querySelector('.button-clear');
buttonClear.addEventListener('click', function() {
  /**
   * Loop through the seatmap and send them back to the unseated grid.
   */
  seatmap.forEach(function(grid) {
    grid._items.forEach(function(stu) {
      grid.send(stu, unseated, -1);
    })
  });
  unseated.sort('name', {
    layout: 'instant'
  });
});

var buttonRandom = document.querySelector('.button-random');
buttonRandom.addEventListener('click', function() {
  // /**
  //  * shuffle() the unseated array, then send each item to the seatmap. Should
  //  * check that the target is empty - maybe start with the first seat that
  //  * should be filled (the front of the room?) and work towards the back.
  //  */
  // indexes = [];
  // for (i = 0; i < unseated._items.length; i++) {
  //   indexes.push(i);
  // }
  // randomIndexes = shuffle(indexes);
  // count = 1;
  // randomIndexes.forEach(function(index) {
  //   console.log(unseated._items[index]);
  //   console.log(seatmap[seatmap.length - count]);
  //   // TODO: check that it's empty.
  //   unseated.send(unseated._items[index],
  //     seatmap[seatmap.length - count++], 0);
  // });

  for (i = seatmap.length - 1; i >= 0; i--) {
    if (unseated._items.length > 0) {
      if (seatmap[i]._items.length == 0) {
        // Empty seat.
        j = randomInt(0, unseated._items.length - 1);
        console.log(j + " -> " + i);
        unseated.send(unseated._items[j],
          seatmap[i], 0);
      }
    }
  }
});

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * [shuffle description]
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var buttonSave = document.querySelector('.button-save');
buttonSave.addEventListener('click', function() {
  alert('Save - not implemented yet.');
});

/**
 * Muuri grid: names of students without seat assignments.
 */
unseated = new Muuri('.unseated', {
  dragEnabled: true,
  sortData: {
    name: function(item, element) {
      return element.children[0].textContent;
    }
  },
  dragContainer: document.body,
  // dragSortPredicate: {
  //   action: 'swap',
  // },
  dragSort: function() {
    unseated.sort('name');
    return areas;
  }
})

/**
 * When dragging set the object dimensions to fixed values so that they won't
 * scale themselves to the containing object as they move. This works because we
 * are adding the style property to the element (so it overrides the CSS
 * styling, then when we remove it, the CSS is still there and reasserts
 * itself).
 *
 * TODO: It appears that when you change the size of a student tile as you move
 * them between the seating area and the unseated area (which can shrink the
 * tile) Muuuri allocates space for the larger size. Try fixing this by
 * adjusting the CSS in the beforeReceive() event handler.
 */
.on('dragStart', function(item) {
  item.getElement().style.width = 85 + 'px';
  item.getElement().style.height = item.getHeight() + 'px';
})
.on('dragReleaseEnd', function(item) {
  item.getElement().style.width = '';
  item.getElement().style.height = '';
});
// .on('beforeReceive', function(item) {
//   item.getElement().style.width = '';
//   item.getElement().style.height = '';
// });

areas.push(unseated);

// Ensure an initial sort.
unseated.sort('name', {
  layout: 'instant'
});

allSeats.forEach(function(s) {

  var seat = new Muuri(s, {
    dragEnabled: true,
    dragContainer: document.body,
    // dragSortPredicate: {
    //   action: 'swap',
    // },
    dragSort: function() {
      unseated.sort('name');
      return areas;
    },
  })
  areas.push(seat);
  seatmap.push(seat);
});

/**
 * While seats are being arranged persist layout to local storage. After
 * saving layout (seating chart) is stored in the database and will be the
 * same for all users/devices.
 *
 * Save as JSON:
 * - Array for unseated grid.
 * - Array for the individual grids in the seatmap.
 *
 * Name for the block being seated. Delete on save. If necessary seats
 * could be given individual id values.
 */

//console.log(areas[0]);

// var layout = window.localStorage.getItem('layout');
//
// if (layout) {
//   loadLayout(grid, layout);
// } else {
//   grid.layout(true);
// }
//
// function loadLayout(grid, serializedLayout) {
//   var layout = JSON.parse(serializedLayout);
//   var currentItems = grid.getItems();
//   var currentItemIds = currentItems.map(function (item) {
//     return item.getElement().getAttribute('seat')
//   });
//   var newItems = [];
//   var itemId;
//   var itemIndex;
//
//   for (var i = 0; i < layout.length; i++) {
//     itemId = layout[i];
//     itemIndex = currentItemIds.indexOf(itemId);
//     if (itemIndex > -1) {
//       newItems.push(currentItems[itemIndex])
//     }
//   }
//   grid.sort(newItems, {layout: 'instant'});
// }
//
// function saveLayout(grid) {
//   var layout = serializeLayout(grid);
//   window.localStorage.setItem('layout', layout);
// }
//
// function serializeLayout(grid) {
//   var itemIds = grid.getItems().map(function (item) {
//     return item.getElement().getAttribute('data-seat-position');
//   });
//   return JSON.stringify(itemIds);
// }
