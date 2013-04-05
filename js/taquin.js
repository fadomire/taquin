var Taquin = function(settings) {
    // define settings for the game, if not defined put default
    var settings = {
      placeHolder : document.getElementById(settings.placeHolder) || document.getElementsByTagName('body')[0]
    }
    
    var canvas;
    var ctx;
    var originalCanvas;
    var originalCtx;
    var currentCanvas;
    // load the source image
    var image;
    
    // store elements in array to compare their position later and determine if game is won or lost
    var elements = [];
    
    // define some later usefull vars
    var element;
    var elementWidth;
    var elementHeight;
    var cropStartX;
    var cropStartY;
    var mouse = {x:0,y:0};
    var currentDropElement;
    
    this.loadImage = function loadImage(src){
      settings.placeHolder.innerHTML = '<div id="alert-container" ><div class="alert alert-info">Waiting for image to load...</div></div>';
      if(src===undefined || src === ''){
        src = 'img/hello-world.jpg';
      }
      image = new Image();
      image.addEventListener('load',loadImageToCanvas,false);
      image.src = src;
    }
    this.loadImage();
    // load image into canvas
    function loadImageToCanvas(){
      console.log(image.width)
      // reset canvas before loading image
      settings.placeHolder.innerHTML = '';
      // define canvas elements
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      originalCanvas = document.createElement('canvas');
      originalCtx  = originalCanvas.getContext('2d');
      
      // get viewport dimension
      var viewportWidth = document.documentElement.clientWidth;
      var viewportHeight = document.documentElement.clientHeight;
      //console.log(viewportWidth)
      
      // define canvas dimensions
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;
      originalCanvas.width = viewportWidth;
      originalCanvas.height = viewportHeight;
      
      // scale canvas to pixel ratios
      //ctx.scale(pixelRatio, pixelRatio);
      //originalCtx.scale(pixelRatio, pixelRatio);
      drawResizedCanvas(canvas, ctx, image);
      drawResizedCanvas(originalCanvas, originalCtx, image);
      
      settings.placeHolder.appendChild(canvas);
      
      // prevent any user interactions
      settings.placeHolder.onmousedown = null;
      settings.placeHolder.onmousemove = null;
      settings.placeHolder.onmouseup = null;
      settings.placeHolder.ontouchstart = null;
      settings.placeHolder.ontouchmove = null;
      settings.placeHolder.ontouchend = null;
    }
    
    function drawResizedCanvas(canvas, ctx, image){
      var sourceX = 0;
      var sourceY = 0;
      var destX = 0;
      var destY = 0;
      
      
      if (canvas.width > canvas.height) {
        var stretchRatio = ( image.width / canvas.width );
        var sourceWidth = Math.round(image.width);
        var sourceHeight = Math.round(canvas.height*stretchRatio);
        sourceY = Math.round((image.height - sourceHeight)/2);
      } else {
        var stretchRatio = ( image.height / canvas.height );
        var sourceWidth = Math.round(canvas.width*stretchRatio);
        var sourceHeight = Math.round(image.height);
        sourceX = Math.round((image.width - sourceWidth)/2);
      }            
      console.log(stretchRatio)
      console.log(canvas.height)
      var destWidth = canvas.width;
      var destHeight = canvas.height;
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    }
    
    // cut image into game pieces
    function cutImageIntoPieces(difficulty){
      // reset elements array to prevent any previous element to stay there
      elements = [];
      // find width and height for each element
      elementWidth = canvas.width / difficulty;
      elementHeight = canvas.height / difficulty;
      // console.log(elementWidth)
      // console.log(canvas.width)
      // console.log(pixelRatio)
      cropStartX = 0;
      cropStartY = 0;
      for(var i = 0; i < difficulty * difficulty; i++){
        element = {};
        // save original position to be able to check for a won game
        element.originalX = cropStartX;
        element.originalY = cropStartY;
        elements.push(element);
        // draw each element in canvas
        //ctx.drawImage(originalCanvas, cropStartX, cropStartY, elementWidth, elementHeight, cropStartX, cropStartY, elementWidth, elementHeight);
        //ctx.strokeRect(cropStartX, cropStartY, elementWidth, elementHeight);
        cropStartX += elementWidth;
        if(cropStartX >= canvas.width){
          cropStartX = 0;
          cropStartY += elementHeight;
        }
      }
      //console.log(elements)
      
    }
    
    // public method to shuffle pieces
    this.shuffle = function shuffle(difficulty){
      var intRegex = /^\d+$/;
      if(!intRegex.test(difficulty)) {
        difficulty = 4;
      }else{
        difficulty = parseInt(difficulty);
      }
      cutImageIntoPieces(difficulty);
      // use an utility function to shuffle the array
      shuffleArray(elements);
      // make sure canvas is clean
      ctx.clearRect(0,0,canvas.width,canvas.height);
      cropStartX = 0;
      cropStartY = 0;

      // redispatch shuffled elements
      for(var i = 0; i < elements.length; i++){
        element = elements[i];
        element.x = cropStartX;
        element.y = cropStartY;
        //console.log(cropStartX)
        
        ctx.drawImage(originalCanvas, element.originalX, element.originalY, elementWidth, elementHeight, cropStartX, cropStartY, elementWidth, elementHeight);
        ctx.strokeRect(cropStartX, cropStartY, elementWidth, elementHeight);
        cropStartX += elementWidth;
        if(cropStartX >= canvas.width){
          cropStartX = 0;
          cropStartY += elementHeight;
        }
      }
      //console.log(elements)

      // define click and double click event. game start.
      settings.placeHolder.onmousedown = onCanvasClick;
      settings.placeHolder.ontouchstart = onCanvasClick;
    }
    

    // public method to show original image as an help in the game
    this.viewOriginalImage = function viewOriginalImage(){
      // save original canva to be able to get back to game
      currentCanvas = document.createElement('canvas');
      currentCanvas.width = canvas.width;
      console.log(currentCanvas.width)
      currentCanvas.height = canvas.height;
      currentCanvasCtx = currentCanvas.getContext('2d');
      //currentCanvasCtx.scale(1, 1);
      //drawResizedCanvas(currentCanvas, currentCanvasCtx, currentCanvas);
      currentCanvasCtx.drawImage(canvas, 0,0);
      // show original image
      //drawResizedCanvas(canvas, ctx, image);
      ctx.drawImage(originalCanvas, 0, 0);
    }
    
    // public method to come back to game after showing original
    this.comeBackToGame = function comeBackToGame(){
      //drawResizedCanvas(currentCanvas, ctx, image);
      ctx.drawImage(currentCanvas, 0, 0);
    }
    
    // user interact with the game 
    function onCanvasClick(e){
      //e.preventDefault();
      // check if user scrolled the page
      var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      var left = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
      // find the position where user clicked and store it in the mouse var
      if(e.touches){
        var touch = e.touches[0];
        mouse.x = touch.clientX + left - canvas.offsetLeft;
        mouse.y = touch.clientY + top - canvas.offsetTop;
      }else{
        mouse.x = e.clientX + left - canvas.offsetLeft;
        mouse.y = e.clientY + top - canvas.offsetTop;
      }
      // check if mouse position and element match
      currentElement = checkElementClicked();
      // if user clicked a game element, then put this element at mouse position
      if(currentElement != null){
        ctx.clearRect(currentElement.x,currentElement.y,elementWidth,elementHeight);
        ctx.save();
        ctx.globalAlpha = .9;
        ctx.drawImage(originalCanvas, currentElement.originalX, currentElement.originalY, elementWidth, elementHeight, mouse.x - (elementWidth / 2), mouse.y - (elementHeight / 2), elementWidth, elementHeight);
        ctx.restore();
        // define events for mouse move and element dropped
        settings.placeHolder.onmousemove = updateCanvas;
        settings.placeHolder.onmouseup = elementDropped;
        settings.placeHolder.ontouchmove = updateCanvas;
        settings.placeHolder.ontouchend = elementDropped;
      }
    }
    
    // iterate elements to see if mouse match an element
    function checkElementClicked(){
      var i;
      var element;
      for(i = 0;i < elements.length;i++){
          element = elements[i];
          // check if mouse position inside an element
          if(mouse.x < element.x || mouse.x > (element.x + elementWidth) || mouse.y < element.y || mouse.y > (element.y + elementHeight)){
              // no element so do nothing
          }
          else{
              return element;
          }
      }
      return null;
    }
    
    // on mouse move update element position to follow mouse positon
    function updateCanvas(e){
      e.preventDefault();
      currentDropElement = null;
      var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      var left = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
      if(e.touches){
        var touch = e.touches[0];
        mouse.x = touch.clientX + left - canvas.offsetLeft;
        mouse.y = touch.clientY + top - canvas.offsetTop;
      }else{
        mouse.x = e.clientX + left - canvas.offsetLeft;
        mouse.y = e.clientY + top - canvas.offsetTop;
      }
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var i;
      var element;
      for(i = 0;i < elements.length;i++){
        element = elements[i];
        if(element == currentElement){
           continue;
        }
        ctx.drawImage(originalCanvas, element.originalX, element.originalY, elementWidth, elementHeight, element.x, element.y, elementWidth, elementHeight);
        ctx.strokeRect(element.x, element.y, elementWidth,elementHeight);
        if(currentDropElement == null){
          if(mouse.x < element.x || mouse.x > (element.x + elementWidth) || mouse.y < element.y || mouse.y > (element.y + elementHeight)){
              // element is not inside another element
          }
          else{
            // element match another element, display green helper
            currentDropElement = element;
            ctx.save();
            ctx.globalAlpha = .4;
            ctx.fillStyle = '#009900';
            ctx.fillRect(currentDropElement.x,currentDropElement.y,elementWidth, elementHeight);
            ctx.restore();
          }
        }
      }
      ctx.save();
      ctx.globalAlpha = .6;
      ctx.drawImage(originalCanvas, currentElement.originalX, currentElement.originalY, elementWidth, elementHeight, mouse.x - (elementWidth / 2), mouse.y - (elementHeight / 2), elementWidth, elementHeight);
      ctx.restore();
      ctx.strokeRect( mouse.x - (elementWidth / 2), mouse.y - (elementHeight / 2), elementWidth,elementHeight);
    }
    
    // replace dropped element by current element
    function elementDropped(e){
      //e.preventDefault();
      settings.placeHolder.onmousemove = null;
      settings.placeHolder.onmouseup = null;
      settings.placeHolder.ontouchmove = null;
      settings.placeHolder.ontouchend = null;
      if(currentDropElement != null){
        var tmp = {x:currentElement.x,y:currentElement.y};
        currentElement.x = currentDropElement.x;
        currentElement.y = currentDropElement.y;
        currentDropElement.x = tmp.x;
        currentDropElement.y = tmp.y;
        // reset currentDropElement to null to avoid any reference to previous dropped element
        currentDropElement = null;
      }
      checkWin();
    }
    
    // check if elements are in original state, if yes, user won
    function checkWin(){
      ctx.clearRect(0,0,canvas.width,canvas.Height);
      var gameWin = true;
      var i;
      var element;
      for(i = 0;i < elements.length;i++){
        element = elements[i];
        ctx.drawImage(originalCanvas, element.originalX, element.originalY, elementWidth, elementHeight, element.x, element.y, elementWidth, elementHeight);
        ctx.strokeRect(element.x, element.y, elementWidth,elementHeight);
        if(element.x != element.originalX || element.y != element.originalY){
           gameWin = false;
        }
      }
      if(gameWin){
          setTimeout(gameOver,500);
      }
    }
    
    // fire the gameOver event
    function gameOver(){
      settings.placeHolder.onmousedown = null;
      settings.placeHolder.onmousemove = null;
      settings.placeHolder.onmouseup = null;
      settings.placeHolder.ontouchstart = null;
      settings.placeHolder.ontouchmove = null;
      settings.placeHolder.ontouchend = null;
      var gameOver = document.createEvent('HTMLEvents');
      gameOver.initEvent('gameOver', true, true ); 
      document.dispatchEvent(gameOver);
    }
    // utility function to shuffle array
    function shuffleArray(o){
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    }
    
    
};