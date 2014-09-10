// Pen JS Starts Here
jQuery(document).ready(function(){
      
  // ---------
  // SVG 
  var snapC = Snap("#svgC"); 

  // SVG C - "Squiggly" Path
  var myPathC = snapC.path("M62.9 -74.9c-25-7.74-56.6 4.8-60.4 24.3-3.73 19.6 21.6 35 39.6 37.6 42.8 6.2 72.9-53.4 116-58.9 65-18.2 191 101 215 28.8 5-16.7-7-49.1-34-44-34 11.5-31 46.5-14 69.3 9.38 12.6 24.2 20.6 39.8 22.9 91.4 9.05 102-98.9 176-86.7 18.8 3.81 33 17.3 36.7 34.6 2.01 10.2.124 21.1-5.18 30.1").attr({
    id: "squiggle",
    fill: "none",
    strokeWidth: "5",
    stroke: "#ffffff",
    strokeMiterLimit: "10",
    strokeDasharray: "12 6",
    strokeDashOffset: "180"
  });

  /*var questionPath = snapC.path("m267.999998,1.93671c0,0 3.10606,-12.354431 3.10606,-12.354431c0,0 6.212122,-6.949368 6.212122,-6.949368c0,0 8.07576,-4.632912 8.07576,-4.632912c0,0 8.696972,0 8.696972,0c0,0 6.833332,5.405064 6.833332,5.405064c0,0 5.590912,6.949368 5.590912,6.949368c0,0 2.484844,11.582279 2.484844,11.582279c0,0 -2.484844,7.721519 -2.484844,7.721519c0,0 -7.454548,6.177212 -7.454548,6.177212c0,0 -8.07576,4.632912 -8.07576,4.632912c0,0 -3.10606,6.949371 -3.10606,6.949371c0,0 0,11.582275 0,11.582275c0,0 0,6.177216 0,6.177216").attr({
    id: "question",
    fill: "none",
    strokeWidth: "10",
    strokeMiterLimit: "10",
    strokeDasharray: "9 9",
    strokeDashOffset: "988.01"
  });*/

//225.5 , -64
var questionPath = snapC.path("m295.47178,-49.59718c0,-9.07882 2.21544,-16.02401 7.22205,-22.64194c1.30752,-1.72807 6.09063,-6.43485 10.6293,-10.46018c11.98321,-10.6278 14.494,-14.60374 13.95722,-22.10416c-0.77673,-10.85942 -11.29179,-19.93814 -23.0585,-19.90936c-12.06104,0.02953 -20.32122,7.17855 -23.48053,20.32143").attr({
    id: "question",
    fill: "none",
    strokeWidth: "10",
    strokeMiterLimit: "10",
    strokeDasharray: "9 9",
    strokeDashOffset: "988.01"
  });



  // SVG C - Triangle (As Polyline)
  var Triangle = snapC.polyline("0, 30, 15, 0, 30, 30");
  Triangle.attr({
    id: "plane",
    fill: "#000"
  }); 

  var circleX = 295.47;
  var circleY = -29.86;

  var circle = snapC.circle(circleX, circleY, 10);
  circle.attr({
    id:"dot",
    fill: "none"
  });

  
  initTriangle();
  
  // Initialize Triangle on Path
  function initTriangle(){
    var triangleGroup = snapC.g( Triangle ); // Group polyline 
    movePoint = myPathC.getPointAtLength(length);
    triangleGroup.transform( 't' + parseInt(movePoint.x - 15) + ',' + parseInt( movePoint.y - 15) + 'r' + (movePoint.alpha - 90));
  }
  
  // SVG C - Draw Path
  var lenC = myPathC.getTotalLength();

  // SVG C - Animate Path
  function animateSVG() {
    
    myPathC.attr({
      stroke: '#ffffff',
      strokeWidth: 8,
      fill: 'none',
      // Draw Path
      "stroke-dasharray": "12 6",
      "stroke-dashoffset": "180"
    }).animate({"stroke-dashoffset": 10}, 3000,mina.easeinout);
    
    var triangleGroup = snapC.g( Triangle ); // Group polyline

    setTimeout( function() {
      Snap.animate(0, lenC, function( value ) {
   
        movePoint = myPathC.getPointAtLength( value );
      
        triangleGroup.transform( 't' + parseInt(movePoint.x - 15) + ',' + parseInt( movePoint.y - 15) + 'r' + (movePoint.alpha - 90));
    
      }, 3000,mina.easeinout, function(){
        alertEnd();
      });
    });
    
  } 
  
  // Callback Function
  function alertEnd(){

  /*  snapC.attr({
      height: "500px"
    });*/

    var lenB = questionPath.getTotalLength();
    questionPath.attr({
    stroke: '#000',
    strokeWidth: 15,
    fill: 'none',
    // Draw Path
    "stroke-dasharray": lenB + " " + lenB,
    "stroke-dashoffset": lenB
  }).animate({"stroke-dashoffset": 10}, 2000,mina.easeinout);

    var states = [
    {
        fill: '#000',
        cy: circleY
    },
    {
        fill: '#A10000',
        cy: circleY-10
    }, {
        fill: '#FF0000',
        cy: circleY
    }, {
        fill: '#A10000',
        cy: circleY+10
    }, {
        fill: '#000',
        cy: circleY
    }];

  (function animateCircle(el, i) {
    el.animate(states[i], 1000, function() {
        animateCircle(el, ++i in states ? i : 0);
    })
  })(circle, 0);

    // Enable Button
    $('#nin').removeAttr('disabled');
  }
  
  // Animate Button
  function kapow(){
    $("#nin").click(function(event){
      
      // Disable Button
      $(this).attr('disabled','disabled');    
      
      // Run SVG
      animateSVG();
      
    });
  }

  kapow();
  animateSVG();

});

