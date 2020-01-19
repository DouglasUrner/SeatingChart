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
areas.push(unseated);

unseated.sort('name', {
  layout: 'instant'
})

allSeats.forEach(function(s) {

  var seat = new Muuri(s, {
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: function() {
      return areas;
    }
  })
  areas.push(seat);
})
