# IGME-330: Audrey Main

## Canvas Core Skills

* [Part 1 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/1-canvas-intro-to-drawing-context.md)

* [Part 2 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/2-canvas-paths-lines-arcs.md)

* [Part 3 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/3-begin-making-screensaver.md)

* [Part 4 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/4-adding-controls.md)

* [Part 5 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/5-write-some-code.md)

* [Part 6 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/6-review-and-more-about-paths.md)

* [Part 7 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/7-bezier-curves-and-gradients.md)

* [Part 8 Assignment Details](https://github.com/tonethar/IGME-330-Master/blob/master/notes/8-canvas-transformations.md)

## Part 1 Questions
* 1 - True or False. The canvas API was invented by Apple Computer
   * False, the company that created canvas API is Apple "Inc"

* 2 - True or False. The canvas API is hardware accelerated on most modern browsers
    * True

* 3 - True or False. Canvas is a vector-based graphics system
    * False, it is raster based

* 4 - True or False. Canvas comes with a built-in scene graph and display list
    * False

* 5 - True or False. raster-based graphics systems represent graphics as a rectangular grid of pixels
    * True

* 6 - List the 3 drawing state properties we used in this demo
    * fillStyle
    * strokeStyle
    * lineWidth

* 7 - List the 2 drawing state methods we used in this demo
    * fillRect
    * strokeRect

* 8 - Give 4 different ways to represent the color green as a color in the canvas API
    * rgb: `(0, 255, 0)`
    * rgba: `(0, 255, 0, 1)`
    * string: `"green"`
    * hex long: `"#00ff00"`
    * hex short: `"0f0"`

* 9 - Write the one line of code that will change the current fill color to green
    * `ctx.fillStyle = "green";`

* 10 - Write the one line of code that will fill a 100x100 rectangle at x=200, y=50
    * `ctx.fillRect(200, 50, 100, 100);`