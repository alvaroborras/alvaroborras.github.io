# Álvaro Borrás's personal website

Live site: https://alvaroborras.github.io/

A static personal site with the dark palette, serif typography, terminal-style labels, project grid, train motif, and retro computer format requested from https://adolfoviguera.com/. The markup, CSS, and illustrations were written for this site. No framework, build step, paid server, tracking, or external runtime requests.

## Edit and preview

Edit `index.html` for your biography, links, milestones, and projects. Edit `style.css` for the design. `script.js` handles the theme toggle and project filters. Content remains readable without JavaScript.

```sh
python3 -m http.server 8080 --bind 127.0.0.1
# Open http://localhost:8080
node test.mjs
```

GitHub Pages publishes the repository's `main` branch at `/`. Push edits to publish them.

## Content sources

Only public information was used:

- https://github.com/alvaroborras/alvaroborras for the bio, location, and current interests.
- https://github.com/alvaroborras for the public contact email and avatar.
- The linked repositories' READMEs for project descriptions and claims.
- Repository creation dates for the selected project milestones.

The path section contains project milestones, not an invented employment or education history. The off-the-clock section contains public interests, not assumed personal hobbies. Replace these with your CV and hobbies if you want those sections to be more personal. The displayed name is inferred from your GitHub username; confirm your preferred spelling. The portrait is your GitHub avatar, not a borrowed photo.

Fonts are self-hosted Instrument Serif and IBM Plex Sans/Mono, distributed under the SIL Open Font License. License texts are in `assets/`.

## Hosting and domain costs

Hosting on GitHub Pages with HTTPS costs $0. No SSH machine or Cloudflare subscription is needed. The free `alvaroborras.github.io` address works without buying a domain.

Registry checks on 2026-10-04:

| Domain | Registry response |
| --- | --- |
| `alvarob.com` | Registered, not available for ordinary registration |
| `alvbf.dev` | RDAP 404, no registration found |
| `alvaroborras.com` | RDAP 404, no registration found |
| `alvaroborras.dev` | RDAP 404, no registration found |
| `alvbf.com` | RDAP 404, no registration found |

RDAP absence is not a registrar availability or price guarantee. A domain can be reserved or premium. Confirm availability and both registration and renewal prices at checkout. Budget roughly US$10–15/year plus applicable tax for a standard-priced `.com` or `.dev`; this is an estimate, not a live quote. `alvbf.dev` matches your short-name preference; `alvaroborras.com` spells out your name.

Cloudflare Registrar charges registry/ICANN costs without a markup: https://developers.cloudflare.com/registrar/. Compare renewal costs rather than first-year promotions. No domain has been purchased.

## Add a custom domain later

1. Register the chosen domain. Keep hosting on GitHub Pages.
2. In the repository's Settings → Pages, add the custom domain. Verify domain ownership through your account's Pages settings before changing DNS.
3. For an apex domain, add the GitHub Pages A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Add `www` as a CNAME to `alvaroborras.github.io`, without a path.
4. With Cloudflare DNS, use DNS-only records while GitHub verifies DNS and provisions HTTPS. Enable Enforce HTTPS after the certificate is ready.
5. Pages creates a `CNAME` file when configured in Settings. Pull it into your local checkout before your next edit.

Official setup: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
