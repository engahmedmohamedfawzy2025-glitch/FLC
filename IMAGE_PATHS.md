# Image Upload Paths

## Where to put images in the project

All static images go in the `public/` folder. The path you use in the admin panel is relative to `public/`.

### Folder structure

```
public/
├── logo.svg              ← main logo
├── favicon.svg           ← browser tab icon
├── og-image.jpg          ← social sharing preview image
├── images/
│   ├── products/         ← product images
│   │   ├── nova-cloud.jpg
│   │   ├── nova-ai.jpg
│   │   └── novashield.jpg
│   ├── solutions/        ← solution images
│   │   ├── cloud.jpg
│   │   ├── cybersecurity.jpg
│   │   └── ai-data.jpg
│   ├── services/         ← service images
│   │   ├── consulting.jpg
│   │   └── implementation.jpg
│   ├── projects/         ← project images
│   │   ├── bank-migration.jpg
│   │   └── smart-city.jpg
│   ├── news/             ← news article featured images
│   │   ├── ai-launch.jpg
│   │   └── partnership.jpg
│   ├── clients/          ← client logos
│   │   ├── national-bank.png
│   │   └── saudi-energy.png
│   ├── team/             ← team member photos
│   └── general/          ← any other images
```

### How to reference images in the admin panel

When you add or edit content in the admin panel, use paths that start with `/` (forward slash), which maps to the `public/` folder:

| Image type | Path in admin panel | File location on disk |
|-----------|---------------------|----------------------|
| Product image | `/images/products/nova-cloud.jpg` | `public/images/products/nova-cloud.jpg` |
| Solution image | `/images/solutions/cloud.jpg` | `public/images/solutions/cloud.jpg` |
| Service image | `/images/services/consulting.jpg` | `public/images/services/consulting.jpg` |
| Project image | `/images/projects/bank-migration.jpg` | `public/images/projects/bank-migration.jpg` |
| News featured image | `/images/news/ai-launch.jpg` | `public/images/news/ai-launch.jpg` |
| Client logo | `/images/clients/national-bank.png` | `public/images/clients/national-bank.png` |
| Site logo | `/logo.svg` | `public/logo.svg` |
| Favicon | `/favicon.svg` | `public/favicon.svg` |
| Social sharing image | `/og-image.jpg` | `public/og-image.jpg` |

### Supported formats

`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`

### Naming conventions

- Use lowercase letters only
- Use hyphens (not spaces): `my-image.jpg` not `my image.jpg`
- Use descriptive names: `nova-cloud-platform.jpg` not `img1.jpg`

### Using external URLs

You can also use external image URLs (e.g., from Pexels, Unsplash, or a CDN) directly in the admin panel. Just paste the full URL:
- `https://images.pexels.com/photos/12345/photo.jpg`
- `https://your-cdn.com/images/product.jpg`

### Logo path in admin (Website Identity page)

| Field | Path |
|-------|------|
| Primary Logo | `/logo.svg` |
| Dark Background Logo | `/logo-dark.svg` |
| Favicon | `/favicon.svg` |
| Apple Touch Icon | `/apple-touch-icon.png` |
| Social Sharing Image | `/og-image.jpg` |

Put these files directly in the `public/` folder (not in a subfolder).
