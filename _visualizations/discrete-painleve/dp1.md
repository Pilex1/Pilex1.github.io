---
import: three,plotly
---

The first discrete Painlevé equation is the recurrence equation

$$
w_n(w_{n+1}+w_n+w_{n-1})=\alpha n +\beta +\gamma w_n
$$

with $\alpha,\beta,\gamma\in\mathbb C$ constants.

Given initial conditions $w_0,w_1\in\mathbb C$ we can generate a sequence of numbers $(w_n)_{n\in\mathbb{N}}\in\mathbb C$ using the above recurrence equation. Each iterate of the sequence $w_n$ is assigned a colour based
on its order within the sequence (i.e. based on $n$). The colours are, in increasing $n$: red, orange, yellow,
green, blue, purple, and back to red (specifically they're mapped using the hue component of the [HSL colour model](https://en.wikipedia.org/wiki/HSL_and_HSV).

For visualization, the iterates $w_n$ are [stereographically projected]("https://en.wikipedia.org/wiki/Stereographic_projection") onto the unit sphere.

{% include_relative dp1-app.html %}

{% include components/stereographic-visualizer-ui.html %}

The graph above shows a plot of plot $\|w_n\|$ (the complex magnitude of $w_n$) as a function of $n$.