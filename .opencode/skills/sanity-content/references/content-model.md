# Content model map

Current state of `src/sanity/schemaTypes/index.ts`. Update this file when the model changes.

## Singletons

Document `_id` equals the type name. Sidebar entries live in `src/sanity/structure.ts`.

| Type | ID | Fields | Read by |
| --- | --- | --- | --- |
| `navigation` | `navigation` | `title`, `navItems[]{label,href}` | `getNavigation` (**not consumed**) |
| `footer` | `footer` | `copyright`, `socialLinks[]{platform,url}` | `getFooter` → `Footer.tsx` |
| `aboutPage` | `aboutPage` | `heroImage`, `aboutTitle`, `aboutBody`, `servicesTitle`, `servicesBody`, `approachTitle`, `approachParagraphs[]` | `getAboutPage` |
| `architecturePage` | `architecturePage` | `pageTitle`, `projects[]{title,slug,mainImage{alt},images[]{alt},content}` | `getProjects.ts` |
| `interiorsPage` | `interiorsPage` | `pageTitle`, `projects[]{title,category,images[hotspot],description,location}` | `getInteriorsPage` |
| `peoplePage` | `peoplePage` | `pageTitle`, `intro`, `team[]{name,role,bio,image{alt}}` | `getPeoplePage` |
| `contactPage` | `contactPage` | `pageTitle`, `intro`, `bannerImage{alt}`, `address`, `email`, `phone`, `mapEmbedUrl` | `getContactPage` |

## Multi-document

| Type | Fields | Read by |
| --- | --- | --- |
| `newsPost` | `title` (required), `content` (plain text) | `getNewsPosts` → `/news` |

## Gotchas

- `architecturePage.projects[]` and `interiorsPage.projects[]` are inline objects, not
  references. Editing one project means patching the whole `projects` array (this is why
  the write scripts spread `nextProjects`).
- `architecturePage.projects[].content` is Portable Text; `projects[].description` does not
  exist, so the current detail page's `project.description` block never renders.
- `interiorsPage.projects[].images` has no `alt` field in the schema, so the page's
  `image.alt ?? project.title` fallback is what users see. Add `alt` to the image object
  before relying on editor-provided alt text.
- `newsPost.content` is a `text` field, not Portable Text. Do not pass it to `<PortableText>`.
- `src/actions/getArchitecturePage.ts` is an orphaned duplicate schema (with a `categories[]`
  shape) and is not imported anywhere. Ignore or delete it; do not build on it.
- Singleton queries use both type and `_id`; keep that pattern so a stray duplicate document
  cannot silently win.

## Where types are declared

Each action file exports its own result types (`AboutPageData`, `InteriorsPageData`,
`ProjectCard`, `ProjectDetail`, ...). There is no generated schema type file — if you add
`sanity typegen`, replace the hand-written types rather than layering both.
