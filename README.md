# Little Fish

Static splash page. Styles are SCSS, compiled to `css/main.css` by Sass.

## Run locally

```sh
npm install        # first time only
npm run dev        # http://localhost:3000, recompiles SCSS and live-reloads on save
```

## Structure

```
index.html          page markup
scss/_colors.scss   Figma color variables: primitives + Light/Dark/Tan themes
scss/_tokens.scss   fonts + page gutter (5vw)
scss/_fluid.scss    fluid() sizing from the 1440px Figma frame
scss/_base.scss     reset + global defaults
scss/_typography.scss  Figma text styles as mixins
scss/_layout.scss   page background, header, hero
scss/_section-heading.scss  Figma "Eyebrow" + "Section Heading" components
scss/_about.scss    About section
scss/_cork-art.scss Cork drop / splash / bob animation
scss/_motion.scss   scroll rise-in + hero parallax
scss/_button.scss   Figma "Button" component
scss/_field.scss    Figma "Input" component
scss/_footer.scss   Figma "Footer" component
scss/main.scss      entry point
css/main.css        compiled output (do not edit)
js/main.js          signup form handling
assets/images/      logo, favicon, og-image, artwork
assets/fonts/       self-hosted fonts
```

## Claude Code

Ask Claude to "run the site" and it starts the server and opens the page (see `.claude/skills/run-site/SKILL.md`).

## Colors

Use semantic tokens in components (`var(--text-title)`, `var(--surface-background)`, ...).
They switch with the theme: `<html data-theme="dark">` (`light` is the default, `tan` also available).
Raw palette values are available as `var(--color-marine-base)` etc., or `primitive('marine', base)` in Sass.
