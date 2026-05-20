# Color Blocks

Add colorful comment ranges that span multiple lines. This makes it easier to understand what lines a comment refers to and can thus be used to group and organize your code. It also makes it easier for you to find your way in long spaghetti code.

![feature X](/media/basic_example.png)

---

## Features & Settings

### Syntax

This extension will look for curly brackets inside comments containing at least a hex color argument. Example:

```
# MyColorBlock {#f9e, 4}
|       |         |   |
|       |         |   |-> number of lines (optional)
|       |         |
|       |         |-> hex color 3 or 6 characters
|       |
|       |-> text annotation
|
|-> comment character (here for Python)
```


### Sample usage

Color blocks work with both line comments and block comments. All lines in the comment will be part of the color block. If no number is specified after the hex color argument, then the color range will also capture any lines until an empty line.

![block comment example](/media/block_comments_example.png)

### Three different ways to add color blocks.

* **Manually**  
  By typing `# MyColorBlock {#f9e, 4}` for example.

* **Snippet**  
  By start writing `color block` and selecting it from the context menu suggestions.

* **Command**
  By pressing <kbd>CTRL</kbd>+<kbd>C</kbd> <kbd>CTRL</kbd>+<kbd>B</kbd> in succession (similar to the default command for toggling line comments).

  Alternatively by selecting "Add Color Block" from the command palette (<kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd>).

![feature X](/media/how_to_add_blocks.gif)

**Note:** The above video is slightly outdated.

### Wrapping

![feature X](/media/wrapping.gif)

**Note:** The above video is slightly outdated.


### Styling

![feature X](/media/style_settings.gif)

**Note:** The above video is slightly outdated.

### Set Color By Name
You can set colors by name in v2.0 of Color Blocks, the syntax looks like this `# Your Comment Here {silver,3}`.
For a list of valid color names, see this: https://drafts.csswg.org/css-color/#named-colors

### Section Blocks
Instead of a line count, you can give the second argument as a quoted string. The color block then runs from the current comment until (but not including) the next comment whose text contains that string — so headers stay in sync as you edit the section.

```
# Section 1 ---- {#abd, 'Section 2'}
... section 1 code, blank lines OK ...

# Section 2 ----
```

* Matching is **case-sensitive substring**, so `'Section 2'` matches `# Section 2 ----` but not `# section 2`.
* Single or double quotes are accepted: `{#abd, "Section 2"}`.
* An optional `until:` keyword reads nicely: `{#abd, until: 'Section 2'}`.
* If no later comment matches, the block falls back to the default behaviour (extending until the next empty line).

---

## Inspired by

* [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
* [Blockman](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)
* [HiLight](https://marketplace.visualstudio.com/items?itemName=f0lio.hilight)

GIFs were produced using [Gifski](https://gif.ski/).
