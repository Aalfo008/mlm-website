# Muslim Leadership Media — Website

The new **muslimleadershipmedia.org**: a fast, mobile-friendly site with a built-in **Academy** (courses, lessons, videos, quizzes, progress tracking), blog, events and team pages — all editable through a free visual admin panel. No coding needed after setup.

---

## 1. Put it on GitHub (one time, ~10 minutes)

1. Create a **Public** repository on github.com (e.g. `mlm-website`), without a README.
2. Click **uploading an existing file**, drag in **everything inside this folder**, and **Commit changes**.
3. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick **main** and **/(root)**, and **Save**.
4. After about a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

There's no build step: the pages read the files in `content/` directly, so any change you save is live within a minute.

## 2. Connect muslimleadershipmedia.org

1. In **Settings → Pages → Custom domain**, enter `muslimleadershipmedia.org` and **Save**.
2. Where your domain is managed (Squarespace Domains, GoDaddy, Namecheap…), open **DNS settings** and:
   - Delete the existing Squarespace `A` / `CNAME` records for `@` and `www`.
   - Add four **A** records for host `@`:
     `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`
   - Add a **CNAME** record for host `www` pointing to `<your-username>.github.io`
3. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** in Settings → Pages.
4. Only cancel the Squarespace website plan once the new site loads on your domain (keep the domain itself registered!).


## 3. Turn on the admin panel (Pages CMS — free)

1. GitHub's uploader skips files whose name starts with a dot, so create the editor's settings file by hand once: in the repository click **Add file → Create new file**, name it exactly `.pages.yml`, paste in the contents of `pages.yml` (sent alongside this folder), and **Commit changes**.
2. Go to **https://app.pagescms.org** and **Sign in with GitHub**.
3. Allow it access to the `mlm-website` repository.
4. Open the repository. You'll see a menu with **Academy → Courses / Lessons**, **Blog posts**, **Events**, **Team**, **Home page** and **Site settings**.
5. Edit anything and press **Save**. Changes are live about a minute later.

Add teammates under **Collaborators** in Pages CMS (they can sign in with just an email — no GitHub account needed).

### Common tasks

| I want to… | In Pages CMS |
|---|---|
| **Add a lesson** | **Academy** → open the course → **Lessons → Add**. Give it a title, paste a YouTube/Vimeo/Google Drive link in **Video link**, write the notes. Save. |
| **Add a course** | **Academy → Courses → Add**. Untick *Show on website* while you prepare it; tick it to publish. |
| Reorder lessons or courses | Drag them up or down in the list. |
| Group lessons into sections | Give them the same **Module / section** text. |
| Add a quiz | In a lesson, **Quiz questions → Add**; list the choices and enter the number of the correct one. |
| Hide something temporarily | Untick **Show on website**. |
| Post a blog article / event | **Blog posts → Add** · **Events → Add**. Past events move to "Past events" automatically. |
| Show an announcement | Site settings → **Announcement bar text** (leave empty to hide). |
| Turn on online donations | Create a free donation page (e.g. Zeffy, Givebutter, LaunchGood) and paste its link in Site settings → **Donation page link**. |
| Make contact/newsletter forms deliver to your inbox | Create free forms at **formspree.io** and paste the endpoints in Site settings. Until then, forms open the visitor's email app addressed to you. |
| Upload images | Any image field → upload. Files are stored in `assets/uploads/`. |

## How it works (for whoever maintains it)

```
content/               ← everything editors change (the CMS writes here)
  academy.json         all courses, each with its lessons (notes in Markdown)
  posts.json           blog articles
  events.json  team.json  home.json  settings.json
assets/                styles, scripts, logos, uploads
*.html                 page layouts (read content/ in the browser)
.pages.yml             admin panel configuration
```

Lesson videos aren't stored on GitHub — host them on YouTube (unlisted is fine), Vimeo or Google Drive and paste the link. Learner progress is saved in each visitor's own browser (no accounts or logins needed).

**Preview on your computer:** in this folder run `python3 -m http.server 8080` and open http://localhost:8080 (opening the .html files directly won't load content).
