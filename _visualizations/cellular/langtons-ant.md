---
---

Langton's Ant is another cellular automaton. Like Game of Life, there is an infinite 2D grid, with each cell in the grid being either white or black. However, instead of updating each cell based on the number of neighbouring cells, in Langton's Ant we imagine an "ant" present on an arbitrary cell which moves according to the following rules:

1. if the ant is on a white square, flip the colour of the square, turn 90 degrees clockwise (i.e. turn right), and move forward one cell
2. if the ant is on a black square, flip the colour of the square, turn 90 degrees counterclockwise (i.e. turn left), and move forward one cell

{% include image.html src="LangtonsAntAnimated.gif" caption="First 200 iterations of Langton's Ant starting on a grid of all white. [Image source](https://www.wikiwand.com/en/Langton%27s_ant)." %}

What's interesting is that for the first few hundred iterations, the ant creates simple patterns that are often symmetric, as seen above. However, the pattern soon becomes highly irregular and the ant moves pseudo-randomly. Finally, at around 10,000 iterations, the ant starts building a recurrent "highway" pattern indefinitely.

{% include image.html src="langtons-ant-11000.png" caption="Langton's ant after 11,000 iterations. A red pixel shows the ant's location. [Image source](https://www.wikiwand.com/en/Langton%27s_ant)." width=300 height=300 %}

## Multiple colours

One way to extend Langton's Ant is to allow a cell to take on more than two colours. For example, suppose a cell can be in one of four colours, which for simplicity I denote as 0, 1, 2, 3. Imagine the ant moves according to the following rules

1. if the ant is on a cell with colour 0, change it to colour 1, turn 90 degrees clockwise (i.e. turn **right**), and move forward one cell
2. if the ant is on a cell with colour 1, change it to colour 2, turn 90 degrees counterclockwise (i.e. turn **left**), and move forward one cell
3. if the ant is on a cell with colour 2, change it to colour 3, turn 90 degrees counterclockwise (i.e. turn **left**), and move forward one cell
4. if the ant is on a cell with colour 3, change it to colour 0, turn 90 degrees clockwise (i.e. turn **right**), and move forward one cell.

This particular ruleset can be identified with the code $RLLR$. 

Explicitly, whenever an ant is on a cell with colour $i$, change it to colour $(i+1)\mod n$ where $n$ is the total number of colours. The ant then turns 90 degrees clockwise (i.e. turns right) if the $i$th character in the code is $R$, or turns 90 degrees anticlockwise (i.e. turns left) if the character is $L$. Finally the ant moves forward one cell.

Thus, the original ant has rule RL if we let white denote colour 0 and black denote colour 1, since the ant turns right on colour 0 (white) and tuns left on colour 1 (black).

I wrote a program that runs Langton's Ant and has support for custom rulesets describe above. To play around with the program and for the full source code, refer to [my Github project](https://github.com/Pilex1/Langtons-Ant). Below, I demonstrate approximately 100,000 iterations of the RLLR rule described above using my program. Colour 0 is white, and colour 3 is black. Colours 1 and 2 are shades of grey in between.

{% include video.html src="ant rllr.mp4" type="mp4" attr="muted" caption="Rule RLLR for ~100,000 iterations." %}

RLLR is a rather special ruleset in that the pattern it generates is symmetric. Other rulesets such as RLR are a lot more chaotic. For further details about this, refer to [1].

## Multiple ants

Another simple way to extend Langton's Ant is to consider multiple ants on the same grid, each following the same rule. For example, below I have two ants following the original RL rule.

{% include video.html src="two ants loop.mp4" type="mp4" attr="muted" caption="Two LR ants in a cycle." %}

Interestingly, at some point after the two ants meet, they begin to run "backwards", undoing the pattern until the grid is left completely white then continuing to run in reverse producing an "inverse" image. This continues up until the same corresponding point but in the "inverse" image, where again the ants are reversed and run "forwards" again. This undoes the "inverse" image until the grid is left completely white and the ants proceed on as if from the very start, hence creating a cycle.

However, if the two ants start sufficiently far away from each other, a highway can form before the two ants are able to reach that critical reversal stage.

{% include video.html src="two ants diverge.mp4" type="mp4" attr="muted" caption="Two LR ants interacting but then forming separate highways." %}

### Toroidal grid

In order to further investigate the behaviour of the highway forming ant pairs, we now allow ants to wrap back around the other side of the grid once an ant reaches the boundary. Under this rule, it appears that all ant pairs, regardless of initial configuration, will eventually exhibit this reversing behaviour described above (though it may take a very large number of cycles).

{% include video.html src="two ants torus highway.mp4" type="mp4" attr="muted" caption="Two LR ants on a toroidal grid in a cycle." %}

Note that this appears to work only for the RL (and also LR, by symmetry) ruleset. It doesn't appear to work for other rulesets.

## Image encryption

Despite this reversal phonomenon not appearing for pairs of ants in other rulesets, we can force an ant to run in reverse if we modify the ruleset so that the rules are reversed. For example, consider the $RLR$ ruleset, which, explicitly, describe the following rules

1. if the ant is on a cell with colour 0, change it to colour 1, turn right, and move forward one cell
2. if the ant is on a cell with colour 1, change it to colour 2, turn left, and move forward one cell
3. if the ant is on a cell with colour 2, change it to colour 0, turn right, and move forward one cell

We can reverse the behaviour of the ant if it instead follows the following rules

1. move backward one cell, if the ant is now on a cell with colour 1, change it to colour 0, and turn *left*
2. move backward one cell, if the ant is now on a cell with colour 2, change it to colour 1, and turn *right*
3. move backward one cell, if the ant is now on a cell with colour 0, change it to colour 2, and turn *left*

Now, if we let an ant of any ruleset run long enough on a toroidal grid, it appears that the grid always becomes completely chaotic. 

{% include video.html src="ant chaos.mp4" type="mp4" attr="muted" caption="Long term evolution of an LRL ant in a toroidal grid." %}

However, starting at one of these chaotic looking grid configurations, we can run the ant in reverse and eventually recover a completely empty grid which is pretty cool. This gave me an idea to use this for image encryption! Suppose we have a black and white image, with each pixel having an integer value between 0 and 255. Devise up a rule of length 256 and set the initial grid configuration to be the *pixels of the image*. Run an ant forwards until the image looks sufficiently random. That's the encrypted image!

Without the ruleset and the final position of the ant (and to a lesser extent, the number of iterations) it would be pretty hard to figure out what the original image is. But if you have the ruleset, the final position of the ant, and the number of iterations, you can run the ant backwards and recover the original image!

This is exactly what I demonstrate below. The ruleset here is set to $LRLRLR\cdots$ 256 characters long.

{% include youtube-video.html src="https://www.youtube.com/embed/W9aLjrx5CuE" %}

Just as a side note, there is a slight technicality here. In typical colour space, a value of 0 would correspond to black, and 255 would correspond to white. In our colouring scehem it's reversed; 0 corresponds to white and 255 corresponds to black. You need to take care of this in the implementation details otherwise the image colours would appear inverted.

Anyways, this is definitely not the most practical way to do encryption and decryption as it takes a long time just to do the encryption and decryption process. Nonetheless I think it is pretty cool how, given a random looking encrypted image, the ant is able to slowly reconstruct the original image.

## References

[1] Gale, David, et al. "Further travels with my ant." arXiv preprint math/9501233 (1995).