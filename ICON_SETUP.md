# Laurion App Icon — Installation Instructions

Your Laurion logo has been processed into all required Android sizes.

## Files Generated

| Folder | File | Size | Used for |
|--------|------|------|----------|
| `mipmap-mdpi` | `ic_launcher.png` | 48×48 | Low-density screens |
| `mipmap-hdpi` | `ic_launcher.png` | 72×72 | Medium-density screens |
| `mipmap-xhdpi` | `ic_launcher.png` | 96×96 | High-density screens |
| `mipmap-xxhdpi` | `ic_launcher.png` | 144×144 | Extra-high-density |
| `mipmap-xxxhdpi` | `ic_launcher.png` | 192×192 | Extra-extra-high |
| `mipmap-*/` | `ic_launcher_round.png` | same | Circular icon variant |
| `assets/images/` | `playstore-icon.png` | 512×512 | Google Play Store listing |

---

## Step 1 — Copy Icons into Android Project

After running `npx react-native init LaurionApp` (which creates the android/ folder),
copy the icon folders into your Android project:

```bash
# From inside LaurionApp/
cp -r android_icons/mipmap-mdpi/*     android/app/src/main/res/mipmap-mdpi/
cp -r android_icons/mipmap-hdpi/*     android/app/src/main/res/mipmap-hdpi/
cp -r android_icons/mipmap-xhdpi/*    android/app/src/main/res/mipmap-xhdpi/
cp -r android_icons/mipmap-xxhdpi/*   android/app/src/main/res/mipmap-xxhdpi/
cp -r android_icons/mipmap-xxxhdpi/*  android/app/src/main/res/mipmap-xxxhdpi/
```

## Step 2 — Verify AndroidManifest.xml

Open `android/app/src/main/AndroidManifest.xml` and confirm:

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ...>
```

These are the defaults in every React Native project — you shouldn't need to change anything.

## Step 3 — Play Store Icon

Upload `assets/images/playstore-icon.png` (512×512) when filling in your Play Store listing under:
**Store listing → Graphics → App icon**

---

## App Icon Preview

Your icon features:
- The bold **"L"** lettermark in deep navy
- Green **leaves** (growth, learning)
- **Circuit board** connections (technology)  
- Open **books** (education)

This will display beautifully on all Android home screens and in the Play Store.
