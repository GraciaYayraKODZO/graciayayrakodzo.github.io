# Portfolio — KODZO Yayra Gracia

Site personnel : projets, parcours, distinctions et engagements.
En ligne sur **https://graciayayrakodzo.github.io**

Version actuelle : site statique en HTML, CSS et un peu de JavaScript, sans outil de build.
Une migration vers Astro + TypeScript + Tailwind est prévue plus tard.

## Structure

```
index.html              Accueil : présentation, en ce moment, projets, parcours, galerie, contact
projet-agriflash.html   Étude de cas AgriFlash
style.css               Tout le style (couleurs, polices, mise en page, version téléphone)
photos/                 Photos (déjà réduites, ~100–300 Ko chacune)
.nojekyll               Dit à GitHub Pages de servir les fichiers tels quels
```

## Identité visuelle (variables en haut de `style.css`)

| Rôle | Couleur |
|---|---|
| Rouge vin (principal) | `#6D1735` |
| Bordeaux (secondaire) | `#8F2948` |
| Bleu nuit (texte) | `#14243A` |
| Ivoire (fond) | `#FAF7F5` |
| Vert (AgriFlash seulement) | `#1F7A4D` |

Polices : Playfair Display (titres), Inter (texte), JetBrains Mono (dates), Caveat (manuscrit).

## Modifier le site

1. Ouvre le dossier dans VS Code.
2. Modifie `index.html` ou `style.css`.
3. Pour voir le résultat : double-clic sur `index.html`, ou l'extension **Live Server** de VS Code.

### Ajouter une photo dans la galerie

1. Réduis la photo (largeur 1600 px max, moins de 400 Ko) et mets-la dans `photos/`.
2. Dans `index.html`, section `id="images"`, copie un bloc `<figure>` et change :
   - `data-g` : la catégorie (`tcc`, `qylc`, `access`, `agriflash`) ;
   - `src` : le chemin de la photo ;
   - `alt` : une description de la photo (pour l'accessibilité) ;
   - `figcaption` : la légende.

### Ajouter un projet

Copie une carte `<a class="projet">` dans la section `id="projets"`.
Pour une étude de cas, duplique `projet-agriflash.html` et adapte le contenu.

## Publier une modification

```bash
git add .
git commit -m "Description courte du changement"
git push
```

GitHub Pages met le site à jour en 1 à 2 minutes.

## À faire

- [ ] Bouton « Télécharger mon CV » : ajouter les PDF (FR et EN) et relier le bouton.
- [ ] Bouton FR / EN : créer la version anglaise.
- [ ] Pages HANDOO, EcoComfort et AcadPro (les liens pointent pour l'instant vers des ancres vides).
- [ ] Pages détaillées : parcours, engagements, distinctions.
- [ ] Migration vers Astro + TypeScript + Tailwind.

## Confidentialité

- Ne jamais publier : pièce d'identité, relevés de notes, numéro de téléphone, documents internes.
- Photos avec d'autres personnes (surtout des mineurs) : publier seulement avec leur accord.
