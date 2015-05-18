var days = []
var currentDay
var Day = function() {
  this.dayNum = days.length + 1
  this.drawDayBtn()
  this.drawDayPanel()
  this.hotels = []
  this.restaurants = []
  this.thingsToDo = []
  this.markers = []
}

Day.prototype.clearMarkersFromMap = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null)
  })
}
Day.prototype.addMarkersToMap = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(map)
  })
}

Day.prototype.drawDayPanel = function() {
  this.$dayPanel = templates.get('day-panel')
  this.$dayPanel.append(this.dayNum)
}

Day.prototype.addActivity = function(type, activity) {
  var self = this;
  console.log("this is type", type)
  var $list = $('#itinerary  .' + type + '-group')
  $listItem = templates.get('itinerary-item')
  $listItem.find('.title').text(activity.name)
  $list.append($listItem)
  $.ajax({
      type: 'POST',
      url: '/days/' + self.dayNum + '/' + type,
      data: {
        hotelId: self.hotels[0]._id,
        restaurantId: self.restaurants[0]._id,
        thingId: self.thingsToDo[0]._id
      },
      success: function(responseData){
        console.log("add hotel to specific day");
      }
    })
  var marker = drawLocation(activity.place[0].location)
  this.markers.push(marker)
  //find the right ul
  //get a new template
  //populate it
  //put it in the right ul
}

Day.prototype.drawDayBtn = function() {
  var self = this

  var $dayBtn = templates.get('day-btn')//$('<button class="btn btn-circle day-btn">' + this.dayNum + '</button>')
  $dayBtn.text(this.dayNum)
  $('#add-day').before($dayBtn)

  $dayBtn.on('click', function() {
    if(currentDay) currentDay.clearMarkersFromMap()
    currentDay = self
    currentDay.addMarkersToMap()
    $.ajax({
      type: 'GET',
      url: '/days/' + $(this).text(),  //day number 1, 2 or 3 for example
      success: function (responseData) {
        console.log("day retrieved", responseData);
      }
    })
    


    $('#itinerary #day-panel').replaceWith(self.$dayPanel)
  })
}

$('#add-day').on('click', function() {
  var newDay = new Day();
  $.ajax({
    type: 'POST',
    url: '/days',
    data: {dayNumber: days.length + 1},
    success: function (responseData) {
        console.log("new day posted");
    }
  });
  days.push(newDay)
console.log('you clicked the button');

})
