---
---

The Mandelbrot set is one of the most well-known fractals in computer science and mathematics. It's a great example of how simple rules can lead to very complex behaviour. 

The Mandelbrot set is defined as follows. For an arbitrary $c\in\mathbb C$, consider the recurrence relation

$$
z_n=\begin{cases}
0& n=0\\
z_{n-1}^2+c&n>0.
\end{cases}
$$

Consider the limiting behaviour of $z_n$ as $n\to\infty$. For certain values of $c$, the iterates $z_n$ grow unbounded i.e. $\|z_n\|\to\infty$ as $n\to\infty$ e.g. if $c=1$ then the sequence $z_n$ looks like $0,1,2,5,26,677,\cdots$ which grows arbitrarily large. 

For other values of $c$, the iterates $z_n$ remain bounded, either because they fall into a cycle, or they move about chaotically but crucially they never exceed a certain distance from the origin. The simplest example of this is if $c=0$ in which case the sequence $z_n$ consists of all 0s.

The Mandelbrot set is defined as the set of $c\in\mathbb C$ such that the sequeunce $\|z_n\|$ remains bounded as $n\to\infty$. This is then plotted on the complex plane, with black denoting points inside the Mandelbrot set. Points outside the set are coloured based on how quickly or slowly $\|z_n\|$ diverges.

{% include image.html src="wikipedia-mandelbrot.jpg" caption="The Mandelbrot set (in black). [Image source](https://www.wikiwand.com/en/Mandelbrot_set)" %}

## Interactive Mandelbrot Set and Julia Set

{% include_relative mandelbrot-julia.html %}

{% capture controls %}

The left half of the canvas is the Mandelbrot set, and the right half is the corresponding Julia set. Whilst hovering the mouse over the canvas, use the following keyboard shortcuts.

| Keys       | Explanation                  |
| ---------- | ---------------------------- |
| W, A, S, D | Move                         |
| I, K       | Zoom in/out                  |
| J, L       | Rotate                       |
| Y, H       | Increase/decrease iterations |
| R          | Reset                        |

{% endcapture %}

{% include card.html content=controls title="Controls" %}