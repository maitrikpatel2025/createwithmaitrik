# Playbook Creation Guide

## The Flow: Idea → Script → Record → Publish

### Step 1: Create the Playbook in Admin

Go to **`/cwm-admin` → Collections → Playbooks → Create New**

Fill in the **Content** tab first:

| Field | What to enter |
|-------|--------------|
| **Title** | e.g. "Freepik + Nano Banana Pro: The Character-Consistent AI Ad Stack" |
| **Slug** | Auto-fills from title. e.g. `freepik-nano-banana-pro-character-consistent-ai-ad-stack` |
| **Status** | Set to `draft` while writing. Flip to `published` when ready. |
| **Featured** | Check this to show on homepage (max 3 featured at a time). |
| **Summary** | 1-2 sentence hook. Shows on the card and in SEO description. |
| **Body** | Your full playbook in **Markdown** (see format below). |

---

### Step 2: Write the Body in Markdown

The `body` field accepts standard Markdown. Write it in any editor you want (VS Code, Notion, Claude) and paste it in.

#### Markdown Cheatsheet

```markdown
## Section Heading

Regular paragraph text here. **Bold** for emphasis.

### Sub-heading

- Bullet point one
- Bullet point two

> Blockquote — use for key takeaways or callouts

1. Numbered step one
2. Numbered step two

`inline code` for tool names, prompt snippets

[IMAGE-1]

The image above shows the Freepik workspace with...
```

#### Image References

Use `[IMAGE-1]`, `[IMAGE-2]`, etc. as placeholders in your Markdown body. These markers get replaced with actual images you upload in the **Media** tab.

**Example body:**

```markdown
## Step 1: Set Up the Character Sheet

Open Freepik AI Image Generator and create your base character.

[IMAGE-1]

Use these prompt settings:
- Style: Photorealistic
- Aspect: 4:5
- Seed: Lock it after your first good generation

## Step 2: Generate Variations

Now run the same character in different poses.

[IMAGE-2]

> Pro tip: Keep the seed locked. Change only the action/pose in the prompt.

## Step 3: Edit in CapCut

Import all frames and set your timeline.

[IMAGE-3]
```

---

### Step 3: Upload Images

Go to the **Media** tab in the playbook editor:

1. Under **Cover Image** — upload the hero image for the card thumbnail (16:10 ratio works best, or any landscape image)
2. Under **Images** — click "Add item" for each `[IMAGE-N]` marker:
   - **Placeholder**: Type `IMAGE-1` (matches `[IMAGE-1]` in body)
   - **Image**: Upload the screenshot/image file
   - Repeat for `IMAGE-2`, `IMAGE-3`, etc.
3. Under **PDF** — upload the PDF version (this is email-gated; users enter their email to download)

**Image file tips:**
- Use `.png` for screenshots with text (sharp)
- Use `.jpg` for photos and renders (smaller file)
- Recommended: 1200px+ wide for clarity
- Max upload: 50MB per file

---

### Step 4: Fill in Details

Go to the **Details** tab:

| Field | Example |
|-------|---------|
| **AI Tool** | Pick the primary tool: Midjourney, Claude, ChatGPT, Freepik, Runway, etc. If multiple, pick `Multi-Tool` |
| **Topic** | Pick one: `AI Ads`, `AI Agents`, or `Built in Public` |
| **Read Time** | e.g. "8 min" — estimate from word count (~250 words/min) |
| **Published Date** | Set to today or your target publish date |

---

### Step 5: SEO (Optional)

Go to the **SEO** tab:

| Field | Guidance |
|-------|----------|
| **SEO Title** | Custom title for Google (60 chars max). Leave blank to use the playbook title. |
| **SEO Description** | 150 chars max. If blank, uses the Summary field. |

---

### Step 6: Publish

1. Go back to the **Content** tab
2. Change **Status** from `draft` to `published`
3. Click **Save**
4. Your playbook is now live at `/playbooks/your-slug`

---

## Full Workflow: Content → Playbook

Here's the end-to-end flow for creating a new piece of content:

```
1. IDEATE
   └── Pick a workflow you've actually done
   └── What tool? What outcome? What's the receipt?

2. SCRIPT
   └── Write the outline (3-5 sections)
   └── Draft in Claude or your editor
   └── Include exact prompts, settings, screenshots

3. CAPTURE
   └── Take screenshots at each step
   └── Name them: step-1-freepik-setup.png, step-2-generation.png, etc.
   └── Export the PDF version

4. ADMIN
   └── /cwm-admin → Playbooks → Create
   └── Paste Markdown body with [IMAGE-N] markers
   └── Upload cover + inline images + PDF
   └── Fill Details tab (tool, topic, read time)
   └── Set status = published → Save

5. PROMOTE
   └── The playbook auto-appears on /playbooks
   └── If featured=true, shows on homepage
   └── Share the URL: maitrikpatel.io/playbooks/your-slug
```

---

## File Naming Convention

```
playbooks/
├── freepik-character-sheet/
│   ├── step-1-setup.png
│   ├── step-2-generation.png
│   ├── step-3-capcut-edit.png
│   ├── cover.png
│   └── playbook.pdf
├── claude-agent-build/
│   ├── step-1-architecture.png
│   ├── step-2-multi-agent.png
│   ├── cover.png
│   └── playbook.pdf
```

You don't need to follow this on disk — all files get uploaded through the admin. But if you want to organize your source files locally before uploading, this structure keeps things clean.

---

## Quick Reference

| What | Where | Format |
|------|-------|--------|
| Playbook body | Admin → Playbooks → Content → Body | Markdown with `[IMAGE-N]` markers |
| Inline images | Admin → Playbooks → Media → Images array | PNG/JPG, placeholder = `IMAGE-1` |
| Cover image | Admin → Playbooks → Media → Cover Image | 16:10 landscape |
| PDF download | Admin → Playbooks → Media → PDF | PDF file, email-gated |
| AI tool tag | Admin → Playbooks → Details → AI Tool | Select from dropdown |
| Topic | Admin → Playbooks → Details → Topic | AI Ads / AI Agents / Built in Public |
| Publish | Admin → Playbooks → Content → Status | draft → published |
