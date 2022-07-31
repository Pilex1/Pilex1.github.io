---
---

Here we discuss a classic cellular automaton called Conway's Game of Life and present some generalizations. Conway's [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is played on a 2D square-tiled grid. Each grid square is called a cell and
is either dead (black) or alive (white). After each successive iteration, the following rules are
applied to all cells simultaneously:

- If an alive cell has exactly 2 or 3 alive neighbours it remains alive. Otherwise it dies.
- If a dead cell has exactly 3 alive neighbours it resurrects to life. Otherwise it remains dead.

In Game of Life, a cell's neighbours are defined as the eight cells surrounding it. This is known as the Moore neighbourhood.

{% include image.html src="moore.svg" caption="Moore neibourhood on a 2D square grid. [Image Source](https://en.wikipedia.org/wiki/Moore_neighborhood)" width=300 %}

Below is an implementation of Game of Life. Click on a cell to toggle its state between dead and alive, and click the "Iterate" button to perform an iteration.

{% include_relative life-square.html %}

A more general Game of Life can be specified using the options on the side.

The checkboxes under "Keep Alive" specify the number of alive neighbours required for an alive cell to remain alive. For example, with checkboxes 2 and 3 selected (the default), an alive cell must have exactly either 2 or 3 alive neighbours to remain alive.

Similarly, the checkboxes under "Resurrect" specify the number of alive neighbours required for a dead cell to be resurrected. For example, with only checkbox 3 selected (the default), a dead cell must have exactly 3 alive neighbours to be resurrected.
          
Another common neighbourhood for square grids is the [Von Neumann]("https://en.wikipedia.org/wiki/Von_Neumann_neighborhood") neighbourhood.  Here, a cell's neighbours are defined as the four cells directly adjacent to it (i.e. excluding the diagonal cells). The radio buttons under "Neighbourhood Type" allow you to choose which neighbourhood to use.

{% include image.html src="neumann.svg" caption="Von Neumann neibourhood on a 2D square grid. [Image Source](https://commons.wikimedia.org/wiki/File:Von_neumann_neighborhood.svg)" width=300 %}

## Triangle Life

Here, instead of a square-tiled grid, we consider triangle tilings. We can generalize the notions of
the Moore and Von Neumann neighbourhoods to non-square grids as follows:

- We define a cell's Moore neighbourhood to be the set of cells sharing at least a common point
    with the given cell.
- We define a cell's Von Neumann neighbourhood to be the set of cells sharing at least a common
    edge with the given cell.

For the case of square-tiled grids, this definition is consistent with the previous definition.
However, we can now talk about Moore and Von Neumann neighbourhoods in arbitrary tilings. In the
case of triangle tilings, the Moore neighbourhood of a cell consists of 12 cells, and the Von
Neumann consists of 3.

We apply the same rules as we did for square-tiled Game of Life, but now with triangular tilings.
Again, the checkboxes under "Keep Alive" specify the number of alive neighbours required for an
alive cell to remain alive. The checkboxes under "Resurrect" specify the number of alive neighbours
required for a dead cell to be resurrected.

<!-- Since each cell
now has at most 3 neighbours, we modify the original rules as follows:
<ol>
    <li>
        If an alive cell has exactly 1 or 2 alive neighbours it remains alive. <br>
        Otherwise it dies.
    </li>
    <li>
        If a dead cell has exactly 2 alive neighbours it resurrects to life.<br>Otherwise it remains
        dead.
    </li>
</ol> -->

{% include_relative life-triangle.html %}

## Hex Life

In this variant, we use hexagon tilings. Here, Von Neumann and Moore neighbourhoods are the same, both describing the six cells surrounding a given cell.

{% include_relative life-hexagon.html %}

## References

Bays C. (2009) Cellular Automata in Triangular, Pentagonal and Hexagonal Tessellations. In: Meyers R. (eds) Encyclopedia of Complexity and Systems Science. Springer, New York, NY. [https://doi.org/10.1007/978-0-387-30440-3_58](https://doi.org/10.1007/978-0-387-30440-3_58)