## Island Fun
Just a fun side project 

To run it, do `npm run start`

### Interactive Info
Click the left mouse button to get a text hover that says what region the mouse is in 
and shows the player and lets you move it with:
- W
- A
- S
- D
> You can't currently move on water on purpose, to test bounds

For these next ones, make sure the live updating is set to off:
> You can make sure text hover and player isn't visible by left clicking again if it's on
- Key 1: Show voronoi diagram of the entire map
- Key 2: Show voronoi diagram of the Beach region
- Key 3: Show voronoi diagram of the Shallow Greenery region
- Key 4: Show voronoi diagram of the Dense Greenery region
- Key 5: Show voronoi diagram of the Grove region


### TODO
- Generate stuff with voronoi
  - Trees
  - Rocks
  - Ruins?
- Maybe do a moisture/heatmap
- Make roads
- Spawn in some interesting stuff
- Expand the Graph system to make nodes contain the entire entity
  - Currently entities only occupy the core node, irregardless of their size
    - I already thought of a way to do it
      - WIth this system, collision will be Graph-based instead of collision shape based
