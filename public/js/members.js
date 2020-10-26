let member;
var artistSearch = $("#artistSearch");
var saveArt = $(".saveArt");

$('.test').on('click', function(e) {
  e.preventDefault();
  $.get('/artbook/' + member, function(data) {
    if (data){
      console.log(data);
    }
  })
})

$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    member = data.email;
  });
  
  $('body').scrollTo('#scrollHere', 2000);

});

//search for art. clear the results div every time you make a new search
$(artistSearch).on("submit", function handleFormSubmit(event) {
  event.preventDefault()
  $('.results').empty();
    var name = $("#search");

//query the db and add results
  $.get("/namesearch/" + name.val().trim(), function(data) {
      if (data) {
        // If this post exists, prefill our cms forms with its data
        // console.log(data);
        for(i = 0; i < data.length; i++) {
          if(data[i].thumbnailUrl !== '\"\"') {
            $('.results').append(`
              <div class="col-sm-6 col-md-3">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">${data[i].title}</h5>
                    <img src="${data[i].thumbnailUrl}" style="height: 120px;" />
                    <p>${data[i].artist} ${data[i].year}</p>
                    <button art-id="${data[i].id}" class="btn btn-success btn-block saveArt">Save to your Artbook</button>
                  </div>
                </div>
              </div>
            `);
          }
        }

      }
    });
})

//save art based on user_id (email) and artID
$('body').on('click', '.saveArt', function(event) {
  event.preventDefault()

  let artID = event.target.getAttribute('art-id');
  
  $.post("/api/saveart", {
    email: member,
    id: artID
  })
})
