# Codebase του ιστοτόπου του Π.Μ.Σ. «Γεωγραφικά Συστήματα Πληροφοριών»

Το παρόν είναι ένα καθαρό snapshot των custom αρχείων του ιστοτόπου, με ημερομηνία 2 Σεπτεμβρίου 2026. Περιλαμβάνει το code, τα page fragments και τα local assets που χρειάζονται για τη συντήρησή του. Δεν είναι πλήρες backup του TYPO3 ή του server. Αναλυτικές οδηγίες διαχείρισης και ενημέρωσης περιέχονται στον επίσημο οδηγό `..\Οδηγός_Ενημέρωσης_Ιστοτόπου_ΠΜΣ_ΓΣΠ.docx`.

Ο ιστότοπος είναι plain HTML, CSS και JavaScript. Δεν χρειάζεται build, `node_modules` ή κάποιο package manager για να ενημερωθεί.

## Πώς λειτουργεί

Στο TYPO3 υπάρχουν δύο site roots, ένα για κάθε domain:

- English: <https://gis.geol.uoa.gr/>
- Greek: <https://gis-el.geol.uoa.gr/>

Το ίδιο HTML content από το `index.content.html` είναι τοποθετημένο στο HTML content element του κάθε site root. Το domain καθορίζει τη γλώσσα. Το `gis.js` διαβάζει το hash του URL, βρίσκει το αντίστοιχο αρχείο στο `pages` και το φορτώνει μέσα στο page shell.

Τα περισσότερα page fragments περιέχουν και τις δύο γλώσσες, με `data-en` και `data-el` ή με αντίστοιχα διακριτά blocks. Μια αλλαγή σε κοινό αρχείο μπορεί επομένως να επηρεάσει και τις δύο εκδόσεις.

## Δομή του φακέλου

- `index.content.html`: το HTML content που μπαίνει στα δύο site roots. Δεν ανεβαίνει στο Filelist.
- `gis.css`: όλη η εμφάνιση, το layout και το responsive behaviour.
- `gis.js`: navigation, language selection, hash routing, components κι content loading.
- `hero-delta.jpg`: κοινή background image που καλείται από το `gis.css`.
- `pages/`: ένα HTML fragment για κάθε σελίδα, νέο ή πρόσωπο.
- `calendar/`: τα `.ics` αρχεία που χρησιμοποιούν οι σελίδες εκδηλώσεων.
- `fileadmin/`: local mirror των εικόνων, logos, documents και του `admin-config.json` που υπάρχουν σε συγκεκριμένες θέσεις του TYPO3.

Ορισμένα υπάρχοντα documents και profile images καλούνται με absolute URLs από τον live server. Παραμένουν στο TYPO3 και δεν διπλασιάζονται εδώ.

## Πού ενημερώνεται κάθε αρχείο

Τα κοινά αρχεία ανεβαίνουν στο Filelist, στον φάκελο:

```text
/fileadmin/depts/geol.uoa.gr/gis/uploads/gis/
```

Εκεί αντιστοιχούν άμεσα τα `gis.css`, `gis.js`, `hero-delta.jpg`, `pages/` και `calendar/`. Τα assets μέσα στο `fileadmin/` πρέπει να ανεβαίνουν στην ίδια σχετική θέση που δείχνει η δομή του φακέλου.

Το `index.content.html` δεν ενημερώνεται από το Filelist. Το content του αντικαθιστάται στο HTML content element του English site root και του Greek site root.

## Συνήθης διαδικασία αλλαγής

1. Συνδεθείτε στο VPN του ΕΚΠΑ και ανοίξτε το <https://gis.geol.uoa.gr/typo3/>.
2. Πριν από την αλλαγή, ελέγξτε αν το live αρχείο είναι νεότερο από αυτό το snapshot και κρατήστε backup.
3. Ενημερώστε το file μέσα από τον editor του TYPO3 ή κάντε Download, αλλάξτε το local και ανεβάστε το με Upload και Overwrite.
4. Ελέγξτε και τις δύο γλωσσικές εκδόσεις.
5. Αν μια νέα έκδοση του `gis.css` ή του `gis.js` δεν εμφανιστεί, αλλάξτε την τιμή `?v=` στο HTML content και των δύο site roots.

## Αλλαγή ή προσθήκη σελίδας

Για αλλαγή υπάρχουσας σελίδας, βρείτε το αντίστοιχο file στο `pages/` και διατηρήστε την υπάρχουσα δομή των δύο γλωσσών.

Για νέα σελίδα συνήθως χρειάζονται:

1. ένα νέο HTML fragment στο `pages/`,
2. μια νέα εγγραφή στο `ROUTES` του `gis.js`,
3. η αντίστοιχη προσθήκη στο navigation ή στη σελίδα που θα τη συνδέει,
4. τυχόν νέα styles στο `gis.css`.

Αν αλλάξει το όνομα ενός file ή ενός route, ελέγξτε όλα τα links και τις εγγραφές του `ROUTES` που το χρησιμοποιούν.

## Σημαντικά

- Διατηρήστε τα text files σε UTF-8.
- Μην βάζετε passwords, personal data ή άλλα εμπιστευτικά στο `gis.js`, στο `admin-config.json` ή στα page fragments. Τα αρχεία αυτά είναι δημόσια προσβάσιμα.
- Μην αλλάζετε τη δομή των φακέλων χωρίς να ενημερώσετε τα paths στο `gis.js`, στο `gis.css` κι στα page fragments.
- Το Filelist χρησιμοποιεί τη νέα έκδοση αμέσως μετά το Save ή το Overwrite. Δεν υπάρχει ξεχωριστό publish για αυτά τα files.

## Τι δεν περιλαμβάνεται

Από το handover έχουν αφαιρεθεί όλα όσα δεν είναι μέρος του live ιστοτόπου: development dependencies, `node_modules`, local QA files, screenshots, browser captures, editor settings, caches, session/history files, hidden repository data και παλαιότερα ενδιάμεσα αρχεία.
