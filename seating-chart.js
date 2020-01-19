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
  dragSort: function() {
    return areas;
  }
})
// When dragging set the object dimensions to fixed
// values so that they won't scale themselves to the
// containing object as they move.
.on('dragStart', function(item) {
  item.getElement().style.width = 85 + 'px';
  item.getElement().style.height = item.getHeight() + 'px';
})
.on('dragReleaseEnd', function(item) {
  item.getElement().style.width = '';
  item.getElement().style.height = '';
});

areas.push(unseated);

unseated.sort('name', {
  layout: 'instant'
});

allSeats.forEach(function(s) {

  var seat = new Muuri(s, {
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: function() {
      return areas;
    }
  })
  areas.push(seat);
});
