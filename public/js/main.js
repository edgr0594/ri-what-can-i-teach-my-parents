// @TODO most of this stuff is home page specific.  Make it only load to front page.
$(document).ready(function() {
  var container = $('.notes');
  var flashElement = $('.new-content-flash');
  var flashInAnimationName = 'fadeInDown';
  var flashOutAnimationName = 'fadeOut';

  // Isotope stuff.
  container.isotope({
    itemSelector: '.note',
    // options...
    resizable: false, // disable normal resizing
    // set columnWidth to a percentage of container width
    masonry: { columnWidth: container.width() / 50 }
  });

  // Bind to the flash element that every time the animation is over, to clear the animate.css classes.
  flashElement.bind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    // React differently based on in our out animation;
    if ($(this).hasClass(flashOutAnimationName)) {
      // Clear html on flash out.
      $(this).html('');
    }

    // Regardless remove animation classes.
    $(this).removeClass('animated ' + flashInAnimationName);
    $(this).removeClass('animated ' + flashOutAnimationName);

  });


  // Socket Ops.
  var socket = io.connect(window.location.href);
  socket.on('connect', function() {
    console.log('CLIENT: Connection Made');
  });

  socket.on('newNoteAdded', function(data) {
    console.log('incoming');
    console.log(data);
    // @TODO how to template this?
    // Get Current "Unread" Note Count
    var noteCount = $('.new-content-flash').data('note-count') || 0;
    // Increment by 1.
    noteCount = noteCount + 1;
    flashElement
      // Store Note Count.
      .data('note-count', noteCount)
      // Display Message.
      .html('<strong>' + noteCount + '</strong> New Notes Available <a href="#" class="flash-show-items">Show Me</a>')
      // Make it animate.css pretty.
      .addClass('animated ' + flashInAnimationName);
    // Template the new note.
    var newNote = $("<li class='note'><div class='note-text'>" + data.text + "</div></li>");
    // Prepend it to the container, but don't re-init isotope until Show Me Is Clicked.
    container.prepend(newNote);

    // Since the HTML keeps refreshing in the flash, we have to keep re-binding the callback for click on Show Me.
    // This is shitty and has to be a better way.
    $('.flash-show-items').click(function(event) {
      console.log('flash show');
      event.preventDefault();
      event.stopPropagation();
      // Rearrange items in container.
      container
        .isotope('reloadItems')
        .isotope({ sortBy: 'original-order' });

      // Clear out the text from flash element and fade it out.
      flashElement
        .data('note-count', 0)
        .addClass('animated ' + fadeOutAnimationName)
      return false;
    });
  });

  // @TODO Should this just be ajax?
  $('#new-note-form .btn').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    // @TODO -- rework this so that validation is still done properly.
    var newNoteText = $('#new-note-form #note-text').val();
    var note = {
      text: newNoteText,
      twitterHandle: '',
    };
    socket.emit('newNote', note);
    return false;
  });



  // update columnWidth on window resize
  $(window).smartresize(function(){
    container.isotope({
      // update columnWidth to a percentage of container width
      masonry: { columnWidth: container.width() / 50 }
    });
  });
});


