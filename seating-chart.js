var itemContainers = [].slice.call(document.querySelectorAll('.board-column-content'));
var columnGrids = [];
var boardGrid;
var sort = document.querySelector('.sort');
alert(sort);


// Define the column grids so we can drag those
// items around.
itemContainers.forEach(function (container) {

  // Instantiate column grid.
  var grid = new Muuri(container, {
    items: '.board-item',
    layoutDuration: 400,
    layoutEasing: 'ease',
    dragEnabled: true,
    dragSort: function () {
      return columnGrids;
    },
    dragSortInterval: 0,
    dragContainer: document.body,
    dragReleaseDuration: 400,
    dragReleaseEasing: 'ease',
    sortData: {
      id: function(item, element) {
        return element.children[0].textContent
      }
    }
  })
  .on('dragStart', function (item) {
    // Set a fixed widht/height to the dragged item
    // so that it does not stretch unwillingly when
    // it's appended to the document body for the
    // duration of the drag.
    item.getElement().style.width = item.getWidth() + 'px';
    item.getElement().style.height = item.getHeight() + 'px';
  })
  .on('dragReleaseEnd', function (item) {
    // Remove the fixed width/height from the
    // dragged item now that it is back in a grid
    // column and can freely adjust to it's
    // surroundings.
    item.getElement().style.width = '';
    item.getElement().style.height = '';
    // Just in case, let's refresh the dimensions of all items
    // in case dragging the item caused some other items to
    // be different size.
    // XXX - don't think we need to do this. Maybe only on unseated area.
    columnGrids.forEach(function (grid) {
      grid.refreshItems();
    });
  })
  .on('layoutStart', function () {
    // Keep the board grid up to date with the
    // dimensions changes of column grids.
    boardGrid.refreshItems().layout();
  });

  // Add the column grid reference to the column grids
  // array, so we can access it later on.
  columnGrids.push(grid);

});

// Instantiate the board grid so we can drag those
// columns around.
boardGrid = new Muuri('.board', {
  layoutDuration: 400,
  layoutEasing: 'ease',
  dragEnabled: true,
  dragSortInterval: 0,
  dragStartPredicate: {
    handle: '.board-column-header-not'
  },
  dragReleaseDuration: 400,
  dragReleaseEasing: 'ease'
});

sort.addEventListener('click', function () {
  grid.sort('id');
});
