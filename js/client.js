/* intitialize new taquin object
pass parameters to it inside {} to define settings
possible settings are :
- placeHolder (expecting id of a dom element, is optionnal and default to body)
*/
var taquin = new Taquin({ 
  placeHolder: 'canvas-container'
});

// scroll to bottom of the page
window.onload = function(){
  window.scrollTo(0, document.body.scrollHeight);
}

// show / hide menu on double click
var menu = document.getElementById('menu');
function toggleMenu(){
  if(menu.style.display === 'none'){
    menu.style.display = 'block';
  }else{
    menu.style.display = 'none';
  }
}
document.ondblclick = toggleMenu;
document.ongesturestart = toggleMenu;

// load image
document.getElementById('url').onclick = function(){
  window.scrollTo(0, document.body.scrollHeight);
  var url = document.getElementById('fileUrl').value;
  taquin.loadImage(url);
};

document.getElementById('file').onclick = function(){
  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  if( ! URL ){
    URL={};
  }
  if( ! URL.createObjectURL) {
    URL.createObjectURL=function(obj){return obj;}
  }
  var hiddenInput = document.getElementById('hiddenInput');
  hiddenInput.click();
  hiddenInput.onchange = function() {
    var file = hiddenInput.files[0];
    console.log(file)
    var fileURL = URL.createObjectURL(file);
    console.log(fileURL)
    taquin.loadImage(fileURL);
  };
};

document.getElementById('random').onclick = function(){
  var viewportWidth = document.documentElement.clientWidth;
  if(viewportWidth >= 1280){
    viewportWidth = 1280;
  }
  var height = Math.round(viewportWidth / 1.777777777777778);
  var url = 'http://imagemockup.com/'+viewportWidth+'/'+height+'/';
  taquin.loadImage(url);
};

// shuffle pieces on  button click
document.getElementById('shuffle').onclick = function(){
  window.scrollTo(0, document.body.scrollHeight);
  var difficulty = document.getElementById('difficulty').value;
  taquin.shuffle(difficulty);
};

// show original image on button click
var viewOriginalImage = document.getElementById('viewOriginalImage');
viewOriginalImage.onmousedown = function(){taquin.viewOriginalImage()};
viewOriginalImage.ontouchstart = function(){taquin.viewOriginalImage()};
// when user stop clicking, come back to game
viewOriginalImage.onmouseup = function(){taquin.comeBackToGame()};
viewOriginalImage.ontouchend = function(){taquin.comeBackToGame()};

// define custom success message when game is won
document.addEventListener('gameOver', function(){
  var successMessage = '<div class="alert alert-success"><strong>Well done you won!</strong> you can shuffle to play again.</div>'
  var alertContainer = document.getElementById('alert-container');
  alertContainer.innerHTML = successMessage;
  scroll(0,0);
  setTimeout(function(){
    alertContainer.innerHTML = '';
  },3000)
}, false)