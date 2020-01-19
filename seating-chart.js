var allSeats = [].slice.call(document.querySelectorAll('.seat'));
var areas = [];

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
// When dragging set the object dimensions to fixed
// values so that they won't scale themselves to the
// containing object as they move. This works because we are
// adding the style property to the element (so it overrides
// the CSS styling, then when we remove it, the CSS is still
// there and reasserts itself).
//
// TODO: It appears that when you change the size of a student
// tile as you move them between the seating area and the
// unseated area (which can shrink the tile) Muuuri allocates
// space for the larger size. Try fixing this by adjusting the
// CSS in the beforeReceive() event handler.
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
});
