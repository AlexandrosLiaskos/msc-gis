# NKUA MSc in GIS Website (ΠΜΣ «Γεωγραφικά Συστήματα Πληροφοριών»)

## Architecture & Hosting
- **Live Domains**:
  - English: <https://gis.geol.uoa.gr/>
  - Greek: <https://gis-el.geol.uoa.gr/>
- **CMS / Host**: University of Athens (NKUA) Department of Geology TYPO3 CMS.
- **Local Source**: `C:\Users\alexl\OneDrive - National and Kapodistrian University of Athens\Ιστιοσελλίδες\ΠΜΣ Γεωγραφικά Συστήματα Πληροφοριών\codebase` (Institutional folder on OneDrive).
- **Official Update Guide**: `C:\Users\alexl\OneDrive - National and Kapodistrian University of Athens\Ιστιοσελλίδες\ΠΜΣ Γεωγραφικά Συστήματα Πληροφοριών\Οδηγός_Ενημέρωσης_Ιστοτόπου_ΠΜΣ_ΓΣΠ.docx` (handover and update manual for TYPO3).
- **Tech Stack**: Plain bilingual semantic HTML5, CSS3 (`gis.css`), Vanilla ES6 JavaScript (`gis.js`). No build step or package managers required.

## Key Files
- `index.content.html`: HTML shell injected into the English & Greek TYPO3 site root HTML content elements.
- `gis.css`: Core layout, responsive navigation, and styling.
- `gis.js`: Client-side hash routing (`ROUTES`), language switcher, dynamic content injection.
- `pages/`: Individual page fragments for curriculum, announcements, faculty, and events.
- `calendar/`: `.ics` calendar events.
- `fileadmin/`: Mirrored media, documents, and `admin-config.json`.

## Deployment / Update Procedure
1. Connect to UoA VPN (`connect-uoa-vpn.ps1`).
2. Log in to <https://gis.geol.uoa.gr/typo3/>.
3. Common static files (`gis.css`, `gis.js`, `pages/`, `calendar/`) are uploaded via TYPO3 Filelist to:
   ```text
   /fileadmin/depts/geol.uoa.gr/gis/uploads/gis/
   ```
4. Changes take effect immediately upon upload. If caching persists, increment the version query parameter `?v=` in `index.content.html`.

