# Typography accuracy and comparison preview

This branch preserves the existing page-size controls and adds a four-font comparison workspace.

## Run locally

```bash
npm install
npm run lint
npm test
npm run build
npm run dev
```

## Manual checks

1. Select two to four fonts with **Compare**. Open the comparison workspace, change the shared preview text, size and spacing, then return to the catalog. Selection should remain. A fifth font cannot be added until another is removed.
2. Try Vietnamese text: `Cà phê sáng — Đậm vị, tròn hương. Ắ ằ ễ ộ ự đ Đ · 29.000₫`. Use the Vietnamese subset filter when checking language support.
3. Select a weight on a variable font. The main preview and copied CSS should use that weight. Moving the weight axis clears the discrete selection; resetting axes restores defaults.
4. Copy CSS from a card. It should include size, weight, style, spacing, alignment, colors when selected and variable settings when available. Denied clipboard permission should produce an error toast.
5. Block fonts.googleapis.com in browser DevTools and choose a previously unloaded font. It should show an error rather than claim the fallback is the selected font. Unblock it and press Retry.
6. Save a valid Google Fonts API key while a cache exists. Catalog metadata should refresh; variable metadata uses capability=VF while static variants are preserved for weight pills.
7. Switch Vietnamese, English and Chinese. New comparison controls should follow the selected language.
8. Enable reduced motion and test a narrow viewport. Ambient animation should stop; mobile cards use a lighter rendering style.

## Limits

- Automated tests cover URL generation, shared loading requests, stylesheet failure/retry and empty font-face results. Real font rendering and API credentials require manual browser checks.
- The built-in catalog is an existing curated snapshot; font metadata may age. Live API data is recommended for checking non-weight variable axes.
- Comparison selections and individual preview adjustments are session state and are not synchronized across devices.
