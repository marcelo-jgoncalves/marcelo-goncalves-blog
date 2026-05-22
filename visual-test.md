# Visual Test: Eyebrow Fade Effect Comparison

## Changes Made
- Increased eyebrow::before height from 1px to 2px temporarily
- This makes the line more visible for visual inspection

## Expected Behavior
With the thicker line, we should be able to see:
1. In ProjetoWidget (sidebar): The fade effect from white to transparent
2. In NewsletterWidget (footer): The same fade effect should be visible OR should show a solid white line if gradient is not applied

## Test on Live Page
- Navigate to: http://localhost:3000/post/[any-post-slug]
- Compare the Newsletter widget (in footer) vs Projeto widget (in sidebar)
- Take screenshots of both widgets

## What to Look For
- Is the eyebrow line visible in both widgets?
- Is the fade effect visible in both?
- Are the lines the same thickness?
- Is there any difference in appearance despite CSS being identical?
