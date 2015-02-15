ICON=${1:-"app-icon.png"}

mkdir android
convert $ICON -resize 36x36 android/icon-36-ldpi.png
convert $ICON -resize 48x48 android/icon-48-mdpi.png
convert $ICON -resize 72x72 android/icon-72-hdpi.png
convert $ICON -resize 96x96 android/icon-96-xhdpi.png