#Debt Service Coverage Ratio#
This Calculator is meant to project the Debt Service Coverage Ratio for five years from the initial values.

There are four key areas, "Debt", "Revenue", "Instantaeous DSCR", and "Projected DSCR". The first two are input areas, and the second two are display.

Everything updates in near realtime (there's a bit of a delay on the jQuery animation for the bar graph, but don't button mash, and you'll be ok).

Both graphs also highlight the target area minimum standard most banks look for (between 1.15 and 1.35). Depending on the bank, the minimum standard is generally in the green area.

##Debt##
The debt section has four areas, two for fixed debt and two for LOC's. Right now there's no logic to capture early paydown and reduce future debt load, but this is v0.01. More will be added as time allows.


##Revenue##
Revenue takes into account gross sales and operating margin with a simple linear growth rate for each. 

##Instanteous DSCR##
Instanteous DSCR is expressed numericaly and as a pure HTML/CSS bar graph.


##Projected DSCR##
Projected DSCR is a graph of the calculated debt service coverage ratio from the current starting point and five years forward.


###SVG Line Graph###
d3 and jQuery were used to render the graph. Rickshaw is included in the build, but not implemented.


###Data Table###
Because some people need numbers instead of pictures. Cover that part up if you're presenting to an MBA.